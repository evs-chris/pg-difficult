package main

import (
	"context"
	"errors"

	"fmt"

	"log/slog"

	"archive/zip"
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	_ "embed"
	"io/fs"

	"os"
	"os/signal"
	"runtime"
	"sync"
	"syscall"
	"time"

	"github.com/alecthomas/kong"

	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
	"github.com/jackc/pgx/v5"
)

//go:embed VERSION
var VERSION string

//go:embed public.zip
var staticAssets []byte

var Config struct {
	Port      int               `short:"p" default:"1999" env:"PORT" help:"Set the TCP port on which to listen."`
	Address   string            `name:"listen" short:"l" default:"127.0.0.1" env:"INTERFACE" help:"Set the network interface on which to bind the server."`
	ClientDev bool              `name:"client-dev" default:false env:"CLIENT_DEV" help:"Load client files from the public directory in the current working directory."`
	Interval  int64             `short:"t" default:"10000" env:"INTERVAL" help:"Set the polling interval for monitoring leaks."`
	NoUI      bool              `name:"noui" default:"false" env:"NOUI" help:"Don't attempt to open the pg-difficult page in the default browser upon server startup"`
	User      string            `name:"user" short:"u" env:"PGDIFF_USER" help:"Set an HTTP basic auth user that is required to access the server. If no password is supplied, it defaults to an empty string."`
	Password  string            `name:"password" short:"w" env:"PGDIFF_PASSWORD" help:"Set an HTTP basic auth passwoed that is required to access the server. If no user is supplied, the password is ignored."`
	Users     map[string]string `name:"users" env:"PGDIFF_USERS" help:"Set an HTTP basic auth that requires matching credentials from this list. This overrides the singular user and password flags." placeholder:"\"USER=PASSWORD;...\""`
}

var runningContext, stopRunning = context.WithCancel(context.Background())

func main() {
	// set up logging
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	kong.Parse(&Config, kong.UsageOnError(), kong.DefaultEnvars(""), kong.Description(`pg-difficult allows setting up database diffs in PostgreSQL databases. Changes are tracked by creating a diff function in a new schema, pgdifficult, and attaching it as trigger on every table in the database at the time the diff is started.

Stopping a diff will remove the triggers, function, and schema from the database. Gracefully stopping the server will also stop all diffs that the server is controlling.

WARNING: Starting a diff in a database will modify the database and introduce significant overhead for CRUD operations. Change tracking tables have no additional security constraints, so any user with access to the database will be able to view any changes that are recorded.

pg-difficult version `+VERSION+`
`), kong.Configuration(kong.JSON, "~/.pg-difficult.json"))
	if Config.Address == "*" {
		Config.Address = ""
	}

	if Config.Interval < 1000 {
		Config.Interval = 10000
	}
	leakInterval = time.Duration(Config.Interval) * time.Millisecond

	if Config.Users != nil {
		logins = make([]Login, 0, len(Config.Users))
		for k, v := range Config.Users {
			logins = append(logins, Login{User: k, Password: v})
		}
	} else if Config.User != "" {
		logins = []Login{Login{User: Config.User, Password: Config.Password}}
	}

	// asset serving
	var assetDir fs.FS
	if Config.ClientDev {
		assetDir = os.DirFS("./public")
		slog.Info("Running in local client development mode. Embedded assets will not be available.")
	} else {
		reader := bytes.NewReader(staticAssets)
		zipFile, err := zip.NewReader(reader, int64(len(staticAssets)))
		if err != nil {
			slog.Error("Failed to load compressed embedded assets", "error", err)
			return
		}
		assetDir, err = fs.Sub(zipFile, "public")
		if err != nil {
			slog.Error("Failed to load embedded assets", "error", err)
			return
		}
	}
	fileServer := http.FileServer(http.FS(assetDir))

	// routes
	mux := http.NewServeMux()
	mux.Handle("/", fileServer)
	mux.HandleFunc("GET /ws", wsHandler)

	var handler http.Handler = mux
	if logins != nil {
		handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var login *Login
			user, pw, ok := r.BasicAuth()
			if ok {
				for _, l := range logins {
					if l.User == user && l.Password == pw {
						login = &l
						break
					}
				}
			}
			if login == nil {
				w.Header().Set("www-authenticate", `Basic realm="pg-difficult"`)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			mux.ServeHTTP(w, r)
		})
	}

	// server
	server := &http.Server{
		Addr:         fmt.Sprintf("%v:%v", Config.Address, Config.Port),
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// start the server
	var stopSockets context.CancelFunc
	go func() {
		done, cancel := context.WithCancel(context.Background())
		stopSockets = cancel
		go makeSocketClients().Run(done)

		logger.Info("Starting server", "socket", server.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	if !Config.NoUI {
		addr := Config.Address
		if addr == "" {
			addr = "127.0.0.1"
		}
		err := openURL("http://" + addr + ":" + strconv.Itoa(Config.Port) + "/")
		if err != nil {
			slog.Error("Failed to open client in default browser", "error", err)
		} else {
			slog.Info("Client opened in default browser")
		}
	}

	// shutdown channel
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	select {
	case <-stop:
		break
	case <-runningContext.Done():
		break
	}

	stopSockets()
	logger.Info("Shutting down pg-difficult server...")

	// Create a context with a timeout for the shutdown process
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()

	// clean up any running diffs
	wg := sync.WaitGroup{}
	for i, d := range diffs {
		wg.Go(func() {
			conn, err := connectTo(&d.Config, "pgdiff stop")
			if err != nil {
				slog.Error("Failed to stop diff "+strconv.Itoa(i), "error", err)
				return
			}
			err = StopDiff(conn)
			if err != nil {
				slog.Error("Failed to stop diff "+strconv.Itoa(i), "error", err)
				return
			}
			conn.Close(context.Background())
			slog.Info("Stopped diff " + strconv.Itoa(i))
		})
	}

	if err := server.Shutdown(ctx); err != nil {
		logger.Error("pg-difficult stopped forcefully", "error", err)
	}

	wg.Wait()

	logger.Info("pg-difficult stopped")
}

// state
type LeakOpts struct {
	Interval int
}

var idseq int = 0

type DiffClient struct {
	Id         int
	Config     DBConfig
	Opts       *StartOptions
	ListenConn *pgx.Conn
	StopListen *context.CancelFunc `json:"-"`
	Hide       bool
	Segment    string
}
type LeakClient struct {
	Id        int
	Config    DBConfig
	Opts      *LeakOpts
	PollConn  *pgx.Conn
	Initial   map[string][]ConnectedClient
	Current   []ConnectedClient
	Databases []string
}

var lock = sync.RWMutex{}
var diffs = make(map[int]*DiffClient)
var leaks = make(map[int]*LeakClient)
var globalSegment = "Initial"

type Login struct {
	User     string `json:"user"`
	Password string `json:"password"`
}

var logins []Login

// route handlers

// socket handler
var socketClients *_socketClients

type _socketClients struct {
	clients    map[*websocket.Conn]bool
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
}

func (s *_socketClients) Run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			slog.Info("Stopping websocket clients", "name", "websocket")
			return

		case conn := <-s.register:
			lock.Lock()
			s.clients[conn] = true
			lock.Unlock()

		case conn := <-s.unregister:
			lock.Lock()
			delete(s.clients, conn)
			lock.Unlock()
		}
	}
}
func makeSocketClients() *_socketClients {
	socketClients = &_socketClients{
		clients:    make(map[*websocket.Conn]bool),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
	}
	return socketClients
}
func notifyAll(msg *map[string]any) {
	lock.RLock()
	for conn, ok := range socketClients.clients {
		if ok {
			wsjson.Write(context.Background(), conn, msg)
		}
	}
	lock.RUnlock()
}

type BaseMessage struct {
	Action string `json:"action"`
	Id     *int64 `json:"id"`
}

type DBConfig struct {
	Host           string        `json:"host"`
	Username       string        `json:"username"`
	Password       string        `json:"password"`
	Port           int           `json:"port"`
	Database       string        `json:"database"`
	Ssl            string        `json:"ssl"`
	Diffopts       *StartOptions `json:"diffopts"`
	ConnectTimeout int
	QueryTimeout   int
}

func connectTo(config *DBConfig, name string) (*pgx.Conn, error) {
	user := "postgres"
	password := config.Password
	host := "localhost"
	database := "postgres"
	port := 5432
	ssl := "prefer"
	if config.Host != "" {
		host = config.Host
	}
	if config.Username != "" {
		user = config.Username
	}
	if config.Port != 0 {
		port = config.Port
	}
	if config.Ssl != "" {
		ssl = config.Ssl
	}
	if config.Database != "" {
		database = config.Database
	}
	if name == "" {
		name = "pgdiff"
	}
	timeout := config.ConnectTimeout
	if timeout == 0 {
		timeout = 20000
	}
	str := "postgres://" + user + ":" + password + "@" + host + ":" + strconv.Itoa(port) + "/" + database + "?sslmode=" + ssl + "&application_name=" + name
	ctx, _ := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Millisecond)
	return pgx.Connect(ctx, str)
}

func connectionOk(conn *pgx.Conn) bool {
	ctx, _ := context.WithTimeout(context.Background(), 20*time.Second)
	err := conn.Ping(ctx)
	if err != nil {
		return false
	}
	return true
}

type ClientConfigMessage struct {
	Client DBConfig `json:"client"`
}
type ConfigClientMessage struct {
	Config DBConfig `json:"config"`
}
type ClientIdMessage struct {
	Client int `json:"client"`
}

func configForMessage(msg []byte) (*DBConfig, error) {
	var client *DBConfig
	tmp := map[string]any{}
	_ = json.Unmarshal(msg, &tmp)
	if field, ok := tmp["client"]; ok {
		if id, ok := field.(float64); ok {
			lock.RLock()
			defer lock.RUnlock()
			if diff, ok := diffs[int(id)]; ok {
				client = &diff.Config
			} else if leak, ok := leaks[int(id)]; ok {
				client = &leak.Config
			} else {
				return nil, errors.New("Unknown connection id " + strconv.Itoa(int(id)))
			}
		} else if strid, ok := field.(string); ok {
			if id, err := strconv.Atoi(strid); err == nil {
				lock.RLock()
				defer lock.RUnlock()
				if diff, ok := diffs[int(id)]; ok {
					client = &diff.Config
				} else if leak, ok := leaks[int(id)]; ok {
					client = &leak.Config
				} else {
					return nil, errors.New("Unknown connection id " + strconv.Itoa(int(id)))
				}
			} else {
				return nil, errors.Join(errors.New("Unknown connection id "+strid), err)
			}
		} else {
			var cfgmsg ClientConfigMessage
			if err := json.Unmarshal(msg, &cfgmsg); err != nil {
				return nil, err
			}
			client = &cfgmsg.Client
		}
	}

	if client == nil {
		if field, ok := tmp["diff"]; ok {
			if id, ok := field.(float64); ok {
				lock.RLock()
				defer lock.RUnlock()
				if diff, ok := diffs[int(id)]; ok {
					client = &diff.Config
				} else if leak, ok := leaks[int(id)]; ok {
					client = &leak.Config
				} else {
					return nil, errors.New("Unknown connection id " + strconv.Itoa(int(id)))
				}
			}
		} else if strid, ok := field.(string); ok {
			if id, err := strconv.Atoi(strid); err == nil {
				lock.RLock()
				defer lock.RUnlock()
				if diff, ok := diffs[int(id)]; ok {
					client = &diff.Config
				} else if leak, ok := leaks[int(id)]; ok {
					client = &leak.Config
				} else {
					return nil, errors.New("Unknown connection id " + strconv.Itoa(int(id)))
				}
			} else {
				return nil, errors.Join(errors.New("Unknown connection id "+strid), err)
			}
		}
	}

	if client == nil {
		if _, ok := tmp["config"]; ok {
			var cfgmsg ConfigClientMessage
			if err := json.Unmarshal(msg, &cfgmsg); err != nil {
				return nil, err
			}
			client = &cfgmsg.Config
		}
	}

	if client == nil {
		return nil, errors.New("No client specified")
	}

	return client, nil
}

type QueryMessage struct {
	BaseMessage
	Query  []string `json:"query"`
	Params [][]any  `json:"params"`
}

type QueryAllMessage struct {
	QueryMessage
	Clients []struct {
		Host           string   `json:"host"`
		Username       string   `json:"username"`
		Password       string   `json:"password"`
		Port           int      `json:"port"`
		Databases      []string `json:"databases"`
		Ssl            string   `json:"ssl"`
		ConnectTimeout int
	} `json:"clients"`
	Batch *int `json:"batch"`
}

type StartMessage struct {
	BaseMessage
	Client any `json:"client"`
}

type StartMessageOptions struct {
	Config struct {
		Diffopts StartOptions `json:"diffopts"`
	} `json:"config"`
	GlobalSegment *bool `json:"globalsegment"`
}

type LeakIntervalMessage struct {
	BaseMessage
	Time int `json:"time"`
}

type CheckMessage struct {
	BaseMessage
	Since *int64 `json:"since"`
}

type SegmentMessage struct {
	BaseMessage
	Segment string `json:"segment"`
}

type HideMessage struct {
	BaseMessage
	Hide bool `json:"hide"`
}

type StateMessage struct {
	BaseMessage
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Responders struct {
	Respond func(id *int64, response map[string]any)
	Error   func(id *int64, err error)
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		slog.Error("Failed to upgrade to websocket", "error", err)
		return
	}

	socketClients.register <- conn
	defer func() {
		socketClients.unregister <- conn
		conn.Close(websocket.StatusInternalError, "closing")
	}()
	slog.Info("Got a new client", "address", &conn)

	ctx := r.Context()

	resplock := sync.Mutex{}
	respond := func(id *int64, response map[string]any) {
		if id != nil {
			response["id"] = *id
		}
		resplock.Lock()
		err := wsjson.Write(ctx, conn, response)
		resplock.Unlock()
		if err != nil {
			slog.Error("Failed to send response", "error", err, "response", response)
			if id != nil {
				resplock.Lock()
				err := wsjson.Write(ctx, conn, map[string]any{"id": *id, "error": err.Error()})
				resplock.Unlock()
				if err != nil {
					slog.Error("Failed to send follow-up error response", "error", err)
				}
			}
		}
	}

	errespond := func(id *int64, err error) {
		slog.Error("Sending error to client", "client", &conn, "error", err)
		response := map[string]any{"action": "error", "error": err.Error()}
		if id != nil {
			response["id"] = *id
		}
		resplock.Lock()
		e := wsjson.Write(ctx, conn, response)
		resplock.Unlock()
		if e != nil {
			slog.Error("Failed to send response", "error", e, "response", response)
		}
	}

	responders := Responders{Respond: respond, Error: errespond}

messages:
	for {
		_, msg, err := conn.Read(ctx)
		if err != nil {
			slog.Info("Client disconnected", "address", &conn)
			return
		}

		var base BaseMessage
		if err := json.Unmarshal(msg, &base); err != nil {
			slog.Error("Invalid socket message", "error", err)
			continue
		}

		switch base.Action {
		case "status":
			go status(&responders, base.Id)
		case "ping":
			respond(base.Id, map[string]any{"action": "pong"})
		case "restart":
			fallthrough
		case "resume":
			fallthrough
		case "start":
			var restart string
			if base.Action == "restart" {
				restart = "restart"
			} else if base.Action == "resume" {
				restart = "resume"
			}

			client, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			var sm StartMessageOptions
			if err := json.Unmarshal(msg, &sm); err != nil {
				slog.Error("Invalid start message", "error", err)
				errespond(base.Id, err)
				continue
			}
			global := false
			if sm.GlobalSegment == nil || *sm.GlobalSegment == true {
				global = true
			}
			sm.Config.Diffopts.GlobalSegment = &global
			go processStartMessage(client, &sm.Config.Diffopts, &responders, base.Id, restart)
		case "check":
			client, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			var cm CheckMessage
			err = json.Unmarshal(msg, &cm)
			if err != nil {
				slog.Error("Invalid check message", err)
				errespond(base.Id, err)
				continue
			}
			var since int64 = -1
			if cm.Since != nil {
				since = *cm.Since
			}
			go processCheckMessage(client, since, &responders, base.Id)
		case "segment":
			client, _ := configForMessage(msg)
			var sm SegmentMessage
			err = json.Unmarshal(msg, &sm)
			if err != nil {
				slog.Error("Invalid segment message", err)
				errespond(base.Id, err)
				continue
			}
			go processSegmentMessage(client, sm.Segment, &responders, base.Id)
		case "hide":
			var hm HideMessage
			err = json.Unmarshal(msg, &hm)
			if err != nil {
				slog.Error("Invalid hide message", err)
				errespond(base.Id, err)
				continue
			}
			client, err := configForMessage(msg)
			if err != nil {
				go processHideMessage(nil, hm.Hide, &responders, base.Id)
			} else {
				go processHideMessage(client, hm.Hide, &responders, base.Id)
			}
		case "clear":
			tmp := map[string]any{}
			err := json.Unmarshal(msg, tmp)
			if err != nil {
				if source, ok := tmp["source"]; ok {
					if str, ok := source.(string); ok {
						lock.RLock()
						for _, diff := range diffs {
							if ConfigString(&diff.Config) == str {
								go processClearMessage(&diff.Config)
								continue messages
							}
						}
						lock.RUnlock()
					}
				}
			}
			go processClearMessage(nil)
		case "stop":
			client, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			go processStopMessage(client, &responders, base.Id)
		case "query":
			client, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			var qm QueryMessage
			if err := json.Unmarshal(msg, &qm); err != nil {
				slog.Error("Invalid query message", "error", err)
				errespond(base.Id, err)
			} else {
				go (func() {
					err := processQueryMessage(client, &qm, &responders)
					if err != nil {
						errespond(qm.Id, err)
					}
				})()
			}
		case "query-all":
			var qm QueryAllMessage
			err := json.Unmarshal(msg, &qm)
			if err != nil {
				errespond(base.Id, errors.New("Not implemented"))
			}
			go processQueryAllMessage(&qm, &responders, base.Id)
		case "leak":
			cfg, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			go func() {
				err = leak(cfg, &leakInterval)
				if err != nil {
					errespond(base.Id, err)
				}
				status(nil, nil)
			}()
		case "unleak":
			cfg, err := configForMessage(msg)
			if err != nil {
				errespond(base.Id, err)
				continue
			}
			id := -1
			lock.RLock()
			for i, leak := range leaks {
				c := leak.Config
				if cfg.Host == c.Host && cfg.Port == c.Port {
					id = i
				}
			}
			lock.RUnlock()
			if id == -1 {
				errespond(base.Id, errors.New("Cannot stop what is not started"))
				continue
			}
			go func() {
				err = unleak(id, cfg.Database)
				if err != nil {
					errespond(base.Id, err)
					return
				}
				status(nil, nil)
			}()
		case "interval":
			go (func() {
				var lm LeakIntervalMessage
				err := json.Unmarshal(msg, &lm)
				if err != nil {
					slog.Error("Invalid leak interval message", "error", err)
					errespond(base.Id, err)
				} else {
					if lm.Time < 1000 {
						lm.Time = 10000
					}
					lock.Lock()
					leakInterval = time.Duration(lm.Time) * time.Millisecond
					if leakTicker != nil {
						slog.Info("Resetting leak poller interval to", "time", leakInterval)
						leakTicker.Reset(leakInterval)
					}
					lock.Unlock()
					status(nil, nil)
				}
			})()
		case "schema":
			go (func() {
				client, err := configForMessage(msg)
				if err != nil {
					errespond(base.Id, err)
					return
				}
				conn, err := connectTo(client, "pgdiff schema")
				if err != nil {
					errespond(base.Id, err)
					return
				}
				defer conn.Close(context.Background())
				schema, err := schema(conn)
				if err != nil {
					errespond(base.Id, err)
					return
				}
				respond(base.Id, map[string]any{"action": "schema", "schema": schema})
			})()
		case "fetch":
			go (func() {
				var fm FetchRequest
				err := json.Unmarshal(msg, &fm)
				if err != nil {
					slog.Error("Invalid fetch request message", "error", err)
					errespond(base.Id, err)
				} else {
					res, err := fetch(&fm)
					if err != nil {
						slog.Error("Failed fetch request", "error", err)
						errespond(base.Id, err)
						return
					}
					respond(base.Id, res)
				}
			})()
		case "halt":
			stopRunning()
		case "debug":
			runtime.GC()
			go (func() {
				respond(base.Id, map[string]any{"data": map[string]any{"state": map[string]any{"segment": globalSegment, "idseq": idseq, "diffs": diffs, "leaks": leaks}, "VERSION": VERSION, "config": Config}})
			})()
		case "crash":
			go (func() {
				panic("client requested server crash, so crashing")
			})()
		default:
			slog.Warn("Unknown action "+base.Action, "id", base.Id)
			errespond(base.Id, errors.New("Unknown action "+base.Action))
		}
	}
}

func status(respond *Responders, id *int64) {
	msg := map[string]any{"action": "status"}

	lock.RLock()
	_clients := map[int]any{}
	for i, v := range diffs {
		global := false
		if v.Opts == nil || v.Opts.GlobalSegment == nil || *v.Opts.GlobalSegment {
			global = true
		}
		_clients[i] = map[string]any{"id": i, "config": v.Config, "source": ConfigString(&v.Config), "connected": v.ListenConn != nil, "global": global, "segment": v.Segment}
	}

	_leaks := map[int]map[string]any{}
	for i, v := range leaks {
		if m, err := ToMap(v.Config, ""); err == nil {
			_leaks[i] = map[string]any{"id": i, "config": m, "databases": v.Databases, "initial": v.Initial, "current": v.Current, "connected": v.PollConn != nil, "source": ConfigString(&v.Config)}
		}
	}

	msg["status"] = map[string]any{"segment": globalSegment, "clients": _clients, "leaks": _leaks, "pollingInterval": leakInterval.Milliseconds(), "VERSION": VERSION}
	lock.RUnlock()

	if respond != nil {
		respond.Respond(id, msg)
	} else {
		notifyAll(&msg)
	}
}

var throttledStatusAll = Throttle(500*time.Millisecond, func() {
	status(nil, nil)
})

func processQueryMessage(config *DBConfig, req *QueryMessage, res *Responders) error {
	start := time.Now()
	conn, err := connectTo(config, "pgdiff query")
	if err != nil {
		return err
	}
	defer conn.Close(context.Background())

	transacting := true
	_, err = conn.Exec(context.Background(), "begin;")
	if err != nil {
		return err
	}

	var results []*QueryOrderedResult
doover:
	results = make([]*QueryOrderedResult, 0, len(req.Query))
	for i, q := range req.Query {
		var p []any
		if len(req.Params) > i {
			p = req.Params[i]
		} else {
			p = make([]any, 0)
		}
		res, err := queryOrdered(conn, q, p...)
		if err != nil {
			_, _ = conn.Exec(context.Background(), "rollback;")
			if strings.Contains(err.Error(), "cannot run inside a transaction block") {
				transacting = false
				goto doover
			} else {
				return err
			}
		}
		results = append(results, res)
	}

	if transacting {
		_, err = conn.Exec(context.Background(), "commit;")
		if err != nil {
			return err
		}
	}

	if len(results) == 1 {
		res.Respond(req.Id, map[string]any{"action": "query", "result": results[0].Rows, "time": time.Since(start).Milliseconds(), "affected": results[0].Affected, "fields": results[0].Fields})
	} else {
		rows := make([][]OrderedResult, len(results))
		counts := make([]int64, len(results))
		for i, r := range results {
			rows[i] = r.Rows
			counts[i] = r.Affected
		}
		res.Respond(req.Id, map[string]any{"action": "query", "result": rows, "affected": counts, "time": time.Since(start)})
	}

	return nil
}

func processQueryAllMessage(req *QueryAllMessage, res *Responders, id *int64) error {
	limit := 10
	if req.Batch != nil {
		limit = *req.Batch
	}
	count := 0
	for _, c := range req.Clients {
		count += len(c.Databases)
	}
	configs := make([]DBConfig, 0, count)
	for _, c := range req.Clients {
		for _, d := range c.Databases {
			configs = append(configs, DBConfig{Host: c.Host, Username: c.Username, Password: c.Password, Port: c.Port, Database: d, Ssl: c.Ssl, ConnectTimeout: c.ConnectTimeout})
		}
	}
	work := make(chan *DBConfig, limit*2)
	done := make(chan []any, limit*2)
	process := func() {
	outer:
		for cfg := range work {
			source := ConfigString(cfg)
			conn, err := connectTo(cfg, "pgdiff query-all")
			if err != nil {
				done <- []any{source, map[string]any{"error": err.Error()}}
				continue
			}
			_, err = conn.Exec(context.Background(), "begin;")
			if err != nil {
				done <- []any{source, map[string]any{"error": err.Error()}}
				conn.Close(context.Background())
				continue
			}
			last := len(req.Query) - 1
			var result *QueryOrderedResult
			for i, q := range req.Query {
				var p []any
				if len(req.Params) > i {
					p = req.Params[i]
				} else {
					p = []any{}
				}
				res, err := queryOrdered(conn, q, p...)
				if err != nil {
					_, _ = conn.Exec(context.Background(), "rollback;")
					done <- []any{source, map[string]any{"error": err.Error()}}
					conn.Close(context.Background())
					continue outer
				}
				if i == last {
					result = res
				}
			}
			conn.Close(context.Background())
			if result == nil {
				done <- []any{source, map[string]any{"error": "No result returned"}}
				continue
			}
			done <- []any{source, map[string]any{"rows": &result.Rows, "count": &result.Affected}}
		}
	}
	notifyKey := "query-all-progress"
	if id != nil {
		notifyKey += "-" + strconv.FormatInt(*id, 10)
	}
	go (func() {
		complete := 0
		results := make(map[string]any, count)
		for complete < count {
			result := <-done
			complete++
			results[result[0].(string)] = result[1]
			res.Respond(nil, map[string]any{"action": "notify", "notify": notifyKey, "queryId": id, "done": complete, "total": count})
		}
		close(work)
		close(done)
		res.Respond(id, map[string]any{"action": "query-all", "result": results})
	})()
	for i := 0; i < limit; i++ {
		go process()
	}
	for _, cfg := range configs {
		work <- &cfg
	}
	return nil
}

func processStartMessage(config *DBConfig, opts *StartOptions, res *Responders, id *int64, restart string) {
	lock.RLock()
	for _, v := range diffs {
		cfg := v.Config
		if cfg.Host == config.Host && cfg.Port == config.Port && cfg.Database == config.Database {
			res.Error(id, errors.New("Already connected to "+config.Database+" on "+config.Host+":"+strconv.Itoa(config.Port)))
			lock.RUnlock()
			return
		}
	}
	lock.RUnlock()

	conn, err := connectTo(config, "pgdiff listen")
	if err != nil {
		res.Error(id, err)
	}

	start := true
	// check for an existing diff
	_, err = query(conn, "select count(key) from pgdifficult.state")
	if err == nil && restart == "" {
		res.Respond(id, map[string]any{"action": "resume"})
		conn.Close(context.Background())
		return
	} else if err == nil && restart == "restart" {
		// if it exists and needs to stop, stop it
		err := StopDiff(conn)
		if err != nil {
			res.Error(id, errors.New("Failed to stop existing diff"))
			conn.Close(context.Background())
			return
		}
	} else if err == nil && restart == "resume" {
		start = false
	}

	// if it's new, start the diff
	if start {
		err = StartDiff(conn, opts)
		if err != nil {
			res.Error(id, err)
			conn.Close(context.Background())
			return
		}
	}
	_, err = conn.Exec(context.Background(), "listen __pg_difficult")
	if err != nil {
		err2 := StopDiff(conn)
		var err3 error
		if err2 != nil {
			err3 = errors.Join(err, err2)
		} else {
			err3 = err
		}
		res.Error(id, err3)
		conn.Close(context.Background())
		return
	}

	segment := "Initial"
	if opts != nil && opts.Segment != nil {
		segment = *opts.Segment
	}
	hide := false

	if !start { // we resumed
		if opts == nil || opts.GlobalSegment == nil || *opts.GlobalSegment {
			err := SetState(conn, "segment", globalSegment)
			if err != nil {
				slog.Warn("Failed to set segment on resumed global diff", "error", err, "diff", idseq)
			} else {
				segment = globalSegment
			}
		} else {
			segment, err = GetState(conn, "segment")
			if err != nil || segment == "" {
				segment = globalSegment
			}
		}
		hidestr, err := GetState(conn, "hide")
		if err == nil && hidestr == "true" {
			hide = true
		}
	}

	lock.Lock()
	did := idseq
	idseq += 1
	diff := &DiffClient{Id: did, Config: *config, Opts: opts, ListenConn: conn, Segment: segment, Hide: hide}
	diffs[did] = diff
	lock.Unlock()

	// set up db listen handler
	go (func() {
		base := BaseMessage{}
		throttleCheck := Throttle(333*time.Millisecond, func() {
			notifyAll(&map[string]any{"action": "check", "client": did, "source": ConfigString(&diff.Config)})
		})
	listener:
		for {
			ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			lock.Lock()
			diff.StopListen = &cancel
			lock.Unlock()
			n, err := conn.WaitForNotification(ctx)
			if (err != nil && !errors.Is(err, context.DeadlineExceeded)) || !connectionOk(conn) {
				lock.RLock()
				if _, ok := diffs[did]; !ok {
					_, err := conn.Exec(context.Background(), "unlisten __pg_difficult")
					if err != nil {
						slog.Error("Failed to unlisten", "error", err)
					}
					conn.Close(context.Background())
					slog.Info("Diff listener diconnected after stop", "diff", did)
					lock.RUnlock()
					break
				} else {
					slog.Error("Notification listener connection interrupted, reconnecting", "error", err)
					lock.RUnlock()
					ctx, _ := context.WithTimeout(context.Background(), 20*time.Second)
					_ = conn.Close(ctx)
					lock.Lock()
					conn = nil
					diff.ListenConn = nil
					cfg := diff.Config
					lock.Unlock()
					throttledStatusAll()
					for conn == nil {
						lock.RLock()
						if _, ok := diffs[did]; !ok {
							slog.Info("Diff stopped while tring to re-establish listener", "diff", did)
							lock.RUnlock()
							return
						}
						lock.RUnlock()
						conn, err = connectTo(&cfg, "pgdiff listen")
						if err == nil {
							_, err = conn.Exec(context.Background(), "listen __pg_difficult")
							if err != nil {
								slog.Error("Error starting new diff listener", "error", err, "diff", did)
								ctx, _ := context.WithTimeout(context.Background(), 20*time.Second)
								_ = conn.Close(ctx)
								conn = nil
							} else {
								lock.Lock()
								diff.ListenConn = conn
								lock.Unlock()
								slog.Info("Diff listener connection re-established", "diff", did)
								throttledStatusAll()
								continue listener
							}
						} else {
							time.Sleep(10 * time.Second)
						}
					}
					if conn != nil {
						continue listener
					}
				}
			} else if err != nil {
				// no notifications, so wait for more
				continue
			}
			action := n.Payload
			if action[0] == '{' {
				err = json.Unmarshal([]byte(n.Payload), &base)
				if err != nil {
					slog.Error("Invalid diff listener notification", "error", err, "message", n.Payload)
					continue
				}
				action = base.Action
			}
			// TODO: will ping be needed at some point?
			switch action {
			case "record":
				throttleCheck()
			case "segment":
				var sm SegmentMessage
				err := json.Unmarshal([]byte(n.Payload), &sm)
				if err != nil {
					slog.Error("Invalid segment notification", "error", err)
					continue
				}
				lock.Lock()
				diff.Segment = sm.Segment
				lock.Unlock()
				status(nil, nil)
			case "state":
				var sm StateMessage
				err := json.Unmarshal([]byte(n.Payload), &sm)
				if err != nil {
					slog.Error("Invalid state notification", "error", err)
					continue
				}
				if sm.Key == "hide" {
					lock.Lock()
					hide := false
					if sm.Value == "true" {
						hide = true
					}
					diff.Hide = hide
					lock.Unlock()
					status(nil, nil)
				}
			case "clear":
				notifyAll(&map[string]any{"action": "clear", "source": ConfigString(&diff.Config)})
			case "stopped":
				cancel()
				_, err := conn.Exec(context.Background(), "unlisten __pg_difficult")
				if err != nil {
					slog.Error("Failed to unlisten", "error", err)
				}
				conn.Close(context.Background())
				slog.Info("Diff listener disconnected after stop", "diff", did)
				break
			default:
				slog.Info("Got a diff listener notification", "message", n.Payload)
			}
		}
	})()

	action := "started"
	if !start {
		action = "resumed"
	}
	res.Respond(id, map[string]any{"action": action})

	// status everyone
	status(nil, nil)

	notifyAll(&map[string]any{"action": "check", "client": did, "source": ConfigString(&diff.Config), "init": true})
}

func processStopMessage(config *DBConfig, res *Responders, id *int64) {
	// look up diff
	did := -1
	lock.RLock()
	for k, v := range diffs {
		cfg := v.Config
		if cfg.Host == config.Host && cfg.Port == config.Port && cfg.Database == config.Database {
			did = k
			break
		}
	}
	if did == -1 {
		res.Error(id, errors.New("Cannot stop what is not started"))
		lock.RUnlock()
		return
	}
	diff := diffs[did]
	lock.RUnlock()

	// stop the diff
	conn, err := connectTo(&diff.Config, "pgdiff stop")
	if err != nil {
		res.Error(id, err)
		return
	}
	defer conn.Close(context.Background())

	err = StopDiff(conn)
	if err != nil {
		res.Error(id, err)
	}
	lock.Lock()
	delete(diffs, did)
	if diff.StopListen != nil {
		(*diff.StopListen)()
	}
	lock.Unlock()

	res.Respond(id, map[string]any{"action": "stopped"})

	// status everyone
	status(nil, nil)
}

func processCheckMessage(config *DBConfig, since int64, res *Responders, id *int64) {
	conn, err := connectTo(config, "pgdiff check")
	if err != nil {
		res.Error(id, err)
		return
	}
	defer conn.Close(context.Background())

	entries, err := GetEntriesSince(conn, since)
	if err != nil {
		res.Error(id, err)
	} else {
		source := ConfigString(config)
		for _, c := range entries {
			c.Source = source
		}
		res.Respond(id, map[string]any{"action": "entries", "entries": entries})
	}
}

func processSegmentMessage(config *DBConfig, segment string, res *Responders, id *int64) {
	did := -1
	lock.RLock()
	if config != nil {
		for k, v := range diffs {
			cfg := v.Config
			if cfg.Host == config.Host && cfg.Database == config.Database && cfg.Port == config.Port {
				did = k
				break
			}
		}
	}
	update := []*DiffClient{}
	if did == -1 {
		for _, v := range diffs {
			if v.Opts == nil || v.Opts.GlobalSegment == nil || *v.Opts.GlobalSegment {
				update = append(update, v)
			}
		}
		lock.RUnlock()
		lock.Lock()
		globalSegment = segment
		lock.Unlock()
	} else {
		diff := diffs[did]
		if diff.Opts == nil || diff.Opts.GlobalSegment == nil || *diff.Opts.GlobalSegment {
			for _, v := range diffs {
				if v.Opts == nil || v.Opts.GlobalSegment == nil || *v.Opts.GlobalSegment {
					update = append(update, v)
				}
			}
			lock.RUnlock()
			lock.Lock()
			globalSegment = segment
			lock.Unlock()
		} else {
			update = append(update, diff)
			lock.RUnlock()
		}
	}

	ok := true
	for i, d := range update {
		conn, err := connectTo(&d.Config, "pgdiff segment")
		if err != nil {
			slog.Error("Failed to connect to diff for segment change", "error", err)
			continue
		}
		err = NextSegment(conn, segment)
		if err != nil {
			slog.Error("Failed to update diff segment", "error", err)
			if i == 0 && id != nil {
				res.Error(id, err)
			}
			ok = false
		}
		conn.Close(context.Background())
	}

	if ok && id != nil {
		res.Respond(id, map[string]any{"action": "segment-change"})
	}
}

func processHideMessage(config *DBConfig, hide bool, res *Responders, id *int64) {
	update := make([]*DiffClient, 0, 10)
	lock.RLock()
	if config != nil {
		cfgstr := ConfigString(config)
		for _, v := range diffs {
			if ConfigString(&v.Config) == cfgstr {
				update = append(update, v)
				if v.Opts == nil || v.Opts.GlobalSegment == nil || *v.Opts.GlobalSegment {
					for _, vv := range diffs {
						if v != vv && (vv.Opts == nil || vv.Opts.GlobalSegment == nil || *vv.Opts.GlobalSegment) {
							update = append(update, vv)
						}
					}
				}
			}
		}
	} else {
		for _, v := range diffs {
			update = append(update, v)
		}
	}
	lock.RUnlock()
	if len(update) < 1 {
		res.Error(id, errors.New("Cannot change hide, diff not found"))
		return
	}

	ok := true
	hidestr := "true"
	if !hide {
		hidestr = "false"
	}
	for i, d := range update {
		conn, err := connectTo(&d.Config, "pgdiff hide")
		if err != nil {
			slog.Error("Failed to connect to diff for hide change", "error", err)
			continue
		}
		err = SetState(conn, "hide", hidestr)
		if err != nil {
			slog.Error("Failed to update diff hide", "error", err)
			if i == 0 && id != nil {
				res.Error(id, err)
			}
			ok = false
		}
		conn.Close(context.Background())
	}

	if ok && id != nil {
		res.Respond(id, map[string]any{"action": "hide-change"})
	}
}

func processClearMessage(config *DBConfig) {
	var configs []DBConfig

	if config != nil {
		configs = []DBConfig{*config}
	} else {
		configs = make([]DBConfig, 0, 10)
		lock.RLock()
		for _, diff := range diffs {
			if diff.Opts == nil || diff.Opts.GlobalSegment == nil || *diff.Opts.GlobalSegment {
				configs = append(configs, diff.Config)
			}
		}
		lock.RUnlock()
	}

	for _, cfg := range configs {
		conn, err := connectTo(&cfg, "pgdiff clear")
		if err == nil {
			err := ClearEntries(conn)
			if err != nil {
				slog.Error("Failed to clear entries for "+ConfigString(&cfg), "error", err)
			}
			conn.Close(context.Background())
		} else {
			slog.Error("Failed to clear entries for "+ConfigString(&cfg), "error", err)
		}
	}
}

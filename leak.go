package main

import (
	"context"
	"errors"
	"slices"
	"strconv"
	"time"

	"log/slog"

	"github.com/jackc/pgx/v5"
)

type ConnectedClient = map[string]any

func listConnections(conn *pgx.Conn, id int) ([]ConnectedClient, error) {
	const sql = "select pid, usename as user, application_name as application, datname as database, backend_start as started, state, state_change as updated, client_addr || ':' || client_port as client, query, query_start as queried, $1::integer as leakid from pg_stat_activity order by backend_start desc"
	res, err := query(conn, sql, id)
	if err != nil {
		return nil, err
	}
	return res.Rows, nil
}

var leakTicker *time.Ticker
var leakInterval = 10 * time.Second
var leakChecking = false

func leak(config *DBConfig, interval *time.Duration) error {
	var newdb *LeakClient
	lock.RLock()
	for _, leak := range leaks {
		cfg := leak.Config
		if cfg.Host == config.Host && cfg.Port == config.Port {
			if slices.Index(leak.Databases, config.Database) == -1 {
				newdb = leak
				lock.RUnlock()
				break
			} else {
				lock.RUnlock()
				return errors.New("Already connected to " + config.Database + " on " + config.Host + ":" + strconv.Itoa(config.Port))
			}
		}
	}
	if newdb == nil {
		lock.RUnlock()
	}

	if newdb != nil {
		lock.Lock()
		current, err := listConnections(newdb.PollConn, newdb.Id)
		if err != nil {
			newdb.Initial[config.Database] = current
		} else {
			newdb.Initial[config.Database] = []ConnectedClient{}
		}
		newdb.Databases = append(newdb.Databases, config.Database)
		lock.Unlock()
		return nil
	}

	client, err := connectTo(config, "pgdiff leak monitor")
	if err != nil {
		return err
	}

	current, err := listConnections(client, idseq)
	if err != nil {
		_ = client.Close(context.Background())
		return err
	}

	lock.Lock()
	id := idseq
	idseq += 1
	leaks[id] = &LeakClient{Id: id, Config: *config, PollConn: client, Initial: map[string][]ConnectedClient{config.Database: current}, Current: current, Databases: []string{config.Database}}
	lock.Unlock()

	if leakTicker == nil {
		slog.Info("Starting leak poller with interval", "time", leakInterval)
		leakTicker = time.NewTicker(leakInterval)
		go func() {
			for {
				select {
				case <-leakTicker.C:
					if leakChecking {
						continue
					}
					pollLeaks()

				case <-runningContext.Done():
					if leakTicker != nil {
						leakTicker.Stop()
					}
					break
				}
			}
		}()
	} else if interval != nil && leakInterval != *interval {
		leakInterval = *interval
		slog.Info("Resetting leak poller interval to", "time", leakInterval)
		leakTicker.Reset(leakInterval)
	}

	return nil
}

func unleak(id int, db string) error {
	var leak *LeakClient

	lock.RLock()
	leak = leaks[id]
	lock.RUnlock()

	if leak == nil {
		return errors.New("Invalid leak monitor " + strconv.Itoa(id))
	}

	lock.Lock()
	count := 0
	for _, v := range leak.Databases {
		if v != db {
			leak.Databases[count] = v
			count++
		}
	}
	leak.Databases = leak.Databases[:count]
	delete(leak.Initial, db)
	lock.Unlock()

	if len(leak.Databases) > 0 {
		return nil
	}

	leak.PollConn.Close(context.Background())
	slog.Info("Leak poll connection disconnected after stop", "leak", id)
	lock.Lock()
	delete(leaks, id)
	lock.Unlock()

	if len(leaks) == 0 && leakTicker != nil {
		slog.Info("Stopping leak poller")
		leakTicker.Stop()
		leakTicker = nil
	}

	return nil
}

func reconnectLeak(leak *LeakClient, conn *pgx.Conn) {
	if conn != nil {
		ctx, err := context.WithTimeout(context.Background(), 20*time.Second)
		conn.Close(ctx)
		if err != nil {
			slog.Warn("Failed to close interrupted leak monitor connection", "error", err)
		}
		conn = nil
	}
	throttledStatusAll()
	cfg := leak.Config
	for conn == nil {
		conn, err := connectTo(&cfg, "pgdiff leak monitor")
		if err == nil {
			lock.Lock()
			leak.PollConn = conn
			slog.Info("Leak poller connection re-established", "leak", leak.Id)
			lock.Unlock()
			throttledStatusAll()
			break
		} else {
			time.Sleep(10 * time.Second)
		}
	}
}

func pollLeaks() {
	if leakChecking {
		return
	}
	leakChecking = true
	defer func() {
		leakChecking = false
	}()

	results := map[int][]ConnectedClient{}
	type Result = struct {
		result []ConnectedClient
		id     int
		err    error
	}
	ch := make(chan Result)
	rem := len(leaks)

	lock.RLock()
	for id, leak := range leaks {
		go func(ch chan<- Result, id int, conn *pgx.Conn) {
			if conn != nil {
				if !connectionOk(conn) {
					lock.Lock()
					leak.PollConn = nil
					lock.Unlock()
					go reconnectLeak(leak, conn)
					slog.Info("Leak connection interrupted", "leak", leak.Id)
					ch <- Result{result: nil, id: id, err: errors.New("Not connected")}
				} else {
					res, err := listConnections(conn, id)
					if err != nil {
						ch <- Result{result: nil, id: id, err: err}
					} else {
						ch <- Result{result: res, id: id, err: nil}
					}
				}
			} else {
				ch <- Result{result: nil, id: id, err: errors.New("Not connected")}
			}
		}(ch, id, leak.PollConn)
	}
	lock.RUnlock()

	for rem > 0 {
		rem -= 1
		res := <-ch
		if res.result != nil {
			results[res.id] = res.result
		}
	}

	lock.Lock()
	for id, res := range results {
		leaks[id].Current = res
	}
	lock.Unlock()

	go notifyAll(&map[string]any{"action": "leaks", "map": results})
}

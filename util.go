package main

import (
	"fmt"
	"io"
	"reflect"
	"runtime"
	"strconv"
	"strings"
	"time"

	"encoding/json"
	"net/http"
	"os/exec"
)

func stringify(val any) string {
	str, err := json.Marshal(val)
	if err != nil {
		return "null"
	}
	return string(str)
}

func ConfigString(config *DBConfig) string {
	user := config.Username
	if user == "" {
		user = "postgres"
	}
	host := config.Host
	if host == "" {
		host = "localhost"
	}
	port := config.Port
	if port == 0 {
		port = 5432
	}
	db := config.Database
	if db == "" {
		db = "postgres"
	}
	return user + "@" + host + ":" + strconv.Itoa(port) + "/" + db
}

func ToMap(in any, tag string) (map[string]any, error) {
	if tag == "" {
		tag = "json"
	}
	out := make(map[string]interface{})

	v := reflect.ValueOf(in)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	// we only accept structs
	if v.Kind() != reflect.Struct {
		return nil, fmt.Errorf("ToMap only accepts structs; got %T", v)
	}

	typ := v.Type()
	for i := 0; i < v.NumField(); i++ {
		// gets us a StructField
		fi := typ.Field(i)
		if tagv := fi.Tag.Get(tag); tagv != "" {
			// set key of map to value in struct field
			vv := v.Field(i).Interface()
			vvr := reflect.ValueOf(vv)
			if vvr.Kind() == reflect.Ptr {
				vvr = vvr.Elem()
			}
			if vvr.Kind() == reflect.Struct {
				if vvm, err := ToMap(vv, tag); err != nil {
					return nil, err
				} else {
					out[tagv] = vvm
				}
			} else {
				out[tagv] = vv
			}
		}
	}
	return out, nil
}

type FetchRequest struct {
	Url     string            `json:"url"`
	Headers map[string]string `json:"headers"`
	Method  string            `json:"method"`
	Body    *string           `json:"body"`
}

func fetch(req *FetchRequest) (map[string]any, error) {
	var bodyin io.Reader
	if req.Body != nil {
		bodyin = strings.NewReader(*req.Body)
	} else {
		bodyin = http.NoBody
	}
	r, err := http.NewRequest(req.Method, req.Url, bodyin)
	if err != nil {
		return nil, err
	}

	if req.Headers != nil {
		for k, v := range req.Headers {
			r.Header.Set(k, v)
		}
	}

	client := &http.Client{}
	res, err := client.Do(r)

	if err != nil {
		return nil, err
	}

	ret := map[string]any{}
	ret["status"] = res.StatusCode
	ret["statusText"] = res.Status[len(strconv.Itoa(res.StatusCode))+1:]
	headers := map[string]any{}
	ret["headers"] = headers
	for k, v := range res.Header {
		headers[strings.ToLower(k)] = v[0]
	}
	if b, err := io.ReadAll(res.Body); err == nil {
		ret["result"] = string(b)
	}

	return ret, nil
}

// see https://gist.github.com/sevkin/9798d67b2cb9d07cb05f89f14ba682f8
// openURL opens the specified URL in the default browser of the user.
func openURL(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd.exe"
		args = []string{"/c", "rundll32", "url.dll,FileProtocolHandler", strings.ReplaceAll(url, "&", "^&")}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default:
		if isWSL() {
			cmd = "cmd.exe"
			args = []string{"start", url}
		} else {
			cmd = "xdg-open"
			args = []string{url}
		}
	}

	e := exec.Command(cmd, args...)
	err := e.Start()
	if err != nil {
		return err
	}
	err = e.Wait()
	if err != nil {
		return err
	}

	return nil
}

// isWSL checks if the Go program is running inside Windows Subsystem for Linux
func isWSL() bool {
	releaseData, err := exec.Command("uname", "-r").Output()
	if err != nil {
		return false
	}
	return strings.Contains(strings.ToLower(string(releaseData)), "microsoft")
}

func Throttle(tm time.Duration, fn func()) func() {
	var timer *time.Timer
	return func() {
		if timer != nil {
			return
		}
		timer = time.NewTimer(tm)
		go (func() {
			<-timer.C
			timer = nil
			fn()
		})()
	}
}
func Throttle1(tm time.Duration, fn func(data any)) func(data any) {
	var timer *time.Timer
	var dt any
	return func(data any) {
		dt = data
		if timer != nil {
			return
		}
		timer = time.NewTimer(tm)
		go (func() {
			<-timer.C
			timer = nil
			fn(dt)
		})()
	}
}

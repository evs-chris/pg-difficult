package main

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"encoding/json"
	"log/slog"

	"github.com/jackc/pgx/v5"

	xmap "github.com/danielhookx/xcontainer/map"
)

type Schema struct {
	Tables    []*Table    `json:"tables"`
	Views     []*View     `json:"views"`
	Functions []*Function `json:"functions"`
}
type Table struct {
	Id          uint32    `json:"id" db:"id"`
	Schema      string    `json:"schema" db:"schema"`
	Name        string    `json:"name" db:"name"`
	Columns     []*Column `json:"columns" db:"-"`
	Description *string   `json:"description" db:"description"`
}
type View struct {
	Id           uint32    `json:"id" db:"id"`
	Schema       string    `json:"schema" db:"schema"`
	Name         string    `json:"name" db:"name"`
	Columns      []*Column `json:"columns" db:"-"`
	Description  *string   `json:"description" db:"description"`
	Definition   string    `json:"definition" db:"definition"`
	Materialized bool      `json:"materialized" db:"materialized"`
}
type Column struct {
	Schema      string    `json:"schema" db:"schema"`
	Table       string    `json:"table" db:"table"`
	Name        string    `json:"name" db:"name"`
	Position    int       `json:"position" db:"position"`
	Nullable    bool      `json:"nullable" db:"nullable"`
	Pkey        bool      `json:"pkey" db:"pkey"`
	PgType      string    `json:"pgtype" db:"pgtype"`
	Enum        *[]string `json:"enum" db:"-"`
	Type        *string   `json:"type" db:"-"`
	Default     *string   `json:"default" db:"default"`
	Length      *int      `json:"length" db:"length"`
	Precision   []int     `json:"precision" db:"precision"`
	Description *string   `json:"description" db:"description"`
}
type Function struct {
	Id          uint32  `json:"id" db:"id"`
	Schema      string  `json:"schema" db:"schema"`
	Name        string  `json:"name" db:"name"`
	Arguments   string  `json:"arguments" db:"arguments"`
	Description *string `json:"description" db:"description"`
	Language    string  `json:"language" db:"language"`
	Owner       string  `json:"owner" db:"owner"`
	Security    string  `json:"security" db:"security"`
	Source      string  `json:"source" db:"source"`
	Result      string  `json:"result" db:"result"`
	Type        string  `json:"type" db:"type"`
}

const tableQuery = `SELECT n.nspname "schema", c.relname "name", d.description "description", c.oid "id" FROM pg_catalog.pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace left join pg_catalog.pg_description d on d.objoid = c.oid and d.objsubid = 0 WHERE c.relkind in ('r') and n.nspname not in ('pg_catalog', 'information_schema') order by c.relname asc`
const tableColumnQuery = `select ts.table_schema as schema, ts.table_name as table, cs.column_name as name, cs.ordinal_position as position, cs.is_nullable = 'YES' as nullable, (select keys.constraint_name from information_schema.key_column_usage keys join information_schema.table_constraints tc on keys.constraint_name = tc.constraint_name and keys.constraint_schema = tc.constraint_schema and tc.table_name = keys.table_name where keys.table_schema = cs.table_schema and keys.table_name = cs.table_name and keys.column_name = cs.column_name and tc.constraint_type = 'PRIMARY KEY') is not null as pkey, cs.udt_name as pgtype, cs.column_default as default, cs.character_maximum_length as length, case when cs.udt_name = 'numeric' and cs.numeric_precision > 0 and cs.numeric_scale > 0 then array[cs.numeric_precision::integer, cs.numeric_scale::integer] else null end as precision, d.description "description" from information_schema.columns cs join information_schema.tables ts on ts.table_name = cs.table_name and ts.table_schema = cs.table_schema left join pg_description d on d.objoid = (ts.table_schema || '.' || ts.table_name)::regclass::oid and d.objsubid = cs.ordinal_position where ts.table_schema not in ('pg_catalog', 'information_schema') order by cs.column_name asc;`

func enumQuery(typ string) string {
	return fmt.Sprintf(`select pg_catalog.enum_range(null::%v)::varchar[] as values;`, typ)
}

const functionQuery = `SELECT n.nspname as "schema", p.proname as "name", pg_catalog.pg_get_function_result(p.oid) as "result", pg_catalog.pg_get_function_arguments(p.oid) as "arguments",
 CASE p.prokind WHEN 'a' THEN 'aggregate' WHEN 'w' THEN 'window' WHEN 'p' THEN 'procedure' ELSE 'function' END as "type",
 -- CASE WHEN p.provolatile = 'i' THEN 'immutable' WHEN p.provolatile = 's' THEN 'stable' WHEN p.provolatile = 'v' THEN 'volatile' END as "volatility",
 -- CASE WHEN p.proparallel = 'r' THEN 'restricted' WHEN p.proparallel = 's' THEN 'safe' WHEN p.proparallel = 'u' THEN 'unsafe' END as "parallel",
 pg_catalog.pg_get_userbyid(p.proowner) as "owner",
 CASE WHEN prosecdef THEN 'definer' ELSE 'invoker' END AS "security",
 -- pg_catalog.array_to_string(p.proacl, E'\n') AS "access",
 l.lanname as "language", p.prosrc as "source", pg_catalog.obj_description(p.oid, 'pg_proc') as "description", p.oid "id"
FROM pg_catalog.pg_proc p LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace LEFT JOIN pg_catalog.pg_language l ON l.oid = p.prolang where n.nspname not in ('pg_catalog', 'information_schema') order by p.proname asc, p.prosrc asc`
const oldFunctionQuery = `SELECT n.nspname as "schema", p.proname as "name", pg_catalog.pg_get_function_result(p.oid) as "result", pg_catalog.pg_get_function_arguments(p.oid) as "arguments",
 CASE p.proisagg WHEN true THEN 'aggregate' ELSE 'function' END as "type",
 -- CASE WHEN p.provolatile = 'i' THEN 'immutable' WHEN p.provolatile = 's' THEN 'stable' WHEN p.provolatile = 'v' THEN 'volatile' END as "volatility",
 -- CASE WHEN p.proparallel = 'r' THEN 'restricted' WHEN p.proparallel = 's' THEN 'safe' WHEN p.proparallel = 'u' THEN 'unsafe' END as "parallel",
 pg_catalog.pg_get_userbyid(p.proowner) as "owner",
 CASE WHEN prosecdef THEN 'definer' ELSE 'invoker' END AS "security",
 -- pg_catalog.array_to_string(p.proacl, E'\n') AS "access",
 l.lanname as "language", p.prosrc as "source", pg_catalog.obj_description(p.oid, 'pg_proc') as "description", p.oid "id"
FROM pg_catalog.pg_proc p LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace LEFT JOIN pg_catalog.pg_language l ON l.oid = p.prolang where n.nspname not in ('pg_catalog', 'information_schema') order by p.proname asc, p.prosrc asc`
const viewQuery = `SELECT n.nspname "schema", c.relname "name", d.description "description", c.relkind = 'm' "materialized", pg_catalog.pg_get_viewdef(c.oid) "definition", c.oid "id" FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace left join pg_catalog.pg_description d on d.objoid = c.oid and d.objsubid = 0 WHERE c.relkind in ('v', 'm') and n.nspname not in ('pg_catalog', 'information_schema') order by c.relname asc`
const viewColumnQuery = `SELECT n.nspname "schema", c.relname "table", a.attname "name", t.typname "pgtype", not a.attnotnull "nullable", false pkey, case when a.atttypmod = -1 then null when t.oid in (1042, 1043) then a.atttypmod - 4 when t.oid in (1560, 1562) then a.atttypmod else null end length, case when t.oid = 1700 and a.atttypmod <> -1 then array[((a.atttypmod - 4) >> 16) & 65535, (a.atttypmod - 4) & 65535] else null end "precision", a.attnum "position" FROM pg_catalog.pg_class c INNER JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid INNER JOIN pg_catalog.pg_type t ON t.oid = a.atttypid inner join pg_catalog.pg_namespace n on n.oid = c.relnamespace WHERE c.relkind in ('v', 'm') and n.nspname not in ('pg_catalog', 'information_schema') and a.attnum > -1 order by a.attname asc;`

var tstypes = map[string]string{
	"int2":                   "number",
	"int4":                   "number",
	"int8":                   "string",
	"float4":                 "number",
	"float8":                 "string",
	"bool":                   "boolean",
	"date":                   "string",
	"timestamp":              "Date",
	"timestamptz":            "Date",
	"json":                   "any",
	"jsonb":                  "any",
	"varchar":                "string",
	"char":                   "string",
	"bpchar":                 "string",
	"text":                   "string",
	"bit":                    "boolean",
	"numeric":                "string",
	"name":                   "string",
	"time":                   "string",
	"time without time zone": "string",
	"bytea":                  "UInt8Array",
	"_int2":                  "number[]",
	"_int4":                  "number[]",
	"_int8":                  "string[]",
	"_float4":                "number[]",
	"_float8":                "string[]",
	"_bool":                  "boolean[]",
	"_date":                  "string[]",
	"_timestamp":             "Date[]",
	"_timestamptz":           "Date[]",
	"_json":                  "any[]",
	"_jsonb":                 "any[]",
	"_varchar":               "string[]",
	"_char":                  "string[]",
	"_bpchar":                "string[]",
	"_text":                  "string[]",
	"_bit":                   "boolean[]",
	"_numeric":               "string[]",
}

func schema(client *pgx.Conn) (*Schema, error) {
	res := &Schema{}
	enums := make(map[string][]string, 0)

	tables, err := queryStruct[Table](client, tableQuery)
	if err != nil {
		return nil, err
	}
	res.Tables = tables

	views, err := queryStruct[View](client, viewQuery)
	if err != nil {
		return nil, err
	}
	res.Views = views

	columns, err := queryStruct[Column](client, tableColumnQuery)
	if err != nil {
		return nil, err
	}
	colmap := make(map[string]map[string][]*Column, 10)
	for _, c := range columns {
		schema, ok := colmap[c.Schema]
		if !ok {
			colmap[c.Schema] = make(map[string][]*Column, 10)
			schema = colmap[c.Schema]
		}
		table, ok := schema[c.Table]
		if !ok {
			schema[c.Table] = make([]*Column, 0, 10)
			table = schema[c.Table]
		}
		schema[c.Table] = append(table, c)

		tt, ok := tstypes[c.PgType]
		if ok {
			c.Type = &tt
		} else {
			enums[c.PgType] = nil
		}
	}

	for _, t := range tables {
		t.Columns = colmap[t.Schema][t.Name]
	}
	for _, v := range views {
		v.Columns = colmap[v.Schema][v.Name]
	}

	fns, err := queryStruct[Function](client, functionQuery)
	if err != nil {
		fns, err = queryStruct[Function](client, oldFunctionQuery)
		if err != nil {
			return nil, err
		}
	}
	res.Functions = fns

	return res, nil
}

type FieldDescription struct {
	Table  uint32 `json:"table"`
	Column uint16 `json:"column"`
}
type OrderedResult = *xmap.OrderedMap[string, any]
type QueryOrderedResult struct {
	Rows     []OrderedResult    `json:"rows"`
	Affected int64              `json:"affected"`
	Fields   map[string]FieldDescription `json:"fields"`
}

func queryOrdered(client *pgx.Conn, sql string, params ...any) (*QueryOrderedResult, error) {
	rows, err := client.Query(context.Background(), sql, params...)
	defer rows.Close()
	if err != nil {
		return nil, err
	}
	descs := rows.FieldDescriptions()
	col_len := len(descs)
	cols := make([]string, col_len)
	fields := make(map[string]FieldDescription, col_len)
	for i, col := range descs {
		cols[i] = col.Name
		if col.TableOID != 0 {
			fields[col.Name] = FieldDescription{Table: col.TableOID, Column: col.TableAttributeNumber}
		}
	}
	things, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*xmap.OrderedMap[string, any], error) {
		vals, err := row.Values()
		if err != nil {
			return nil, err
		}
		res := xmap.NewOrderedMap[string, any]()
		for i, v := range vals {
			res.Set(cols[i], v)
		}
		return res, nil
	})
	if err != nil {
		return nil, err
	}
	return &QueryOrderedResult{Rows: things, Affected: rows.CommandTag().RowsAffected(), Fields: fields}, nil
}

type QueryResult struct {
	Rows     []map[string]any
	Affected int64
}

func query(client *pgx.Conn, sql string, params ...any) (*QueryResult, error) {
	rows, _ := client.Query(context.Background(), sql, params...)
	defer rows.Close()
	things, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (map[string]any, error) {
		return pgx.RowToMap(row)
	})
	if err != nil {
		return nil, err
	}
	return &QueryResult{Rows: things, Affected: rows.CommandTag().RowsAffected()}, nil
}

func queryStruct[T any](client *pgx.Conn, sql string, params ...any) ([]*T, error) {
	rows, _ := client.Query(context.Background(), sql, params...)
	defer rows.Close()
	res, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*T, error) {
		return pgx.RowToAddrOfStructByName[T](row)
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func queryOne(client *pgx.Conn, sql string, params ...any) (map[string]any, error) {
	res, err := query(client, sql, params...)
	if err != nil {
		return nil, err
	}
	if len(res.Rows) < 1 {
		return nil, errors.New("No results returned")
	} else if len(res.Rows) > 1 {
		return nil, errors.New("Too many results returned")
	}

	return res.Rows[0], nil
}

type StartOptions = struct {
	MaxLen        *int     `json:"maxlen"`
	Changes       *string  `json:"changes"`
	Ignore        []string `json:"ignore"`
	GlobalSegment *bool    `json:"globalsegment"`
	Segment       *string  `json:"segment"`
}

const start_setup_sql = `
	create schema if not exists pgdifficult;
	grant all on schema pgdifficult to public;
	create table if not exists pgdifficult.entries (id bigserial primary key, "schema" varchar not null, "table" varchar not null, segment varchar not null, old json, new json, hide boolean, stamp timestamptz not null);
	grant all on table pgdifficult.entries to public;
	grant all on sequence pgdifficult.entries_id_seq to public;
	create table if not exists pgdifficult.state (key varchar primary key, value varchar);
	grant all on table pgdifficult.state to public;
	delete from pgdifficult.state;
	insert into pgdifficult.state (key, value) values ('segment', 'initial');
	insert into pgdifficult.state (key, value) values ('hide', 'false');
	create or replace function pgdifficult.record() returns trigger as $trigger$
  declare
    segment varchar;
    hide boolean;
    rec record;
    obj_old json;
    obj_new json;
    pkeys varchar[];
  begin
    set timezone = 'UTC';
    select value into hide from pgdifficult.state where key = 'hide';
    select value into segment from pgdifficult.state where key = 'segment';
`
const mid_setup_sql = `
	case TG_OP
		when 'UPDATE' then
			select array_agg(a.attname::varchar) into pkeys from pg_index i join pg_attribute a on i.indrelid = a.attrelid and a.attnum = any(i.indkey) where i.indrelid = TG_RELID and i.indisprimary;

			case when pkeys is null then
				insert into pgdifficult.entries ("table", "schema", "segment", "hide", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, hide = 'true', obj_old, obj_new, CURRENT_TIMESTAMP(3));
			else
`

func setup_sql(builder *strings.Builder, maxlen int, changes string) {
	builder.WriteString("begin;")
	builder.WriteString(start_setup_sql)
	builder.WriteString("\n")
	if maxlen > 0 {
		builder.WriteString(fmt.Sprintf(`if TG_OP = 'INSERT' then select null::json into obj_old; else with obj as (select a.key, case when length(a.value::varchar) > %v then ('"<a really big value md5:' || md5(a.value::varchar) || '>"')::json else a.value end as value from json_each(obj_old) a)
    select json_object_agg(key, value) into obj_old from obj; end if;
    if TG_OP = 'DELETE' then select null::json into obj_new; else with obj as (select a.key, case when length(a.value::varchar) > %v then ('"<a really big value md5:' || md5(a.value::varchar) || '>"')::json else a.value end as value from json_each(obj_new) a)
    select json_object_agg(key, value) into obj_new from obj; end if;`, maxlen, maxlen))
		builder.WriteString("\n")
	} else {
		builder.WriteString(`if TG_OP = 'INSERT' then select null::json into obj_old; else select row_to_json(OLD) into obj_old; end if;
    if TG_OP = 'DELETE' then select null::json into obj_new; else select row_to_json(NEW) into obj_new; end if;`)
		builder.WriteString("\n")
	}
	builder.WriteString(mid_setup_sql)
	if changes == "diff" {
		builder.WriteString(`-- specified change recording method for old
		with obj1 as (select * from json_each(obj_old)), obj2 as (select * from json_each(obj_new)), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
			select json_object_agg(key, value) into obj_old from diff;`)
		builder.WriteString("\n")
	} else {
		builder.WriteString(`-- specified change recording method for old - whole`)
		builder.WriteString("\n")
	}
	if changes == "diff" || changes == "whole-old" {
		builder.WriteString(`-- specified change recording method for new
		with obj1 as (select * from json_each(obj_new)), obj2 as (select * from json_each(obj_old)), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
		select json_object_agg(key, value) into obj_new from diff;`)
		builder.WriteString("\n")
	} else {
		builder.WriteString(`-- specified change recording method for new - whole`)
		builder.WriteString("\n")
	}
	builder.WriteString(end_setup_sql)
	builder.WriteString("commit;")
}

const end_setup_sql = `
          insert into pgdifficult.entries ("table", "schema", "segment", "hide", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, hide = 'true', obj_old, obj_new, CURRENT_TIMESTAMP(3));
        end case;
        rec := NEW;
      when 'INSERT' then
        insert into pgdifficult.entries ("table", "schema", "segment", "hide", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, hide = 'true', null, obj_new, CURRENT_TIMESTAMP(3));
        rec := NEW;
      when 'DELETE' then
        insert into pgdifficult.entries ("table", "schema", "segment", "hide", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, hide = 'true', obj_old, null, CURRENT_TIMESTAMP(3));
        rec := OLD;
      else
        raise exception 'Unknown trigger op: "%"', TG_OP;
    end case;
    notify __pg_difficult, 'record';
    return rec;
  end;
  $trigger$ language plpgsql;
  grant all on function pgdifficult.record() to public;
`

var re_chars = regexp.MustCompile(`[\[\]\(\)\.\{\}\\\/\\\+\*\$\^%\?]`)

func re_chars_replace(match string) string {
	if match == "%" {
		return ".*"
	} else if match == "?" {
		return "."
	} else {
		return "\\" + match
	}
}

var single_quote_re = regexp.MustCompile(`'`)

func StartDiff(client *pgx.Conn, opts *StartOptions) error {
	maxlen := 0
	changes := "diff"
	ignore := make([]string, 0, 500)
	ignore = append(ignore, "__pgdifficult_%", "pgdifficult.%")

	if opts != nil {
		if opts.MaxLen != nil {
			maxlen = *opts.MaxLen
		}
		if opts.Changes != nil {
			changes = *opts.Changes
		}
		if opts.Ignore != nil {
			for _, v := range opts.Ignore {
				ignore = append(ignore, v)
			}
		}
	}

	schema, err := schema(client)
	if err != nil {
		return err
	}

	tables := make([]*Table, 0, len(schema.Tables))
	skips := make([]*regexp.Regexp, 0, len(ignore))
	for _, i := range ignore {
		if re, err := regexp.Compile(re_chars.ReplaceAllStringFunc(i, re_chars_replace)); err != nil {
			skips = append(skips, re)
		}
	}
outer:
	for _, t := range schema.Tables {
		for _, re := range skips {
			if re.MatchString(t.Name) || re.MatchString(t.Schema+"."+t.Name) {
				continue outer
			}
		}
		tables = append(tables, t)
	}

	if len(tables) < 1 {
		return errors.New("No tables to watch")
	}

	builder := strings.Builder{}
	setup_sql(&builder, maxlen, changes)

	for _, t := range tables {
		if t.Schema == "pgdifficult" {
			continue
		}
		schema := re_chars.ReplaceAllStringFunc(t.Schema, re_chars_replace)
		name := re_chars.ReplaceAllStringFunc(t.Name, re_chars_replace)
		builder.WriteString(fmt.Sprintf(`drop trigger if exists __pgdifficult_notify on "%v"."%v";`, schema, name))
		builder.WriteString("\n")
		builder.WriteString(fmt.Sprintf(`create constraint trigger __pgdifficult_notify after insert or update or delete on "%v"."%v" deferrable initially deferred for each row execute procedure pgdifficult.record();`, schema, name))
		builder.WriteString("\n")
	}

	if _, err := client.Exec(context.Background(), builder.String()); err != nil {
		return err
	}

	seg := "Initial"
	if opts.GlobalSegment == nil || *opts.GlobalSegment {
		seg = globalSegment
	} else if opts.Segment != nil {
		seg = *opts.Segment
	}
	_, err = client.Exec(context.Background(), "update pgdifficult.state set value = $1 where key = 'segment'", seg)
	if err != nil {
		slog.Warn("Failed to set segment in new diff", seg)
		return err
	}

	return nil
}

type Change struct {
	Id      int64          `json:"id" db:"id"`
	Table   string         `json:"table" db:"table"`
	Schema  string         `json:"schema" db:"schema"`
	Segment string         `json:"segment" db:"segment"`
	Hide    bool           `json:"hide" db:"hide"`
	Old     map[string]any `json:"old" db:"old"`
	New     map[string]any `json:"new" db:"new"`
	Stamp   time.Time      `json:"stamp" db:"stamp"`
	Source  string         `json:"source" db:"-"`
}

func GetEntries(client *pgx.Conn) ([]*Change, error) {
	return queryStruct[Change](client, `select * from pgdifficult.entries order by id asc`)
}

func GetEntriesSince(client *pgx.Conn, since int64) ([]*Change, error) {
	return queryStruct[Change](client, `select * from pgdifficult.entries where id > $1 order by id asc`, since)
}

func ClearEntries(client *pgx.Conn) error {
	_, err := client.Exec(context.Background(), `delete from pgdifficult.entries;
    notify __pg_difficult, 'clear'`)
	return err
}

func GetState(client *pgx.Conn, key string) (string, error) {
	res, err := query(client, `select value from pgdifficult.state where key = $1`, key)
	if err != nil {
		return "", err
	}
	row := res.Rows[0]
	if row == nil {
		return "", errors.New("State variable " + key + " not found")
	}
	return row["value"].(string), nil
}

func SetState(client *pgx.Conn, key string, value string) error {
	res, err := client.Exec(context.Background(), `update pgdifficult.state set value = $1 where key = $2`, value, key)
	if err != nil {
		return err
	}
	if res.RowsAffected() < 1 {
		res, err := client.Exec(context.Background(), `insert into pgdifficult.state (key, value) values ($1, $2)`, key, value)
		if err != nil {
			return err
		}
		if res.RowsAffected() < 1 {
			return errors.New("Failed to set state variable " + key + " to " + value)
		}
	}
	return nil
}

func NextSegment(client *pgx.Conn, segment string) error {
	err := SetState(client, "segment", segment)
	if err != nil {
		return err
	}
	json, err := json.Marshal(map[string]any{"action": "segment", "segment": segment})
	if err != nil {
		return err
	}
	_, err = client.Exec(context.Background(), `notify __pg_difficult, '`+single_quote_re.ReplaceAllString(string(json), `\'`)+`'`)
	if err != nil {
		return err
	}
	return nil
}

func StopDiff(client *pgx.Conn) error {
	schema, err := schema(client)
	if err != nil {
		return err
	}

	builder := strings.Builder{}
	for _, t := range schema.Tables {
		schema := re_chars.ReplaceAllStringFunc(t.Schema, re_chars_replace)
		name := re_chars.ReplaceAllStringFunc(t.Name, re_chars_replace)
		builder.WriteString(fmt.Sprintf(`drop trigger if exists __pgdifficult_notify on "%v"."%v";`, schema, name))
		builder.WriteString("\n")
	}
	builder.WriteString(`
    drop table if exists __pgdifficult_entries;
    drop table if exists __pgdifficult_state;
    drop table if exists pgdifficult.entries;
    drop table if exists pgdifficult.state;
    drop function if exists __pgdifficult_record();
    drop function if exists pgdifficult.record();
    drop schema if exists pgdifficult;
    notify __pg_difficult, 'stopped';
	`)

	_, err = client.Exec(context.Background(), builder.String())
	if err != nil {
		return err
	}

	return nil
}

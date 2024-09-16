import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js';
import { evaluate } from 'https://cdn.jsdelivr.net/npm/raport@0.24.8/lib/index.js';

type Client = postgres.Sql<Record<string, unknown>>;

export const tableQuery = `SELECT n.nspname "schema", c.relname "name", d.description "description" FROM pg_catalog.pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace left join pg_catalog.pg_description d on d.objoid = c.oid and d.objsubid = 0 WHERE c.relkind in ('r') and n.nspname not in ('pg_catalog', 'information_schema') order by c.relname asc`;
export const tableColumnQuery = `select ts.table_schema as schema, ts.table_name as table, cs.column_name as name, cs.ordinal_position as position, cs.is_nullable = 'YES' as nullable, (select keys.constraint_name from information_schema.key_column_usage keys join information_schema.table_constraints tc on keys.constraint_name = tc.constraint_name and keys.constraint_schema = tc.constraint_schema and tc.table_name = keys.table_name where keys.table_schema = cs.table_schema and keys.table_name = cs.table_name and keys.column_name = cs.column_name and tc.constraint_type = 'PRIMARY KEY') is not null as pkey, cs.udt_name as pgtype, cs.column_default as default, cs.character_maximum_length as length, case when cs.udt_name = 'numeric' and cs.numeric_precision > 0 and cs.numeric_scale > 0 then array[cs.numeric_precision::integer, cs.numeric_scale::integer] else null end as precision, d.description "description" from information_schema.columns cs join information_schema.tables ts on ts.table_name = cs.table_name and ts.table_schema = cs.table_schema left join pg_description d on d.objoid = (ts.table_schema || '.' || ts.table_name)::regclass::oid and d.objsubid = cs.ordinal_position where ts.table_schema not in ('pg_catalog', 'information_schema') order by cs.column_name asc;`;
export const enumQuery = (type: string) => `select pg_catalog.enum_range(null::${type})::varchar[] as values;`;
export const functionQuery = `SELECT n.nspname as "schema", p.proname as "name", pg_catalog.pg_get_function_result(p.oid) as "result", pg_catalog.pg_get_function_arguments(p.oid) as "arguments",
 CASE p.prokind WHEN 'a' THEN 'aggregate' WHEN 'w' THEN 'window' WHEN 'p' THEN 'procedure' ELSE 'function' END as "type",
 CASE WHEN p.provolatile = 'i' THEN 'immutable' WHEN p.provolatile = 's' THEN 'stable' WHEN p.provolatile = 'v' THEN 'volatile' END as "volatility",
 CASE WHEN p.proparallel = 'r' THEN 'restricted' WHEN p.proparallel = 's' THEN 'safe' WHEN p.proparallel = 'u' THEN 'unsafe' END as "parallel",
 pg_catalog.pg_get_userbyid(p.proowner) as "owner",
 CASE WHEN prosecdef THEN 'definer' ELSE 'invoker' END AS "security",
 pg_catalog.array_to_string(p.proacl, E'\n') AS "access",
 l.lanname as "language", p.prosrc as "source", pg_catalog.obj_description(p.oid, 'pg_proc') as "description"
FROM pg_catalog.pg_proc p LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace LEFT JOIN pg_catalog.pg_language l ON l.oid = p.prolang where n.nspname not in ('pg_catalog', 'information_schema') order by p.proname asc, p.prosrc asc`;
export const oldFunctionQuery = `SELECT n.nspname as "schema", p.proname as "name", pg_catalog.pg_get_function_result(p.oid) as "result", pg_catalog.pg_get_function_arguments(p.oid) as "arguments",
 CASE p.proisagg WHEN true THEN 'aggregate' ELSE 'function' END as "type",
 CASE WHEN p.provolatile = 'i' THEN 'immutable' WHEN p.provolatile = 's' THEN 'stable' WHEN p.provolatile = 'v' THEN 'volatile' END as "volatility",
 CASE WHEN p.proparallel = 'r' THEN 'restricted' WHEN p.proparallel = 's' THEN 'safe' WHEN p.proparallel = 'u' THEN 'unsafe' END as "parallel",
 pg_catalog.pg_get_userbyid(p.proowner) as "owner",
 CASE WHEN prosecdef THEN 'definer' ELSE 'invoker' END AS "security",
 pg_catalog.array_to_string(p.proacl, E'\n') AS "access",
 l.lanname as "language", p.prosrc as "source", pg_catalog.obj_description(p.oid, 'pg_proc') as "description"
FROM pg_catalog.pg_proc p LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace LEFT JOIN pg_catalog.pg_language l ON l.oid = p.prolang where n.nspname not in ('pg_catalog', 'information_schema') order by p.proname asc, p.prosrc asc`;
export const viewQuery = `SELECT n.nspname "schema", c.relname "name", d.description "description", c.relkind = 'm' "materialized", pg_catalog.pg_get_viewdef(c.oid) "definition" FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace left join pg_catalog.pg_description d on d.objoid = c.oid and d.objsubid = 0 WHERE c.relkind in ('v', 'm') and n.nspname not in ('pg_catalog', 'information_schema') order by c.relname asc`;
export const viewColumnQuery = `SELECT n.nspname "schema", c.relname "table", a.attname "name", t.typname "pgtype", not a.attnotnull "nullable", false pkey, case when a.atttypmod = -1 then null when t.oid in (1042, 1043) then a.atttypmod - 4 when t.oid in (1560, 1562) then a.atttypmod else null end length, case when t.oid = 1700 and a.atttypmod <> -1 then array[((a.atttypmod - 4) >> 16) & 65535, (a.atttypmod - 4) & 65535] else null end "precision", a.attnum "position" FROM pg_catalog.pg_class c INNER JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid INNER JOIN pg_catalog.pg_type t ON t.oid = a.atttypid inner join pg_catalog.pg_namespace n on n.oid = c.relnamespace WHERE c.relkind in ('v', 'm') and n.nspname not in ('pg_catalog', 'information_schema') and a.attnum > -1 order by a.attname asc;`;

export type TSType = 'Date' | 'number' | 'string' | 'any' | 'boolean' | 'Date[]' | 'number[]' | 'string[]' | 'any[]' | 'boolean[]' | 'any' | 'any[]' | 'UInt8Array';
export const Types: { [key: string]: TSType } = {
  int2: 'number',
  int4: 'number',
  int8: 'string',
  float4: 'number',
  float8: 'string',
  bool: 'boolean',
  date: 'string',
  timestamp: 'Date',
  timestamptz: 'Date',
  json: 'any',
  jsonb: 'any',
  varchar: 'string',
  char: 'string',
  bpchar: 'string',
  text: 'string',
  bit: 'boolean',
  numeric: 'string',
  name: 'string',
  time: 'string',
  'time without time zone': 'string',
  bytea: 'UInt8Array',
  _int2: 'number[]',
  _int4: 'number[]',
  _int8: 'string[]',
  _float4: 'number[]',
  _float8: 'string[]',
  _bool: 'boolean[]',
  _date: 'string[]',
  _timestamp: 'Date[]',
  _timestamptz: 'Date[]',
  _json: 'any[]',
  _jsonb: 'any[]',
  _varchar: 'string[]',
  _char: 'string[]',
  _bpchar: 'string[]',
  _text: 'string[]',
  _bit: 'boolean[]',
  _numeric: 'string[]',
}

export interface Table {
  schema: string;
  name: string;
  columns?: Column[];
  description?: string;
}

export interface View extends Table {
  definition: string;
  materialized: boolean;
}

export interface Column {
  schema: string;
  table: string;
  name: string;
  position: number,
  nullable: boolean;
  pkey: boolean;
  pgtype: string;
  enum?: string[];
  type?: string;
  default?: string;
  length?: number;
  precision?: [number, number];
  description?: string;
}

export interface Function {
  schema: string;
  name: string;
  arguments: string;
  description?: string;
  language: string;
  owner: string;
  security: string;
  source: string;
  result: string;
  type: string;
}

export interface Schema {
  tables: Table[];
  views: View[];
  functions: Function[];
}

export interface Segment {
  [name: string]: Change[];
}

export interface Change {
  table: string;
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
  stamp: string;
}

export interface StartOptions {
  maxlen?: number;
  changes?: 'whole'|'whole-old'|'diff';
  ignore?: string[];
}

export async function start(client: Client, opts?: StartOptions) {
  const maxlen = opts?.maxlen ?? 0;
  const changes = opts?.changes ?? 'diff';
  const ignore = opts?.ignore || [];
  // make sure we don't add triggers for diff tables
  ignore.push('__pgdifficult_%', 'pgdifficult.%');
  await client.begin(async client => {
    const tables: Table[] = evaluate({ tables: await client.unsafe(tableQuery), ignore }, `filter(tables =>name not-ilike ~ignore and '{schema}.{name}' not-ilike ~ignore)`);
    if (!tables.length) throw new Error(`No tables to watch`);
    await client`create schema if not exists pgdifficult`;
    await client`grant all on schema pgdifficult to public`;
    await client`create table if not exists pgdifficult.entries (id bigserial primary key, "schema" varchar not null, "table" varchar not null, segment varchar not null, old json, new json, hide boolean, stamp timestamptz not null);`;
    if (!('hide' in (await client`select e.* from (select 1) as dummy left join pgdifficult.entries e on 1 = 2`)[0])) {
      await client`alter table pgdifficult.entries add column hide boolean;`;
    }
    await client`grant all on table pgdifficult.entries to public`;
    await client`grant all on sequence pgdifficult.entries_id_seq to public`;
    await client`create table if not exists pgdifficult.state (key varchar primary key, value varchar);`;
    await client`grant all on table pgdifficult.state to public`;
    await client`insert into pgdifficult.state (key, value) values ('segment', 'initial');`;
    await client.unsafe(`create or replace function pgdifficult.record() returns trigger as $trigger$
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
    select value into segment from pgdifficult.state where key = 'segment';${maxlen <= 0 ? `
    select row_to_json(OLD) into obj_old;
    select row_to_json(NEW) into obj_new;` : `
    with obj as (select a.key, case when length(a.value::varchar) > ${maxlen} then ('"<a really big value md5:' || md5(a.value::varchar) || '>"')::json else a.value end as value from json_each(row_to_json(OLD)) a)
    select json_object_agg(key, value) into obj_old from obj;
    with obj as (select a.key, case when length(a.value::varchar) > ${maxlen} then ('"<a really big value md5:' || md5(a.value::varchar) || '>"')::json else a.value end as value from json_each(row_to_json(NEW)) a)
    select json_object_agg(key, value) into obj_new from obj;`}
    case TG_OP
      when 'UPDATE' then
        select array_agg(a.attname::varchar) into pkeys from pg_index i join pg_attribute a on i.indrelid = a.attrelid and a.attnum = any(i.indkey) where i.indrelid = TG_RELID and i.indisprimary;

        case when pkeys is null then
          insert into pgdifficult.entries ("table", "schema", "segment", "hide", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, hide = 'true', obj_old, obj_new, CURRENT_TIMESTAMP(3));
        else
          -- specified change recording method for old${changes === 'diff' ? `
          with obj1 as (select * from json_each(obj_old)), obj2 as (select * from json_each(obj_new)), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
          select json_object_agg(key, value) into obj_old from diff;` : ` - whole`}
          -- specified change recording method for new${changes === 'diff' || changes === 'whole-old' ? `
          with obj1 as (select * from json_each(obj_new)), obj2 as (select * from json_each(obj_old)), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
          select json_object_agg(key, value) into obj_new from diff;` : ' - whole'}
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
  $trigger$ language plpgsql;`);
    await client`grant all on function pgdifficult.record() to public`;
    for (const table of tables) {
      await client`drop trigger if exists __pgdifficult_notify on ${client(table.schema)}.${client(table.name)};`;
      await client`create constraint trigger __pgdifficult_notify after insert or update or delete on ${client(table.schema)}.${client(table.name)} deferrable initially deferred for each row execute procedure pgdifficult.record();`;
    }
  });
}

export async function next(client: Client, segment: string) {
  await client`update pgdifficult.state set value = ${segment} where key = 'segment';`;
  await client.unsafe(`notify __pg_difficult, '${JSON.stringify({ action: 'segment', segment }).replace(/\'/g, '\\\'')}'`);
}

export async function setState(client: Client, key: string, value: string) {
  const res = await client`update pgdifficult.state set value = ${value} where key = ${key};`;
  if (res.count < 1) await client `insert into pgdifficult.state (key, value) values (${key}, ${value});`;
  await client.unsafe(`notify __pg_difficult, '${JSON.stringify({ action: 'state', key, value }).replace(/\'/g, '\\\'')}'`);
}

export async function getState(client: Client, key: string): Promise<string|null> {
  return ((await client`select value from pgdifficult.state where key = ${key}`)[0] || {}).value ?? null;
}

export async function schema(client: Client): Promise<Schema> {
  const tables: Table[] = await client.unsafe(tableQuery);
  const columns: Column[] = await client.unsafe(tableColumnQuery);

  for (const t of tables) t.columns = [];
  for (const c of columns) {
    if (!c.description) delete c.description;
    const t = tables.find(t => t.name === c.table && t.schema === c.schema);
    if (t?.columns) t.columns.push(c);
    if (!Types[c.pgtype]) {
      try {
        console.log(`missing type definition for ${c.pgtype}... trying an enum`);
        c.enum = (await client.unsafe(enumQuery(c.pgtype)))[0].values;
      } catch { /* sure */ }
    } else {
      c.type = Types[c.pgtype];
    }
  }

  let functions: Function[]; 
  try {
    functions = await client.unsafe(functionQuery);
  } catch {
    functions = await client.unsafe(oldFunctionQuery);
  }
  for (const f of functions) {
    if (!f.description) delete f.description;
  }

  const views: View[] = await client.unsafe(viewQuery);
  const viewcols: Column[] = await client.unsafe(viewColumnQuery);
  for (const t of views) t.columns = [];
  for (const c of viewcols) {
    if (!c.description) delete c.description;
    const t = views.find(t => t.name === c.table && t.schema === c.schema);
    if (t?.columns) t.columns.push(c);
    if (!Types[c.pgtype]) {
      try {
        console.log(`missing type definition for ${c.pgtype}... trying an enum`);
        c.enum = (await client.unsafe(enumQuery(c.pgtype)))[0].values;
      } catch { /* sure */ }
    } else {
      c.type = Types[c.pgtype];
    }
  }

  return {
    tables: tables.filter(t => t.schema !== 'pgdifficult' && !t.name.startsWith('__pgdifficult_')),
    functions: functions.filter(f => f.schema !== 'pgdifficult' && !f.name.startsWith('__pgdifficult_')),
    views
  };
}

export interface Entry extends Change {
  id: string;
  segment: string;
  source?: string;
}

export async function dump(client: Client): Promise<Segment> {
  let changes: any[];
  try {
    changes = await client`select * from pgdifficult.entries order by id;`;
  } catch (e) {
    try {
      // watch for old-style diffs
      changes = await client`select * from __pgdifficult_entries order by id;`;
    } catch (e) {
      // ultimately, I don't think this matters
      console.warn(`error dumping diff entries`, e);
      changes = [];
    }
  }
  return changes.reduce((a, c) => {
    (a[c.segment] || (a[c.segment] = [])).push({
      table: c.table, old: c.old, new: c.new, stamp: c.stamp
    });
    return a;
  }, {} as { [key: string]: Change[] });
}

export async function entries(client: Client, since?: string): Promise<Entry[]> {
  if (since) return await client`select * from pgdifficult.entries where id > ${since} order by id asc;`;
  else return await client`select * from pgdifficult.entries where 1 = ${1} order by id asc;`; // gotta pass a param to get a result that doesn't have to be cast to any[]
}

export async function clear(client: Client) {
  await client`delete from pgdifficult.entries;`;
  await client`notify __pg_difficult, 'clear'`;
}

export async function stop(client: Client): Promise<Segment> {
  const res = await dump(client);
  await client.begin(async t => {
    await t`drop table if exists __pgdifficult_entries;`;
    await t`drop table if exists __pgdifficult_state;`;
    await t`drop table if exists pgdifficult.entries;`;
    await t`drop table if exists pgdifficult.state;`;
    const tables: Table[] = await t.unsafe(tableQuery);
    for (const table of tables) await t`drop trigger if exists __pgdifficult_notify on ${t(table.schema)}.${t(table.name)}`;
    await t`drop function if exists __pgdifficult_record();`;
    await t`drop function if exists pgdifficult.record();`;
    await t`drop schema if exists pgdifficult;`;
    await t`notify __pg_difficult, 'stopped'`;
  });
  return res;
}

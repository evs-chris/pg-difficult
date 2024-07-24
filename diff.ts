import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js';

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

export async function start(client: Client) {
  await client.begin(async client => {
    const tables: Table[] = await client.unsafe(tableQuery);
    await client`create table __pgdifficult_entries (id bigserial primary key, "schema" varchar not null, "table" varchar not null, segment varchar not null, old json, new json, stamp timestamptz not null);`;
    await client`grant all on table __pgdifficult_entries to public`;
    await client`grant all on sequence __pgdifficult_entries_id_seq to public`;
    await client`create table __pgdifficult_state (key varchar primary key, value varchar);`;
    await client`grant all on table __pgdifficult_state to public`;
    await client`insert into __pgdifficult_state (key, value) values ('segment', 'initial');`;
    await client`create or replace function __pgdifficult_record() returns trigger as $trigger$
  declare
    segment varchar;
    rec record;
    obj_old json;
    obj_new json;
    pkeys varchar[];
  begin
    set timezone = 'UTC';
    select value into segment from __pgdifficult_state where key = 'segment';
    case TG_OP
      when 'UPDATE' then
        select array_agg(a.attname::varchar) into pkeys from pg_index i join pg_attribute a on i.indrelid = a.attrelid and a.attnum = any(i.indkey) where i.indrelid = TG_RELID and i.indisprimary;

        case when pkeys is null then
          insert into __pgdifficult_entries ("table", "schema", "segment", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP(3));
        else
          with obj1 as (select * from json_each(row_to_json(OLD))), obj2 as (select * from json_each(row_to_json(NEW))), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
          select json_object_agg(key, value) into obj_old from diff;
          with obj1 as (select * from json_each(row_to_json(NEW))), obj2 as (select * from json_each(row_to_json(OLD))), diff as (select a.key, a.value from obj1 a join obj2 b on a.key = b.key where a.value is null and b.value is not null or b.value is null and a.value is not null or a.value::varchar <> b.value::varchar or a.key = any(pkeys))
          select json_object_agg(key, value) into obj_new from diff;
          insert into __pgdifficult_entries ("table", "schema", "segment", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, obj_old, obj_new, CURRENT_TIMESTAMP(3));
        end case;
        rec := NEW;
      when 'INSERT' then
        insert into __pgdifficult_entries ("table", "schema", "segment", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, null, row_to_json(NEW), CURRENT_TIMESTAMP(3));
        rec := NEW;
      when 'DELETE' then
        insert into __pgdifficult_entries ("table", "schema", "segment", "old", "new", stamp) values (TG_TABLE_NAME, TG_TABLE_SCHEMA, segment, row_to_json(OLD), null, CURRENT_TIMESTAMP(3));
        rec := OLD;
      else
        raise exception 'Unknown trigger op: "%"', TG_OP;
    end case;
    notify __pg_difficult, 'record';
    return rec;
  end;
  $trigger$ language plpgsql;`;
    await client`grant all on function __pgdifficult_record() to public`;
    for (const table of tables) {
      await client`drop trigger if exists __pgdifficult_notify on ${client(table.name)};`;
      await client`create constraint trigger __pgdifficult_notify after insert or update or delete on ${client(table.name)} deferrable initially deferred for each row execute procedure __pgdifficult_record();`;
    }
  });
}

export async function next(client: Client, segment: string) {
  await client`update __pgdifficult_state set value = ${segment} where key = 'segment';`;
  await client.unsafe(`notify __pg_difficult, '${JSON.stringify({ action: 'segment', segment }).replace(/\'/g, '\\\'')}'`);
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

  const functions: Function[] = await client.unsafe(functionQuery);
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

  return { tables: tables.filter(t => !t.name.startsWith('__pgdifficult_')), functions, views };
}

export interface Entry extends Change {
  id: string;
  segment: string;
  source?: string;
}

export async function dump(client: Client): Promise<Segment> {
  const changes = await client`select * from __pgdifficult_entries order by id;`;
  return changes.reduce((a, c) => {
    (a[c.segment] || (a[c.segment] = [])).push({
      table: c.table, old: c.old, new: c.new, stamp: c.stamp
    });
    return a;
  }, {} as { [key: string]: Change[] });
}

export async function entries(client: Client, since?: string): Promise<Entry[]> {
  if (since) return await client`select * from __pgdifficult_entries where id > ${since} order by id asc;`;
  else return await client`select * from __pgdifficult_entries where 1 = ${1} order by id asc;`; // gotta pass a param to get a result that doesn't have to be cast to any[]
}

export async function clear(client: Client) {
  await client`delete from __pgdifficult_entries;`;
  await client`notify __pg_difficult, 'clear'`;
}

export async function stop(client: Client): Promise<Segment> {
  const res = await dump(client);
  await client.begin(async t => {
    await t`drop table if exists __pgdifficult_entries;`;
    await t`drop table if exists __pgdifficult_state;`;
    const tables: Table[] = await t.unsafe(tableQuery);
    for (const table of tables) await t`drop trigger if exists __pgdifficult_notify on ${t(table.name)}`;
    await t`drop function if exists __pgdifficult_record();`;
    await t`notify __pg_difficult, 'stopped'`;
  });
  return res;
}

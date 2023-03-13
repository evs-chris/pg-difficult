import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js';

type Client = postgres.Sql<Record<string, unknown>>;

export const tableQuery = `select table_name as name, table_schema as schema from information_schema.tables where table_type = 'BASE TABLE' and table_schema not like 'pg_%' and table_schema <> 'information_schema' order by table_schema asc, table_name asc;`;
export const columnQuery = `select ts.table_schema as schema, ts.table_name as table, cs.column_name as name, cs.is_nullable = 'YES' as nullable, (select keys.constraint_name from information_schema.key_column_usage keys join information_schema.table_constraints tc on keys.constraint_name = tc.constraint_name and keys.constraint_schema = tc.constraint_schema and tc.table_name = keys.table_name where keys.table_schema = cs.table_schema and keys.table_name = cs.table_name and keys.column_name = cs.column_name and tc.constraint_type = 'PRIMARY KEY') is not null as pkey, cs.udt_name as pgtype, cs.column_default as default, cs.character_maximum_length as length, case when cs.udt_name = 'numeric' and cs.numeric_precision > 0 and cs.numeric_scale > 0 then array[cs.numeric_precision::integer, cs.numeric_scale::integer] else null end as precision from information_schema.columns cs join information_schema.tables ts on ts.table_name = cs.table_name and ts.table_schema = cs.table_schema where ts.table_schema <> 'pg_catalog' and ts.table_schema <> 'information_schema' order by cs.column_name asc;`;
export const enumQuery = (type: string) => `select enum_range(null::${type})::varchar[] as values;`;

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
}

export interface Column {
  schema: string;
  table: string;
  name: string;
  nullable: boolean;
  pkey: boolean;
  pgtype: string;
  enum?: string[];
  type?: string;
  default?: string;
  length?: number;
  precision?: [number, number];
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
    await client`create table __pgdifficult_entries (id bigserial primary key, "table" varchar not null, segment varchar not null, old json, new json, stamp timestamptz not null);`;
    await client`grant all on table __pgdifficult_entries to public`;
    await client`grant all on sequence __pgdifficult_entries_id_seq to public`;
    await client`create table __pgdifficult_state (key varchar primary key, value varchar);`;
    await client`grant all on table __pgdifficult_state to public`;
    await client`insert into __pgdifficult_state (key, value) values ('segment', 'initial');`;
    await client`create or replace function __pgdifficult_record() returns trigger as $trigger$
  declare
    segment varchar;
    rec record;
  begin
    select value into segment from __pgdifficult_state where key = 'segment';
    case TG_OP
      when 'UPDATE' then
        insert into __pgdifficult_entries ("table", "segment", "old", "new", stamp) values (TG_TABLE_NAME, segment, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP(3));
        rec := NEW;
      when 'INSERT' then
        insert into __pgdifficult_entries ("table", "segment", "old", "new", stamp) values (TG_TABLE_NAME, segment, null, row_to_json(NEW), CURRENT_TIMESTAMP(3));
        rec := NEW;
      when 'DELETE' then
        insert into __pgdifficult_entries ("table", "segment", "old", "new", stamp) values (TG_TABLE_NAME, segment, row_to_json(OLD), null, CURRENT_TIMESTAMP(3));
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
      await client`create trigger __pgdifficult_notify after insert or update or delete on ${client(table.name)} for each row execute procedure __pgdifficult_record();`;
    }
  });
}

export async function next(client: Client, segment: string) {
  await client`update __pgdifficult_state set value = ${segment} where key = 'segment';`;
}

export async function schema(client: Client) {
  const tables: Table[] = await client.unsafe(tableQuery);
  const columns: Column[] = await client.unsafe(columnQuery);

  for (const t of tables) t.columns = [];
  for (const c of columns) {
    const t = tables.find(t => t.name === c.table);
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
  return tables.filter(t => !t.name.startsWith('__pgdifficult_'));
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
  if (since) return await client`select * from __pgdifficult_entries where stamp > ${since} order by id asc;`;
  else return await client`select * from __pgdifficult_entries where 1 = ${1} order by id asc;`; // gotta pass a param to get a result that doesn't have to be cast to any[]
}

export async function clear(client: Client) {
  await client`delete from __pgdifficult_entries;`;
}

export async function stop(client: Client): Promise<Segment> {
  const res = await dump(client);
  client.begin(async t => {
    await t`drop table if exists __pgdifficult_entries;`;
    await t`drop table if exists __pgdifficult_state;`;
    const tables: Table[] = await t.unsafe(tableQuery);
    for (const table of tables) await t`drop trigger if exists __pgdifficult_notify on ${t(table.name)}`;
    await t`drop function if exists __pgdifficult_record();`;
    await t`notify __pg_difficult, 'stopped'`;
  });
  return res;
}

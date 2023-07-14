import { readLines } from 'https://deno.land/std@0.177.0/io/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.3.5/mod.js';

import { start, next, dump, schema, clear, stop } from './diff.ts';

const config = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'postgres',
  password: '',
  ssl: 'prefer' as 'prefer'|'require',
  onnotice() {},
};

for (let i = 0; i < Deno.args.length; i++) {
  const a = Deno.args[i];
  switch (a) {
    case '-p': case '--port':
      config.port = +Deno.args[++i]; break;
    case '-h': case '--host':
      config.host = Deno.args[++i]; break;
    case '-d': case '--database':
      config.database = Deno.args[++i]; break;
    case '-U': case '--user': case '--username':
      config.username = Deno.args[++i]; break;
    case '-W':
      config.password = prompt('password: ') || '';
      break;
    case '-w': case '--password':
      config.password = Deno.args[++i]; break;
    case '--ssl':
      config.ssl = 'require'; break;
  }
}

const client = postgres(config);

await start(client);

Deno.addSignalListener('SIGINT', async () => {
  console.info(`\nStopping...`);
  await stop(client);
  await client.end();
  Deno.exit(0);
});

let count = 0;
for await (const line of readLines(Deno.stdin)) {
  if (line === 'exit' || line === 'quit') break;

  try {
    const parts = line.split(' ');
    switch (parts[0]) {
      case 'next': {
        count++;
        const name = parts.slice(1).join(' ') || `segment ${count}`;
        await next(client, name);
        console.log(`new segment is ${name}`);
        break;
      }

      case 'write': {
        if (!parts[1]) console.error(`Please provide the path to the file to be written.`);
        else {
          const file = parts.slice(1).join(' ');
          await Deno.writeTextFile(file, JSON.stringify(await dump(client)));
          console.log(`Wrote changes to ${file}`);
        }
        break;
      }

      case 'clear': {
        await clear(client);
        break;
      }

      case 'schema': {
        const res = await schema(client);
        if (!parts[1]) console.info(res);
        else {
          const file = parts.slice(1).join(' ');
          await Deno.writeTextFile(file, JSON.stringify(res));
          console.log(`Wrote schema to ${file}`);
        }
        break;
      }

      default: {
        console.warn(`"${parts[0]}" is an unrecognized command. Try "next [name]" or "write <file>" or "clear" or "schema [file]".`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

await stop(client);
await client.end();

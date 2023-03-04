import { encode } from 'https://deno.land/std@0.177.0/encoding/base64url.ts'

function join(path: string, name: string): string {
  if (path) return `${path}/${name}`;
  else return name;
}

async function packageDir(local: string, prefix: string, out: Record<string, string>) {
  for await (const e of Deno.readDir(local)) {
    console.log(e.name, join(local, e.name), join(prefix, e.name))
    if (e.isFile) out[join(prefix, e.name)] = encode(await Deno.readFile(join(local, e.name)));
    else if (e.isDirectory) await packageDir(join(local, e.name), join(prefix, e.name), out);
  }
}

const out: Record<string, string> = {};
await packageDir('./public', '', out);
await Deno.writeTextFile('./client.ts', `export const fs: Record<string, string> = ${JSON.stringify(out)}`);

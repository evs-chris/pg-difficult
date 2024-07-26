# pg-difficult

pg-difficult is a database data diff-er for PostgreSQL (9.5+) that aims to be easy to use.

**WARNING**: pg-difficult does some stuff in the databases it is watching in order to watch them. You should probably not run it against a production database or even a database that belongs to anyone other than you. See the [Design](#Design) section for more details.

## Tools

### Diff

The titular tool on this bat-database bat-tool bat-belt. Diffs can be started on multiple databases, and the server will record changes, sending them to the client as they stream in. Diffs are recorded in groups called segments. Changing the segment name from the control panel will start a new segment, and all running diffs share the segment name.

As long as there is at least one diff running, previously started and stopped diffs will be retained on the server. Entries can be cleared from the control panel while diffs are still running to reset saved and active state.

If you're feeling spicy, you can enable undo on a diff window and roll back individual or whole segments of changes. This is accomplished under the hood by running the inverse of the recorded change e.g. a delete for an insert or an inverted update.

### Monitor

When testing something that changes things in a database, it is often useful to keep an eye out for connection leaks. The connection monitor tool will connect to your database, grab a list of all active connections, and poll connections until you stop it, surfacing any new connections that happen along the way. You can select a polling interval from at least 1s on, and it defaults to 10s.

### Schema

Next up is the schema tool. This lists every table, view, and column in the database in expandable, searchable lists. The search can be done by name or using a Raport expression. There's also a comparison function for tables, so if you happen to have a few different test databases and need to quickly see what schema changes may have been applied to one and not another, you can get a diff of the entire database schema relatively quickly.

Functions are also in the schema and viewable in a list.

### Query

If you're looking at changes in a database and how the schema is laid out, chances are you'll also need to run a query or two at some point. `psql`, `pgAdmin`, and a legion of other tools can help you out with that, but you're already here with connections configured, so why not have a way to fire off a quick query or two. You can run a query using ctrl+enter or the run button, and if there is a highlighted selection in the query editor, only the highlighted text will be used as the query.

Queries can be saved to browser storage and recalled into a particular query window by clicking the Load button on the Saved Queries tab of the control panel and then the Load button on the target query window.

Query results can also be downloaded as a delimited text file with delimiters based on settings from the Control Panel.

### Scratch Pads

Sometimes you just need a place to write a few things down so that you can organize them or adjust them for use elsewhere. Scratch pads are a tool that can help with that. They are also stored in browser storage and have a name and a syntax type.

### Reporting

Reporting is sort of the other side of the CRUD coin when it comes to databases, and there happens to be a reporting library already included in pg-difficult to handle diffing and advanced filtering. It just kind of makes sense to allow hooking up the reporting engine to the exposed database connections, and so pg-difficult has a few different ways of reporting built in. The designer also has docs and a handy evaluation console for working with the Raport expressions that are used in advanced filtering.

### Host Explorer

If you're connected to a database with a user of sufficient privileges, chances are you can access more than one database managed by the postmaster. If you're doing development, you may also have access to more than one server. The Host Explorer will let you peruse each connection you have defined to see all of the databases on the host. It will also give you details of each database, let you view the schema, run queries, and run reports. It can replace some usage of pgAdmin if you mostly only need pgAdmin to connect to databases, look at the schema, and run queries.

The database tree will allow you to filter the databases in the tree, and the Query All tool will allow you to aggregate queries across all databases that are in the tree. A report can also be set up on top of the Query All tool, which can be quite useful in a number of ways.

You can run multiple host explorers to allow for different sets of hosts to be targeted for simultaneous cross-host querying.

## Running

The easiest way would be to download a release from the GitHub releases. The safest way is to clone this repo and run manually with your local Deno, so you can have complete control over what it gets to access.

To run pg-difficult, you'll need a recent version of [Deno](https://deno.land) for your platform and the source.

pg-difficult will try to connect using a tls encrypted connection by default, but if that fails, it will fall back to an unencrypted connection. If your PostgreSQL cluster is not configured to allow plain host connections, and you don't have a properly signed certificate, you'll probably have issues connecting to the server. The workaround for this is to pass `--unsafely-ignore-certificate-errors` to Deno, at the very least, for the host name of your server.

The binaries are all built to allow all access and ignore certificate errors.

### Safety

While connections are stored in browser storage, anything connected on the server side i.e. a diff or connection monitor makes that connection available to any client that can connect to pg-difficult. By default, the pg-difficult server listens on 127.0.0.1:1999, but you can request a different port and bind address. It's important to be aware that there are no authentication or authorization measures in place to guard access to anything that happens to be running on the server.

Browser local storage is also relatively secure, but it's possible for another server to run on the same host and port that you connected to pg-difficult on at some point, the client for that server would have access to all of your local storage, including connection details.

For local development environments, these concerns aren't usually a terrible risk, but it's important to be aware of possible risks that tooling exposes.

## Building an executable

To build pg-difficult:

1. Assemble the client files into a module with the included script: `deno run -A ./build-client.ts`
2. Run the serve script with `deno run -A --unsafely-ignore-certificate-errors ./serve.ts`. You could also compile instead of run, and specify a target to cross-compile for other platforms.
3. ???
4. Profit!

Since Deno compile does not have a way to embed a filesystem, the public directory is stringified and served directly out of an generated module. The sources for the embeded filesystem module live in the public directory and are vendored in this repository, but the output is excluded. If the server detects the public folder in its working directory, it will serve files directly out of it rather than the built module, which makes iterating during development quite a bit simpler.

## Design

There are tools out there that can record changes that happen to your database as it runs. In fact, PostgreSQL has builtin logical replication that does exactly that, however, it's not as easy to use for non-DBA-type people as is possible. It also doesn't work on some legacy versions of PostgreSQL. This tool gives you a web interface to connect to, monitor, and query any number of PostgreSQL databases simultaneously.

### Database

The monitoring is accomplished by installing triggers on every table that exists in the database when the connection is initiated. The triggers are fairly simple, so they shouldn't have too much impact on performance. They create a JSON object out of both the old and new values provided to the trigger, store them in a tool-specific table that is created when the diff is started, and notify the server that a change was recorded (to avoid having to poll).

When monitoring is stopped, the tool-specific tables and all of the triggers are dropped.

Any tools that aren't directly related to monitoring e.g. Query and Schema can be used without modifying the database in an unusual way (if you run a DML or DDL query, it will modify that database, but hopefully in a way that is intentional).

### Server

The server is comprised of a Deno application powered by Oak, mostly over a websocket, and the postgres.js database driver. It manages a single set of global state tracking connected clients and databases. Stopping the server will stop change tracking in any attached databases if it's done politely. `kill -9`ing the server will result in leftover tool-specific tables `__pgdifficult_state` and `__pgdifficult_entries` and all of the triggers remaining in place. The server will replace the triggers when starting a new diff, but it will error if the tool-specific tables are in place when it tries to attach.

### CLI

There is an additional alternate CLI available that can be connected to a single database to record changes from the command line. The goal for this component is to possibly expand into a testing tool that can be used to perform automated validation during integration tests.

### Client

The client is built on top of Ractive using the Raui component library to expose an MDI that lets you arrange your workspace however you need. It's not exactly a lightweight, serving around 1MB of unminified JS on load, and if you're running queries against large data sets or recording lots of changes to large tables, that will compound quickly. That 1MB of JS is the whole application though, and as it's intended to be run locally as an application rather than a web page, I don't really see that as too much of a problem.

The `index.html` page loads in all of the requisite scripts, serves as a container for Ractive templates, has the base styles for the application, and holds the mountpoint for the main application.

The `index.js` page bootstraps the application and contains the Raui Window definitions for the various views used in the client. Each window is contained in a class, with most of them fitting in a single screen of code. The templates are external and not pre-parsed, but they are also reasonably sized. Several of the windows also include scoped css that is inlined in the definition to avoid having to have a build step to parse the template and css into a module.

Once the main application is mounted, a websocket connection is established with the server. The server is then asked for the current status and set of recorded entries. The client is also notified any time additional entries are made, and it will request the entries using the timestamp of the last received entries as a delta point. If the websocket gets disconnected, the client will attempt to reconnect it, blocking the UI until it can communicate with the server again.

Requests to the server that require a response have an id attached to them and return a promise that resolves when the server sends a response with a matching id. Most of the interactions with the server that don't involve diff-ing will use this method to communicate.

The client takes advantage of local storage in the browser to save connection details, queries, and settings. This has the pro of allowing different setups to be saved in the same browser by changing the port that the server is listening on. It also has the con that you can't take your settings between browsers.

## TODO

* [x] Provide a way to download diffs, schemas, and query results.
* [x] Allow exporting and importing application settings.
* [x] Add a dark theme.
* [x] Expose all server connections in additional tabs in the monitor.
* [ ] Add other instance polling so that multiple servers can diff the same database and let the last one out turn off the lights.

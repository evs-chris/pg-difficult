## 1.9.0

i2024-07-25

### Bugs

* The pg notification listener will now send pings to make sure the backend doesn't get closed without pg-difficult being notified. This makes it far less likely for changes to be recorded in the database without pg-difficult showing them.

### Features

* Schemas now include views and functions, though only tables are compared when comparing schemas for now.
* Stopping a diff now gives visual feedback while in process and when it finishes.
* The query and scratch editors now use Ace editor, which gives syntax highlighting, key bindings, etc. The editor has a few settings exposed in the settings control panel.
  * Scratch pads can now set a syntax mode.


## 1.8.0

2024-06-13

This release makes reports considerably more useful with single and multi-database queries, including applying query parameters from defined report parameters. There is still a lot of work to be done with reports to make them more useful, like typed parameter support and automatic CSV reports for queries.

### Features

* There is now support for dark mode, along with an override setting.
* Reports and saved queries can now be reordered and sent to top and bottom with a shift/ctrl + click.
* There are now scratch pads, which store text in browser storage.
* There is a new Host Explorer that shows all available databases on a server, if possible.
  * Individual databases can be queried by switching selected databases and rerunning an entered query.
  * Individual database schemas can be browsed by switching selected databases.
  * The list of databases can be filtered using properties of the connection and database.
  * The each of visible databases can be queried using a query all facility that can be used for reports or to add data to use to filter the database list further.
  * Reports can specify a query source to target individual databases or a query all source to target all visible databases.
* The split diff entries buttons now have guidance for what exactly will happen when the diff is split.

### Bugs

* Reloaded diff entries will no longer offer to undo segments if undoing segments is enabled by default.


## 1.7.1

2023-08-18

### Bugs

* The client will no longer attempt to warn about leaving if the client also stopped the server.

### Other

* There are now warnings in the server help and on the initial client view about what will happen when a diff is started.
* There is now a Nix derivation available in the nix directory. You should be able to get a shell with pg-difficult available to try with `nix-shell -E 'with import <nixpkgs> {}; let pgdiff = import (builtins.fetchTarball { url = "https://github.com/evs-chris/pg-difficult/releases/downloads/v1.7.1/nix.tar.gz"; }) {}; in runCommand "pgdiff" { buildInputs = [ pgdiff.pg-difficult ]; } ""'`.


## 1.7.0

2023-08-17

### Features

* Starting the server will now also try to launch the client in the platform default browser. This can be disabled with the `--noui` cli argument.
* There is now a button at the bottom of the control panel that will stop the server. Navigating away in the client will attempt to warn about leaving the server running and offer to stop the server.
* There is now a non-binary distribution that can be run with standalone `deno`.


## 1.6.1

2023-08-15

### Bugs

* The server will now try to avoid known crashing errors caused by connection loss. This makes putting a laptop running a diff on a remote machine to sleep a little more reliable.
* Multiple clients accessing a server and multiple servers diffing the same database will now try to avoid allowing the clients to get out of sync.
* Hover buttons for new/removed diff records will now display correctly.
* Downloading a diff from a window with a filter expression applied will no longer leave the filtered out values out of the downloaded file.
* Errors in filter expressions are now indicated in the UI.
* The report designer now properly defaults to a matching light theme.
* Providing sources for a report will no longer require expanding the window to input a query or JSON into a textarea.


## 1.6.0

2023-07-16

### Bugs

* Mulitple diffs will no longer clobber each other when their id ranges overlap.
* Undoing a segment from a sticky header will now get all the entries rather than just the ones from the start of visible data.

### Features

* Segments can now be renamed.
* Segments can now be split into multiple segments.
* Entries for individual diffs can now be cleared.


## 1.5.0

2023-04-24

### Bugs

* Scrolling with a few really large entries before a bunch of really small entries at the end of a diff set is less likely to get stuck in a scroll loop.

### Features

* The segment name field will now fill available space.
* Schema columns now include their position in the table, so they can be shown in table order by clicking the name column header.


## 1.4.2

2023-04-18

### Bugs(?)

* Diff entry values are now rendered with pre-wrap so you can see whitespace differences.
* There is now an autoarrange button available when the UI is in windowed mode.


## 1.4.1

2023-04-14

### Bugs

* The undo button in the virtual list header for diff entries will now work correctly.


## 1.4.0

2023-04-14

### Features

* Schemas can now be reloaded from saved diffs.
* There is now more information given in the schema viewer, and it is rendered virtually so that large schemas don't get laggy.
* Diff entries can now be filtered with a raport expression. This is expression is saved when the data is exported and reloaded when it is imported.
* The web client can now be used as a standalone app that can load saved data and run reports against it.
* Menu entries for other windows with longs titles will now marquee on hover.


## 1.3.0

2023-04-06

### Bugs

* The server will now successfully connect over SSL by prefering an SSL connection to a plain connection.


### Features

* The listen address for the server can now be specified as an argument. It also now defaults to 127.0.0.1 rather than 0.0.0.0, so that live connections don't accidentally expose a database with a live diff or connection monitor to whoever happens by the right port.
* There is now a help option that prints options and info an immediately exits.


## 1.2.3

2023-04-06

### (Tiny) Features / UI Bugs?

* Changing the text in the segment name field will now automatically submit the change to the server 1.5s after typing has stopped because Andrew forgets to click the button.
* Requests to the server will now show a spinner while in flight, since some connections are considerably slower than others, making schema retrieval and queries take a while. The feedback makes it less likely for you start to question whether you hit the button correctly or not.


## 1.2.2

2023-03-31

### Bugs(?)

* The change entry view now renders using a virtual list that limits actually rendered entries to a minimum around the viewport. This helps keep the UI relatively snappy when there are more than a few entries in a set. Prior to this, a list of 100 entries would noticably slow the UI, and 2500 would cause the hung script warning to pop up a couple of times before the UI would even render. With a virtual list, 100 entries and 2500 entries have equivalent performance.


## 1.2.1

2023-03-25

### Bugs

* Restarting a diff will no longer fail.
* There are now fewer non-fatal errors logged in the console of both the server and client.

### Features

* Columns in the query output are now sortable using the column headers.
* Change entries, as opposed to additions or deletions, will only record the fields that actually change, which shrinks diffs significantly.


## 1.2.0

2023-03-16

### Features

* The diff view can now optionally hide default and/or empty fields for whole record display e.g. for added and removed records. Changed records already have minimal output, so they are not affected by these settings.
* The settings tab on the control panel can now set defaults for allowing undo and hiding fields in diff views.
* Columns in query results now have their full value in a title attribute, so you can get the full value as a tooltip on hover.
* Clicking a column value in query results will copy it to the clipboard. Holding ctrl and clicking a column value in query results will copy the record as JSON to the clipboard.


## 1.1.2

2023-03-16

### Bugs

* The change logging triggers are now deferred to the end of transactions so that the diff entries are available when immediately after the notification fires.
* The notification from the server to the client are now throttled to avoid floods of requests for diff records during heavy updates and interleaved transactions.
* The client will now only fire a single request for new entries at a time to avoid race conditions.


## 1.1.1

2023-03-15

### Bugs

* Undoing a diff segment will now run the reversing statements in the correct order and apply all of the necessary statements.
* Undoing an insertion diff in a table with a primary key will now work correctly.


## 1.1.0

2023-03-15

__You probably shouldn't use this version if you want to undo diff segments.__

### Bugs

* Diff entries are now sorted by key for added and removed records.
* JSON objects in diff entries are now stringified correctly in the viewer rather than showing a friendly `[object Object]`.
* The table schema is now stored with the rest of the diff record as changes are recorded by the tool-specific trigger.

### Features

* The client and server will now display the version number of the running release.
* The diff and schema views now allow downloading data, and it can be reloaded from files from the menu. Diffs get the extension pgdd for pg-difficult diff, and schemas get pgds for pg-difficult schema.
* The diff view will open the diff html in a new window if you hold the ctrl key when clicking Download.
* The diff view will download the diff html if you hold the shift key when clicking Download.
* Diffs can now be resumed or restarted if the server is asked to connect to a database that already has tool-specific tables in place.
* The query handle on the server now supports parameters. It can also run multiple statements in series and will do so using a transaction.
* Diff entries and segments can now be undone by enabling the undo buttons for either or both on a live diff entry window. Undo is not supported for diff views on multiple connections or from reloaded files.
* The query window will now report rows affected for statements that inherently return empty sets e.g. insert, update, and delete.
* __EXPERIMENTAL__: There is now limited reporting functionality included using an embedded [Raport](https://github.com/evs-chris/raport) designer. Data sources may be the active diff, the active diff schema, or any number of queries.


## 1.0.2

2023-03-07

### Bugs

* The backing tables, sequence, and trigger function now have universal access granted so that if you connect with a superuser for the change tracking but not for an actual application, you can still run CRUD statements from the application.
* The layout of added/removed entries in the change view no longer squishes the data source on the end of the change name.

### Features

* Per special request, you can now reorder saved connections in the list.


## 1.0.1

2023-03-07

### Bugs

* The data change tracker will now install triggers on the table using syntax that's compatible with versions of PostgreSQL older than 11.


## 1.0.0

2023-03-07

### First Release

* Live data change tracking is support on multiple databases.
* Connections can be monitored on multiple instances and multiple databases on each instance.
* Connections can be saved to browser local storage.
* Queries can be run against any saved connection or active monitor.
* Queries can be saved to local browser local storage and reloaded into any open query window.
* The schema of any connection can retrieved and displayed in a searchable list.
* Schemas from multiple databases can be compared to show differences between two versions of a database.
* The only binaries released are the full server. The CLI will be integrated at some point in the future.

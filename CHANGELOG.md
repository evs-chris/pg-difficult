## 1.13.2

2025-01-15

### Bugs

* Report sources that load or cache data will now remove any stored data before saving the definition to avoid bloat. In more extreme cases, this could result in failure to save or sync the definition.
* Newly opened windows will now have a correct title on mobile layouts without have to reselect them from the window list on the menu.
* The client-only client will no longer offer to stop the server.

### Features

* There is now a setting to set the default control panel tab.
* Markdown scratch pads will now render asynchronously and support having their rendered content printed or downloaded.
* Diff segments can now be collapsed and expanded.
* Markdown scratch pads can now have fenced raport+text code that is evaluated to a code block at render.
* Host explorer reports have better support for parameters, including more appropiate inputs for different typed parameters.
* Host explorer visual reports can now be run as delimited with configurable delimiters and quotes. This is utilizing underlying support in raport that renders the first repeater to text.
* Report sources can now be conditional, meaning they can be skipped if they aren't necessary for the report to run based on the parameters it is given. If a source is elided, it can supply an alternate expression for its data or it will resolve to an empty array.
* Schema explorers that have a connection to a database now have a button on the tab bar to refresh the schema.
* Diff entries with no changes (empty changesets) can now be hidden and can also be optionally skipped when running undo on them.
* Diff viewers now show how many entries are currently visible of the entry total.


## 1.13.1

2024-11-24

### Bugs

* Remote sync servers will now be initialized the same way as the local store is to ensure that partial syncs work correctly.
* Check requests from the client should no longer time out if the server has become disconnected.
* Markdown tables and headers will now render more legibly in the viewer.


## 1.13.0

2024-11-11

### Bugs

* Relative times older than the current day will now render correctly.
* Diff listeners will no longer readily leak connections.
* Leak monitors will now reconnect if the server loses connection with the target database instance.
* The diff trigger can now handle inserts and deletes on postgres 10.
* Starting and stopping diffs now uses a single message to the server to improve performance on laggy connections.
* All uses of connection management now explicitly specify a timeout so socket timeouts don't result in hung connections.
* The query tool can now run statements that can't be run in a transaction, like create database.
* Diff HTML can be downloaded directly by hold alt.
* Diff autoscroll will now work on unfocused browser tabs.
* The raport scratch pad language reference will now follow the ui scale setting.
* The diff and scratch pad result object trees will once again render leaf values.

### Features

* The server now supports requiring basic auth to connect. This is not a substitute for actual security, but it can prevent minor mishaps in a trusted environment.
* The server will now accept a config file as an option that is read as a raport expression and the resulting object may contain keys that match the cli flags in addition to a users dictionary with password values that can be used with basic auth.
* The leak monitor now includes query and session liveliness information.
* There is a new fetch data source available to reports that can run fetches through the server.
* Multi-database queries now include timing info and a completion estimate.
* Diff segments can now be undone and hidden with one click by holding alt and clicking undo. This will also leave the segment name intact, and the undo segment will also be hidden.
* Scratch pads, reports, and queries can now be downloaded. Scratch pads and reports can be uploaded from a local file or copied as a new entry.
* The wait cursor is now universal.
* Markdown scratch pads now support images in code fences with svg+inline, png+base64, and jpeg+base64.
* Raport scratch pads will show literal output in the tree tab if the result is not an object.
* Scratch pads now have local editor options that override the global settings only for their window.
* Report paths are now separated from their names and are editable in the report designer.
* Host-only reports are now displayed in a tree view in the host explorer.
* Tree view items with long names will now marquee scroll the names on hover.
* Raport scratch pads now support log message aggregation from raport 0.25.0.
* Raport scratch pads now support highlighting spaceless symbolic binary operations.


## 1.12.1

2023-08-30

### Features

* There is now a setting to adjust the menu width.
* Markdown scratch pads will now render [mermaid](https://mermaid.js.org) charts in fenced code sections labelled as mermaid or chart.


## 1.12.0

2024-08-24

**NOTE:** This version moves from browser local storage to pouchdb, which greatly increases the amount of storage available and allows for syncing with external couchdb-compatible data stores. Existing settings will be imported on the first load of the client, and the local storage versions will be removed. You may want to export your settings before running this version.

This version also introduces a schema change to the diff recording tables that allows for hiding entries. Attempting to hide segments in a diff resumed from an older version will fail.

### Bugs

* Diff details are now memoized, so lage diff views should no longer make the windowing system laggy.
* Report designers will now follow the selected color scheme.
* View definitions are now directly compared during schema comparison. Prior to this release, schema comparison that supported views only considered the columns of the view and not the statement that generated them.

### Features

* Reports, queries, and scratch pads can be named with `/`s to place them in sub-directories, as they are now displayed in a tree view rather than an orderable list.
* There is now a scale setting and a meta tag to try to make mobile browsers a little less painful to use. Tooltips will display in a toast if poked.
* Settings and local data are now stored in a pouchdb instance, which can be configured to selectively sync with a couchdb-compatible server.
* Scratch pads now have an unsaved indicator, support manual saving, and can be configured not to autosave.
* Connections can now specify their use type, so diff connections can be excluded from host explorers and vice versa. You can now edit a host explorer connection by shift+clicking the host refresh button.
* Local diff once again supports raport as a value display mode.
* Diff segments may now be hidden using a new button in the segment header. This is particularly useful during testing where an action has to be undone several times before the desired outcome is achieved. Hidden segments are not removed from the tracking database or downloadable output. Hiding segments in a downloaded file will persist the hidden state when the file is downloaded again.
* Downloading a diff will now ask for a file name with the old automatic file name set as the default.
* The client being disconnected from the server will now only block portions of the UI that require a server connection to be useful.
* Scratch pads in markdown mode now have a view tab that renders the markdown as html. Fenced code blocks support highlighting for a selection of languages, and check lists render checkboxes that will update the source text when changed.
* There is now an Eval Pad button on the control panel that opens an expression pad for quick convenient calculations.


## 1.11.0

2024-08-12

### Bugs

* Client-only-mode no longer shows some of the newer server settings.
* If you happen to have two tabs open on the same browser instance pointed at the same pg-difficult server (storage namespace), settings changes in one will be propagated to the other a few seconds later. Scratch pads count as settings.
* Local diff data is no longer persisted in browser storage. This was a holdover from the tool's origin.
* Actions that required a ctrl+click will now also be triggered by a shift+click because Apple just has to be extra special.
* Schemas will now compare views and functions in addition to tables.
* Comparing two schemas from within the host explorer is now possible.
* Provided query result report sources will now persist correctly.
* The query all source for reports can now successfully run the query for sample data against the first visible database in the tree.
* Object viewer trees will no longer spike browser resource usage quite so much.
* Editor settings are now correctly applied to query views in the host explorer and report source editor.
* Query all reports will no longer run if you select 'No' in the confirmation.
* Delimited reports run from the host explorer will now show readable output in the viewer.

### Features

* Scratch pads now support raport expressions, and scratch pads in raport mode can evaluate expressions and view the results. Various bits of data can be exposed to raport pads as data sources by shift-clicking a download button, applying a query all, etc. There are also language and operator docs in the evaluation pane of the pad.
* The sticky headers in the schema viewer are now slightly less confusing.
* Query all queries will now show a progress toast as they are running.
* There are now options to name and provide a different color set for a client. This should allow different instances to be distinguished more easily.
* There is now an option to directly download host explorer reports rather than just viewing.
* Tab size and soft tab mode are now options for the editor.
* There is now a concurrency option for query all in the host explorer that allows using from 1 to 500 concurrent connections rather than the default 10.
* You can now create reports from the host explorer and close a selected report once it has been selected. The run buttons for query all reports will now give you visual feedback if the report can't run because there are no active databases against which to run it.


## 1.10.0

2024-08-07

### Bugs

* Older versions of postgres (down to at least 9.5) are now supported by the schema gatherer in the server.
* Auto-scrolling at the end of a diff as new entries arrive auto scrolls again.
* Apparently the win64 build won't work without also showing a terminal window, so it'll do that again.

### Somewhere between bugs and features

* Active diffs will now attempt to be disconnect tolerant, so if you're on a flaky connection, the server won't crash or cease sending diff entries as they come in without notifying. Active diffs that become disconnected will get an indicator next to them in the menu.

### Features

* Diffs that are starting and stopping will show the wait indicator in the title bar while the server is starting and stopping the diff in the selected database, and the button to start the diff will disable until the server responds.
* Diff connections can now specify table patterns to ignore for diffing, with `__pgdifficult_%` and `pgdifficult.%` automatically ignored.
* Diff connections can specify the maximum value length to show up in a diff entry. It happens that browsers don't deal well with dropping 180mb of binary string into a div. This value currently defaults to 0, because it does affect undo support. If you don't want to specifically exclude a full table, this is a good option to set to something like 10,000. If a value exceeds the specified length, it will be replaced with a string that includes the md5 of the data.
* Diff connections can now specify the format of update entries, where the whole record for both the old and new records are stored, the whole old record and the just the changes of the new record are stored, or just the changes in both the old and new records are stored.
* The pg-difficult name at the top of the menu is now a link to the github page.
* Query and scratch editors now have selectable themes in settings, and scratch editors have more available modes.
* There are line number, relative line number, and highlight selected word options for editors.
* vim mode editors now have j -> gj and k -> gk in normal mode, and jk or kj -> esc in insert mode mappings because I like them.
* There is now a local diff tool that compares two objects that can be sourced from csv, xml, json, query rows, or diff entries. Shift+click on a table row will copy it to the clipboard and make it available to the local diff tool. Clicking a diff entry header will copy the new value, and shift+clicking a diff entry header will copy the old value.


## 1.9.2

2024-07-25

### Bugs

* The pg-difficult trigger will no longer be included in schemas.

### Features

* Query views now have a splitter between the sql and the results, allowing them to be resized.


## 1.9.1

2024-07-25

### Bugs

* The diff entry view will now use the associated database schema correctly to show record primary keys and be able to hide defaulted or blank fields.
* The connection monitor table header now displays correctly in dark mode.


## 1.9.0

2024-07-25

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

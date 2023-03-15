## 1.1.0

2023-03-15

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

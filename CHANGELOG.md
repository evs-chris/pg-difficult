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

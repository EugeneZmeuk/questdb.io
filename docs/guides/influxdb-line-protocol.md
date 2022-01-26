---
title: InfluxDB line protocol
description:
  This document describes how to write data into QuestDB using InfluxDB line
  protocol with details on the message format and hints for troubleshooting
  common issues
---

QuestDB exposes a reader for InfluxDB line protocol which allows using QuestDB
as a drop-in replacement for InfluxDB and other systems which implement this
protocol. This guide provides practical details of using InfluxDB line protocol
to send data to QuestDB, with hints for formatting messages to ensure that
QuestDB correctly parses incoming data as the desired data type.

For more details on configuring the QuestDB server with ingestion settings,
refer to the [InfluxDB API reference](/docs/reference/api/influxdb/).

## Message format

InfluxDB line protocol messages have the following syntax in QuestDB (square
brackets denote an optional part):

```shell
table_name[,symbolset][ columnset] timestamp
```

For example:

```shell
trade,ticker=USD,id=9876 price=30,details="Latest price" 1638202821000000000
```

The data of each row is serialized in a "pseudo-CSV" format where each line is
composed of:

- the table name
- a comma followed by several comma-separated items of symbol type in the format
  `<name>=<value>`
- a space followed by several comma-separated items of other column types in the
  format `<name>=<value>`
- a space followed by an optional timestamp
- a newline character `\n`

A single line of text in InfluxDB line protocol format represents one table row
QuestDB. The InfluxDB line protocol message

```shell
sensors,location=london-1 temperature=22 1465839830100399000
```

creates a new row in the `sensors` table with the following contents:

| location | temperature | timestamp                   |
| -------- | ----------- | --------------------------- |
| london-1 | 22          | 2016-06-13T17:43:50.100399Z |

### How QuestDB parses InfluxDB line protocol messages

Let's consider an example of how InfluxDB line protocol (ILP) will be parsed in
QuestDB. For illustrative purpose, we will include values with special
characters such as the `BTC\USD` symbol value and the `UTC \ London` string
value which include backslashes and whitespace.

The ILP line we want to construct looks as follows:

```shell title="An ILP message and its constituents"
spot_trade,ticker=BTC\\USD,id=9876 price=30,lots=33i,details="UTC \\ London",of=1638202821000000t,liquidity=f 1638202821000000000
---------- ----------------------- -------------------------------------------------------------------------- -------------------
    |     |          |            |                            |                                             |         |         |
  Table  Comma     Symbols      Space                String/Num/Bool/Time                                  Space   Timestamp   New Line Character
```

To build this message in Python with the appropriate escaped characters, we
would use something like the following example:

```python title="Encoding an ILP message in Python"
ilp_line = (
  "spot_trade" +                    # Table Name

  # Symbols
  ",ticker=BTC\\\\USD" +            # Symbol column (value must not be in quotes)
  ",id=9876" +                      # Symbol column

  " " +                             # Space to separate symbols from other columns

  # Other column types
  "price=30" +                      # Double column
  ",lots=33i" +                     # Long column
  ",details=\"UTC \\\\ London\"" +  # String column (value must be in quotes)
  ",of=1638202821000000t" +         # Timestamp column in Epoch microseconds
  ",liquidity=f" +                  # Boolean column

  " " +                             # Space to separate designated timestamp

  # Designated timestamp
  "1638202821000000000" +           # Designated timestamp value in Epoch nanoseconds
  "\n")                             # Line break to finish the message
```

Note the **space** character after `id=9876` to separate symbols from other
columns as well as the **space** character after `liquidity=f` to separate the
designated timestamp value. Also note the importance of **quotes** around string
values.

Given the Python example above, QuestDB will create the table `spot_trade` with
column types, names and values as:

| Column Name | Type                 | Value               | ILP equivalent              |
| ----------- | -------------------- | ------------------- | --------------------------- |
| ticker      | SYMBOL               | BTC\USD             | `ticker=BTC\\\\USD`         |
| id          | SYMBOL               | 9876                | `id=9876`                   |
| price       | DOUBLE               | 30.0                | `price=30`                  |
| lots        | LONG                 | 33                  | `lots=33i`                  |
| details     | STRING               | UTC \ London        | `details="UTC \\\\ London"` |
| of          | TIMESTAMP            | 2021-11-29T16:20:21 | `of=1638202821000000t`      |
| liquidity   | BOOLEAN              | FALSE               | `liquidity=f`               |
| timestamp   | DESIGNATED TIMESTAMP | 2021-11-29T16:20:21 | `1638202821000000000`       |

:::info

- `DOUBLE` is the default type for numeric values with and without decimal
  points. To make a column `LONG`, add `i` at the end of the value as it is done
  in `lots=33i` above

- Designated timestamp is set in _nanoseconds_ from Epoch while all other
  timestamp values are set in _microseconds_ from Epoch. This is for
  compatibility with Influx and can be changed in the `server.conf` parameter
  `line.tcp.timestamp`

:::

To omit `symbol` types from tables completely, the comma and symbol values can
be skipped:

```shell title="Omitting symbol types in ILP messages"
spot_trade price=30,lots=33i,details="UTC \\ London",of=1638202821000000t,liqudity=f 1638202821000000000
```

If designated timestamp is not specified in the message, QuestDB will set the
timestamp of when it receives the message. The following is still valid message

```shell title="Omitting designated timestamp in ILP messages"
spot_trade price=30,lots=33i,details="UTC \\ London",of=1638202821000000t,liqudity=f
```

For details on the available data types in QuestDB, see the
[data types reference](/docs/reference/sql/datatypes/).

## Table schema

It is not necessary to create a table schema for messages passed via InfluxDB
line protocol. A table will be dynamically created if one does not exist. If
later new fields are introduced on the messages, the table is automatically
updated and the new column will be back-propagated with null values. New fields
can be added in both the symbol and columns sections of the message.

Note that if a string value is added in the columns section without quotes the
line will not be rejected, instead a symbol field will be created.

:::info

General hints for table and schema design can be found in the
[capacity planning documentation](/docs/operations/capacity-planning/#choosing-a-schema).

:::

When new tables are created by inserting records via InfluxDB line protocol, a
default [partitioning strategy](/docs/concept/partitions/) by `DAY` is applied.
This default can be overridden for both the TCP and UDP interfaces via
[server configuration](/docs/reference/configuration/):

```bash title="server.conf"
line.default.partition.by=MONTH
```

## Naming restrictions

Tag keys and field keys in InfluxDB line protocol messages equate to column
names. In QuestDB, column names cannot contain the following characters, and as
such, symbol and other column names must not contain any of the following
characters:

```text
.
?
,
:
\
/
\\
\0
)
(
_
+
*
~
%
```

## Processing invalid data

If QuestDB receives an invalid message, it will discard invalid lines and
produce an error message in the logs but there is no mechanism built-in to the
protocol to notify the sender.

Data may be discarded because of:

- missing new line characters
- an invalid data format such as unescaped special characters
- invalid column / table name characters
- schema mismatch with existing tables
- message size overflows input buffer
- system errors such as no space left on the disk

The following is tolerated by QuestDB:

- a column is specified twice or more on the same line, QuestDB will pick the
  first occurrence and ignore the rest
- missing columns, their value will be defaulted to `null`/`0.0`/`false`
  depending on the type of the column
- missing designated timestamp, the current server time will be used to generate
  the timestamp
- the timestamp is specified as a column instead of appending it to the end of
  the line
- timestamp appears as a column and also present at the end of the line, the
  value sent as a field will be used

## Automatic commit

InfluxDB line protocol does not commit data on single lines or when the sender
disconnects, but instead uses a number of rules to break incoming data into
commit batches. This results in data not being visible in `SELECT` queries
immediately after being received.

### TCP interface

The default behavior is to issue a commit on a table when the number of pending
rows exceeds a configured parameter `cairo.max.uncommitted.rows` for that table
or when the table stays inactive for a configurable interval, this property is
called `line.tcp.commit.timeout`. There is a maintenance job which frees up
resources assigned to inactive tables. This job will commit any pending rows
before freeing up resources. The maintenance interval (30 seconds by default) is
configured in the `line.tcp.maintenance.job.interval` property. The commit
timeout should be set to a lower value (1 second by default) so a commit
strategy should not rely on the maintenance job.

Changing the `cairo.max.uncommitted.rows` parameter is described in more details
in per-table
[commit lag and max uncommitted rows](/docs/guides/out-of-order-commit-lag/#per-table-commit-lag-and-maximum-uncommitted-rows).
The commit timeout and maintenance job interval can also be configured in
`server.conf` using the `line.tcp.commit.timeout` and
`line.tcp.maintenance.job.interval` parameters, see more at the documentation
for [ILP TCP Commit Strategy](/docs/reference/api/influxdb/#commit-strategy).

### UDP interface

The UDP receiver issues a commit when the number of pending rows exceeds a
configured parameter `line.udp.commit.rate` or when it has idle time, i.e.
ingestion slows down or completely stops. The commit rate is not per table, it
set for the UDP interface. All lines ingested via UDP are considered when
checking against the commit rate. Commit issued to all tables received rows via
UDP at the same time.

The commit rate can be configured in `server.conf` using the
`line.udp.commit.rate` parameter, see more at the documentation for
[ILP UDP Commit Strategy](/docs/reference/api/influxdb/#commit-strategy-1).

## Differences with InfluxDB

In InfluxDB, table names, tag keys, and field keys cannot begin with an
underscore `_`. This restriction is **not enforced** in QuestDB, and therefore
the following InfluxDB line protocol message will produce a valid row in
QuestDB:

```bash
_sensor_data,_sensor=london_1 _value=12.4,string="sensor data, rev 1"
```

Spaces and commas do not require an escaping backslash in the field value for
`string`, but whitespace in tags (`symbol`) must be escaped:

```bash
_sensor_data,_sensor=berlin\ 2 _value=12.4,string="sensor data, rev 1"
```

InfluxDB does not support timestamp field values while QuestDB supports them as
a protocol extension.

### Strings

If field values are passed string types, the field values must be double-quoted.
Special characters are supported without escaping:

```bash
sensors,location=london temperature=22,software_version="A.B C-123"
sensors,location=london temperature=22,software_version="SV .#_123"
```

For string types in QuestDB, the storage is allocated as `32+n*16` bits where
`n` is the string length with a maximum value of `0x7fffffff`.

### Numeric

The default numerical type is a 64-bit `double` type. To store numeric values as
integers, a trailing `i` must follow the value. The following ILP message adds a
`long` type integer column for temperature:

```bash
sensors,location=london temperature=22,temp_int=22i
```

The `sensors` table would have the following row added:

| column      | type           | value  |
| ----------- | -------------- | ------ |
| location    | `string`       | london |
| temperature | `double`       | 22     |
| temp_int    | `long` integer | 22     |

QuestDB handles `long` types as a signed integer from `0x8000000000000000L` to
`0x7fffffffffffffffL`.

### Boolean

Boolean values can be passed in InfluxDB line protocol messages with any of the
following:

| Type    | Variants                   |
| ------- | -------------------------- |
| `TRUE`  | `t`, `T`, `true`, `True`   |
| `FALSE` | `f`, `F`, `false`, `False` |

The following example adds a `boolean` type column called `warning`:

```bash
sensors,location=london temperature=22,warning=false
```

### Timestamp

Timestamp fields are an ILP protocol extension available in QuestDB. To store
timestamp values, a trailing `t` must follow the UNIX timestamp value in
**microseconds**. The following example adds a `timestamp` type column called
`last_seen`:

```bash
sensors,location=london temperature=22,last_seen=1635414140500776t
```

For illustration, here's a Python snippet which demonstrates dynamic creation of
timestamp columns using the `t` suffix:

```python
import socket
from time import time_ns

now_ns = time_ns()
now_micros = time_ns() / 1000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect(("localhost", 9009))
    sock.sendall(('table_one last_seen=1635414140500776t %d\n' %(now_ns)).encode())
    sock.sendall(('table_two last_seen=%dt %d\n' %(now_micros, now_ns)).encode())
```

## QuestDB listener configuration

QuestDB can ingest ILP packets both over TCP and UDP with the following
defaults:

- InfluxDB TCP listener on port `9009` by default
- InfluxDB UDP listener on port `9009` by default

For more details on configuring how QuestDB ingests InfluxDB line protocol
messages, including setting alternative ports, refer to the following server
configuration references:

- [InfluxDB line protocol TCP configuration](/docs/reference/configuration/#influxdb-line-protocol-tcp)
- [InfluxDB line protocol UDP configuration](/docs/reference/configuration/#influxdb-line-protocol-udp)

## Examples

The following basic Python example demonstrates how to stream InfluxDB line
protocol messages to QuestDB over TCP. For more examples using different
languages, see the [insert data](/docs/develop/insert-data/) documentation.

```python
import time
import socket
# For UDP, change socket.SOCK_STREAM to socket.SOCK_DGRAM
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  sock.connect(('localhost', 9009))
  # Inserting a record with a timestamp from the Python time module
  sock.sendall(('trades,name=client_timestamp value=12.4 %d\n' %(time.time_ns())).encode())
  # Omitting the timestamp allows the server to assign one
  sock.sendall(('trades,name=server_timestamp value=12.4\n').encode())
  # Streams of readings must be newline-delimited
  sock.sendall(('trades,name=ilp_stream_1 value=12.4\ntrades,name=ilp_stream_2 value=11.4\n').encode())
  # Adding multiple symbol and field values
  sock.sendall(('trades,name=ilp_stream_2,version=TRS-2.1 hi=100,lo=20 16234259780000000\n').encode())

except socket.error as e:
  print("Got error: %s" % (e))

sock.close()
```

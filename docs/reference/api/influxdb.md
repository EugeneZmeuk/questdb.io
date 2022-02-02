---
title: InfluxDB line protocol
description: InfluxDB line protocol reference documentation.
---

QuestDB implements
[InfluxDB line protocol](https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/)
to ingest data. This enables you to use QuestDB as a replacement for InfluxDB
and other applications implementing this protocol. QuestDB can listen for line
protocol packets both over TCP and UDP. This page describes InfluxDB line
protocol APIs including practical hints for understanding and working with the
message format.

## Message format

InfluxDB line protocol messages have the following syntax in QuestDB (square
brackets represent an optional part):

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

### Data types

#### Strings

If field values are passed string types, the field values must be double-quoted.
Special characters are supported without escaping:

```shell
sensors,location=london temperature=22,software_version="A.B C-123"
sensors,location=london temperature=22,software_version="SV .#_123"
```

For string types in QuestDB, the storage is allocated as `32+n*16` bits where
`n` is the string length with a maximum value of `0x7fffffff`.

#### Symbols

QuestDB introduces a `symbol` type which is used for storing repetitive
string-like values internally as integers. For more information on this type,
refer to the [symbol documentation](/docs/concept/symbol/). The following ILP
message contains two `symbol` columns (`location` and `ticker`):

```shell
sensors,location=london,ticker=USD temperature=22,software_version="A.B C-123"
```

To omit `symbol` types from tables completely, the comma and symbol values can
be skipped:

```shell
sensors temperature=22,software_version="ABC-1234"
```

The `SYMBOL` type is deigned to store metadata-like enums which are used for
filtering data. It's strongly recommended to avoid sending values such as
`floats` in ILP messages as `SYMBOL`; this leads to unnecessary performance
impact due to indexing a large number of unique values on disk.

#### Numeric

The default numerical type is a 64-bit `double` type. To store numeric values as
integers, a trailing `i` must follow the value. The following ILP message adds a
`long` type integer column for temperature:

```shell
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

#### Boolean

Boolean values can be passed in InfluxDB line protocol messages with any of the
following:

| Type    | Variants                   |
| ------- | -------------------------- |
| `TRUE`  | `t`, `T`, `true`, `True`   |
| `FALSE` | `f`, `F`, `false`, `False` |

The following example adds a `boolean` type column called `warning`:

```shell
sensors,location=london temperature=22,warning=false
```

#### Timestamp

Designated timestamps are set in **nanoseconds** while all other timestamp
values are set in **microseconds**. This is for compatibility with InfluxDB and
can be changed in the `server.conf` parameter `line.tcp.timestamp`.

To store timestamp values, a trailing `t` must follow the UNIX timestamp value
in **microseconds**. The following example adds a `timestamp` type column called
`last_seen`:

```shell
sensors,location=london last_seen=1635414140500776t,temperature=22 1638202821000000000
```

If a designated timestamp is not specified in the message, QuestDB will set the
timestamp of when it receives the message. The following is still valid message

```shell
sensors,location=london last_seen=1635414140500776t,temperature=22
```

### Naming restrictions

In QuestDB, column names cannot contain the following characters, and as such,
symbol and other column names must not contain any of the following characters:

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

### Table schema

A table will be dynamically created if one does not exist using the schema
interpreted from the incoming messages. If later new fields are introduced on
the messages, the table is automatically updated and the new column will be
back-propagated with null values. New fields can be added in both the symbol and
columns sections of the message. Hints for schema design are described in the
[capacity planning section](/#capacity-planning).

When new tables are created by inserting records via InfluxDB line protocol, a
default [partitioning strategy](/docs/concept/partitions/) by `DAY` is applied.
This default can be overridden for both the TCP and UDP interfaces via
[server configuration](/docs/reference/configuration/):

```shell title="server.conf"
line.default.partition.by=MONTH
```

### Malformed input

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

### Differences with InfluxDB

In InfluxDB, table names, tag keys, and field keys cannot begin with an
underscore `_`. This restriction is **not enforced** in QuestDB, and therefore
the following InfluxDB line protocol message will produce a valid row in
QuestDB:

```shell
_sensor_data,_sensor=london_1 _value=12.4,string="sensor data, rev 1"
```

Spaces and commas do not require an escaping backslash in the field value for
`string`, but whitespace in tags (`symbol`) must be escaped:

```shell
_sensor_data,_sensor=berlin\ 2 _value=12.4,string="sensor data, rev 1"
```

### Constructing messages

This section describes how InfluxDB line protocol (ILP) will be parsed in
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

## ILP over TCP

The TCP receiver can handle both single and multi-row write requests. It is
fully multi-threaded and customizable. It can work from the common worker pool
or out of dedicated threads. A load balancing mechanism dynamically assigns work
between the threads.

By default, QuestDB listens to line protocol packets over TCP on `0.0.0.0:9009`.
If you are running QuestDB with Docker, you will need to publish the port `9009`
using `-p 9009:9009`.

The TCP receiver can be customized using
[configuration settings](/docs/reference/configuration/#influxdb-line-protocol-tcp)
to specify the tread pool, buffer and queue sizes, receiver IP address and port,
load balancing etc.

### Authentication

Although the original protocol does not support it, we have added authentication
over TCP. This works by using an
[elliptic curve P-256](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)
JSON Web Token (JWT) to sign a server challenge. Details of authentication over
ILP can be found in the
[authentication documentation](/docs/develop/authenticate/)

### Load balancing

A load balancing job reassigns work between threads in order to relieve the
busiest threads and maintain high ingestion speed. It can be triggered in two
ways.

- After a certain number of updates per table
- After a certain amount of time has passed

Once either is met, QuestDB will calculate a load ratio as the number of writes
by the busiest thread divided by the number of writes in the least busy thread.
If this ratio is above the threshold, the table with the least writes in the
busiest worker thread will be reassigned to the least busy worker thread.

![InfluxDB line protocol load balancing diagram](/img/docs/diagrams/influxLineProtocolTCPLoadBalancing.svg)

### TCP commit strategy

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

### Examples

Examples of sending data using ILP over TCP can be found here:

- [Insert data](/docs/develop/insert-data/#influxdb-line-protocol)
- [Authentication](/docs/develop/authenticate/)

## ILP over UDP

The UDP receiver can handle both single and multi row write requests. It is
currently single-threaded, and performs both network IO and write jobs out of
one thread. The UDP worker thread can work either on its own thread or use the
common thread pool. It supports both multicast and unicast.

By default, QuestDB listens for `multicast` line protocol packets over UDP on
`232.1.2.3:9009`. If you are running QuestDB with Docker, you will need to
publish the port `9009` using `-p 9009:9009` and publish multicast packets with
TTL of at least 2.

The UDP receiver can be customized using
[configuration settings](/docs/reference/configuration/#influxdb-line-protocol-udp)
to configure the IP address and port the receiver binds to, commit rates, buffer
size, whether it should run on a separate thread, set QuestDB to listen for
`unicast` etc.

### UDP commit strategy

The UDP receiver issues a commit when the number of pending rows exceeds a
configured parameter `line.udp.commit.rate` or when it has idle time, i.e.
ingestion slows down or completely stops. The commit rate is not per table, it
set for the UDP interface. All lines ingested via UDP are considered when
checking against the commit rate. Commit issued to all tables received rows via
UDP at the same time.

The commit rate can be configured in `server.conf` using the
`line.udp.commit.rate` parameter, see more at the documentation for
[ILP UDP Commit Strategy](/docs/reference/api/influxdb/#commit-strategy-1).

### Examples

Find an example of how to use this in the
[InfluxDB sender library section](/docs/reference/api/java-embedded/#influxdb-sender-library).

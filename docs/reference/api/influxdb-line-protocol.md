---
title: InfluxDB Line Protocol
description: InfluxDB line protocol reference documentation.
---

QuestDB implements the
[InfluxDB line protocol](https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/)
to ingest data. This enables you to use QuestDB as a drop-in replacement for
InfluxDB and others implementing the protocol. QuestDB can listen for line
protocol packets both over [TCP](#tcp-receiver) and [UDP](#udp-receiver).

## Usage

### Syntax

```shell
table_name,symbolset columnset timestamp
```

| Element      | Definition                                                                                |
|--------------|-------------------------------------------------------------------------------------------|
| `table_name` | Name of the table where QuestDB will write data.                                          |
| `symbolset`     | A set of `name=value` pairs separated by commas that will be parsed as symbol columns     |
| `columnset`   | A set of `name=value` pairs separated by commas that will be parsed as non-symbol columns |
| `timestamp`  | UNIX timestamp. By default in nanoseconds. Can be changed in the configuration            |

`name` in `name=value` pair always corresponds to `column name` in the table

### Behaviour

- When the `table_name` does not correspond to an existing table, QuestDB will
  create the table on the fly using the name provided. Column types will be
  automatically recognized and assigned based on the data.
- The `timestamp` column is automatically created as
  [designated timestamp](/docs/concept/designated-timestamp/) with the
  [partition strategy](/docs/concept/partitions/) set to `NONE`. If you would
  like to define a partition strategy, you should
  [CREATE](/docs/reference/sql/create-table/) the table beforehand.
- When the timestamp is empty, QuestDB will use the server timestamp.

### Generic example

Let's assume the following data:

| timestamp           | city    | temperature | humidity | make      |
|---------------------|---------|-------------|----------|-----------|
| 1465839830100400000 | London  | 23.5        | 0.343    | Omron     |
| 1465839830100600000 | Bristol | 23.2        | 0.443    | Honeywell |
| 1465839830100700000 | London  | 23.6        | 0.358    | Omron     |

The line protocol syntax for that table is:

```shell
readings,city=London,make=Omron temperature=23.5,humidity=0.343 1465839830100400000
readings,city=Bristol,make=Honeywell temperature=23.2,humidity=0.443 1465839830100600000
readings,city=London,make=Omron temperature=23.6,humidity=0.348 1465839830100700000
```

### Irregularly-structured data

InfluxDB line protocol makes it possible to send data under different shapes.
Each new entry may contain certain tags or fields, and others not. QuestDB supports
on-the-fly data structure changes with minimal overhead. Whilst the example
just above highlights structured data, it is possible for InfluxDB line protocol
users to send data as follows:

```shell
readings,city=London temperature=23.2 1465839830100400000
readings,city=London temperature=23.6 1465839830100700000
readings,make=Honeywell temperature=23.2,humidity=0.443 1465839830100800000
```

This would result in the following table:

| timestamp           | city   | temperature | humidity | make      |
|---------------------|--------|-------------|----------|-----------|
| 1465839830100400000 | London | 23.5        | NULL     | NULL      |
| 1465839830100700000 | London | 23.6        | NULL     | NULL      |
| 1465839830100800000 | NULL   | 23.2        | 0.358    | Honeywell |

:::tip

Whilst we offer this function for flexibility, we recommend that users try to
minimise structural changes to maintain operational simplicity.

:::

### Duplicate column names

If line contains duplicate column names, the value stored in the table will be that from the first `name=value`
pair on each line. For example:

```shell
trade,ticker=USD price=30,price=60 1638202821000000000
```

Price `30` is ignored, `60` is stored.

### Name restrictions

Both table name and column names are allowed to have spaces ` `. These spaces have to be escaped with `\`. For example
both of these are valid lines.

```shell
trade\ table,ticker=USD price=30,details="Latest price" 1638202821000000000
```

```shell
trade,symbol\ ticker=USD price=30,details="Latest price" 1638202821000000000
```

Table name and columns name must not contain any of the forbidden characters:
`.`, `?`,`,`,`:`,`\`,`/`,`\0`,`)`,`(`,`+`,`*`,`~`,`%` and `-`


### Symbolset

Area of the message that contains comma-separated set of `name=value` pairs for symbol columns.
For example in a message like this:

```shell
trade,ticker=BTCUSD,venue=coinbase price=30,price=60 1638202821000000000
```

`symbolset` is `ticker=BTCUSD,venue=coinbase`. Please note the mandatory space between `symbolset` and `columnset`. Naming rules
for columns are subject to [duplicate rules](#duplicate-column-names) and [name restrictions](#name-restrictions).

### Symbolset values

`symbolset` values are always interpreted as [SYMBOL](/docs/concept/symbol/). Parser takes values literally so please beware of
accidentally using high cardinality types such as `9092i` or `1.245667`. This will result in a significant
performance loss due to bulging mapping tables.

`symbolset` values are not quoted. They are allowed to have special characters, such as ` ` (space), `,` and `\`,
which must be escaped. Example:

```shell
trade,ticker=BTC\\USD\,All,venue=coin\ base price=30 1638202821000000000
```



Whenever `symbolset` column does not exist, it will be added on-the-fly with type `SYMBOL`. On other hand when
column does exist, it is expected to be of `SYMBOL` type, otherwise line is rejected.

### Columnset

Area of the message that contains comma-separated set of `name=value` pairs for non-symbol columns.
For example in a message like this:

```shell
trade,ticker=BTCUSD priceLow=30,priceHigh=60 1638202821000000000
```

`columnset` is `priceLow=30,priceHigh=60`. Naming rules
for columns are subject to [duplicate rules](#duplicate-column-names) and [name restrictions](#name-restrictions).

### Columnset values

`columnset` supports several values types, which are used to either derive type of new column or mapping strategy when
column already exists. These types are limited by existing Influx Line Protocol specification. Wider QuestDB type system is
available by creating table via SQL upfront. The following are supported value types:

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

<Tabs defaultValue="integer" values={[
{ label: "Integer", value: "integer" },
{ label: "Long256", value: "long256" },
{ label: "Float", value: "float" },
{ label: "Boolean", value: "boolean" },
{ label: "String", value: "string" },
{ label: "Timestamp", value: "timestamp" },
]}>


<TabItem value="integer">

64-bit singed integer values, which correspond to QuestDB type `long`. The values are required to have `i` suffix, for
example.

```shell
temps,device=cpu,location=south value=96i 1638202821000000000
```

Sometimes integer values are small and do not warrant 64 bits to store them. To reduce storage for such values
it is possible to create table upfront with smaller type, for example:

```sql
create table temps(device symbol, location symbol, value short)
```

The line above will be accepted and `96i` will be cast to `short`.

:::info

Type casts that cause data loss will cause entire line to be rejected.

:::

##### Cast table

The following `cast` operations are supported when existing table column type is not `long`:

|           | `byte` | `short` | `int` | `long`   | `float` | `double` | `date` | `timestamp` |
|-----------|--------|---------|-------|----------|---------|----------|--------|-------------|
| `integer` | cast   | cast    | cast  | `native` | cast    | cast     | cast   | cast        |


</TabItem>


<TabItem value="long256">


Custom type, which correspond to QuestDB type `long256`. The values are hex encoded 256-bit integer values with `i`
suffix. For example:

```shell
temps,device=cpu,location=south value=0x123a4i 1638202821000000000
```

When column does not exist, it will be created with type `long256`. Values overflowing 256-bit integer will cause the
entire line to be rejected.

`long256` cannot be cast to anything else.

</TabItem>


<TabItem value="float">


These values correspond to QuestDB type `double`. They actually do not have any suffix, which might lead to a confusion.
For example:

```shell
trade,ticker=BTCUSD price=30 1638202821000000000
```

`price` value will be stored as `double` even though it does not look like a conventional double value would.

##### Cast table

The following `cast` operations are supported when existing table column type is not `double`:

|         | `float` | `double` |
|---------|---------|----------|
| `float` | cast    | `native` |


</TabItem>


<TabItem value="boolean">


These value correspond to QuestDB type `boolean`. In InfluxDB Line Protocol `boolean` values can be represented in
any of the following ways:

| Actual value | Single char lowercase | Single char uppercase | Full lowercase | Full camelcase | Full uppercase |
|--------------|-----------------------|-----------------------|----------------|----------------|----------------|
| `true`       | `t`                   | `T`                   | `true`         | `True`         | `TRUE`         |
| `false`      | `f`                   | `F`                   | `false`        | `False`        | `FALSE`        |

Example:

```shell
sensors,location=south warning=false
```

##### Cast table

The following `cast` operations are supported when existing table column type is not `boolean`:

|           | `boolean` | `byte` | `short` | `int` | `float` | `long` | `double` |
|-----------|-----------|--------|---------|-------|---------|--------|----------|
| `boolean` | `native`  | cast   | cast    | cast  | cast    | cast   | cast     |

</TabItem>


<TabItem value="string">


These value correspond to QuestDB type `string`. They must be enclosed in quotes. Quotation marks `"` in values must be
escaped using `\`. For example:

```shell
trade,ticker=BTCUSD description="this is a \"rare\" value",user="John" 1638202821000000000
```

The result:

| timestamp           | ticker | description            | user  |
|---------------------|--------|------------------------|-------|
| 1638202821000000000 | BTCUSD | this is a "rare" value | John  |

:::note
String values must be UTF8 encoded before sending.
:::

##### Cast table

The following `cast` operations are supported when existing table column type is not `string`:

|          | `char` | `string` | `geohash` | `symbol` |
|----------|--------|----------|-----------|----------|
| `string` | cast   | `native` | cast      | no       |

##### Casting to char

String value can be cast to `char` type if its length is less than 2 characters. The following example are valid
lines:

```shell
trade,ticker=BTCUSD status="A" 1638202821000000000
trade,ticker=BTCUSD status="" 1638202821000000001
```

The result:

| timestamp           | ticker | status |
|---------------------|--------|--------|
| 1638202821000000000 | BTCUSD | A      |
| 1638202821000000001 | BTCUSD | `null` |

Casting strings with 2 or more characters to `char` will cause entire line to be rejected.

##### Casting to GeoHash

String value can be cast to `GeoHah` type when destination column exists and is of a `GEOHASH` type already. Do make
sure that column is created upfront. Otherwise, ILP will create `STRING` column regardless of the value.

Example:

Upcasting is an attempt to store higher resolution `geohash` in a lower resolution column. Let's create
table before sending ILP message. Our `geohash` column has resolution of 4 bits.

```sql
create table tracking (geohash GEOHASH(4b), ts timestamp) timestamp(ts) partition by hour;
```

Send message including `16c` `geohash` value:

```shell
tracking,obj=VLCC\ STEPHANIE gh="9v1s8hm7wpkssv1h" 1000000000
```

The result. `geohash` value has been truncated to size of the column.

| ts                          | gh   |
|-----------------------------|------|
| 1970-01-01T00:00:01.000000Z | 0100 |

Sending empty string value will insert `null` into `geohash` column of any size:

```shell
tracking,obj=VLCC\ STEPHANIE gh="" 2000000000
```

| ts                          | gh     |
|-----------------------------|--------|
| 1970-01-01T00:00:01.000000Z | `null` |

:::info

Downcast of `geohash` value, which is inserting of lower resolution values into higher resolution column, will cause the entire line to be rejected.

:::

</TabItem>


<TabItem value="timestamp">

These value correspond to QuestDB type `timestamp`. Timestamp values are epoch `microseconds` suffixed with `t`. 
In this example we're populating _non-designated_ timestamp field `ts1`:

```shell
tracking,obj=VLCC\ STEPHANIE gh="9v1s8hm7wpkssv1h",ts1=10000t 1000000000
```

It is possible to populate _designated_ timestamp using `columnset`, although this is not recommended. Let's see
how this works in practice. Assuming table:

```sql
create table (loc symbol, ts timestamp) timestamp(ts) partition by day
```

When we send:

```shell title="Sending mixed desginated timestamp values"
tracking,loc=north ts=2000000000t 1000000000
tracking,loc=south ts=3000000000t
```

The result in `columnset` value always wins:


| loc   | ts         |
|-------|------------|
| north | 2000000000 |
| south | 3000000000 |


</TabItem>


</Tabs>

### GEOHASH values

`geohash` values can be passed via `columnset` as `string`. Please refer to [`columnset` values](#columnset-values)

### Designated timestamp

Designated timestamp is trailing part of ILP message. It is optional. When present, designated timestamp is Epoch 
`nanoseconds`. When timestamp is omitted, server will timestamp each message using system's clock. 

:::warning
While `columnset` `timestamp` type units are `microseconds`, the designated timestamp units are `nanoseconds`.  These
are default units, which can be overridden via `line.tcp.timestamp`
:::

```shell title="Example of ILP message with desginated timestamp value"
tracking,loc=north val=200i 1000000000
```

```shell title="Example of ILP message sans timestamp"
tracking,loc=north val=200i
```

## TCP receiver

The TCP receiver is a high-throughput streaming-in service for QuestDB. Here are some key facts about the service:

- ingestion only, there is no query capability
- accepts plain text input in a form on InfluxDB Line Protocol
- implicit transactions, batching
- supports automatic table and column creation
- multi-threaded, non-blocking
- supports authentication
- encryption is via optional reverse-proxy

### Overview

By default, QuestDB listens over TCP on `0.0.0.0:9009`. The receiver consists of two thread pools, which is an
important design feature to be aware of to configure the receiver for maximum performance. The `io worker` threads are
responsible for parsing text input. The `writer` threads are responsible for persisting data in tables. We will talk
more about these in [capacity planning](#capacity-planning) section.

### Authentication

Although the original protocol does not support it, we have added authentication
over TCP. This works by using an
[elliptic curve P-256](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)
JSON Web Token (JWT) to sign a server challenge. Details of authentication over
ILP can be found in the
[authentication documentation](/docs/develop/authenticate/)

### Insert data

Follow this link for [examples of sending data using ILP over TCP](/docs/develop/insert-data/#influxdb-line-protocol)

### Error handling

It is recommended that sending applications reuse TCP connections. If QuestDB receives an invalid message, 
it will discard invalid lines, produce an error message in the logs and forcibly _disconnect_ the
sender to prevent further data loss.

Data may be discarded because of:

- missing new line characters at the end of messages
- an invalid data format such as unescaped special characters
- invalid column / table name characters
- schema mismatch with existing tables
- message size overflows on the input buffer
- system errors such as no space left on the disk

Detecting malformed input can be achieved through QuestDB logs by searching for
`LineTcpMeasurementScheduler` and `LineTcpConnectionContext`, for example:

```bash
2022-02-03T11:01:51.007235Z I i.q.c.l.t.LineTcpMeasurementScheduler could not create table [tableName=trades, ex=`column name contains invalid characters [colName=trade_%]`, errno=0]
```

The following input is tolerated by QuestDB:

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

### Commit strategy

ILP transactions are implicit; the protocol is built to stream data at a high
rate of speed and to support batching. There are three ways data is committed
and becomes visible or partially visible. The commit method is chosen based on
whichever occurs first.

#### Row-based commit

Each table has a max uncommitted rows metadata property. The ILP server will
issue a commit when the number of uncommitted rows reaches this value. The table
commit implementation retains data under max uncommitted rows or newer than the
commit lag (whichever is smallest) as uncommitted data. Committed data is
visible to table readers.

This parameter is set using in the following server configuration property:

```shell title="Commit when this number of uncommitted records is reached"
cairo.max.uncommitted.rows=1000
```

#### Idle table timeout

When there is no data ingested in the table after a set period, the ingested
uncommitted data is fully committed, and table data becomes fully visible. The
timeout value is server-global and can be set via the following server
configuration property:

```shell title="Minimum amount of idle time (millis) before table writer is released"
line.tcp.min.idle.ms.before.writer.release=30000
```

#### Interval-based commit

A table's commit lag metadata property determines how much uncommitted data will
need to remain uncommitted for performance reasons. This lag value is measured
in time units from the table's data. Data older than the lag value will be
committed and become visible. ILP derives the commit interval as a function of
the commit lag value for each table. The difference is that the commit interval
is a wall clock.

To ease understanding of how time interval interacts with commit lag , let's
look at how real-time data stream will become visible. The wall clock is roughly
aligned with time in the data stream in real-time data. Let's assume that table
has a commit lag value of 60 seconds and a commit interval of 20 seconds. After
the first 60 seconds of ingestion, ILP will attempt to commit 3 times. After
each attempt, there will be no data visible to the application. This is because
all the data will fall within the lag interval.

On the 4th commit, which would occur, 80 seconds after the data stream begins,
the application will see the first 20 seconds of the data, with the remaining 60
seconds uncommitted. Each subsequent commit will reveal more data in 20-second
increments. It should be noted that both commit lag and commit interval should
be carefully chosen with both data visibility and ingestion performance in mind.

This parameter is set using in the following server configuration property:

```shell
# commit uncommitted rows when this timer is reached
line.tcp.maintenance.job.interval=1000
```

### Capacity planning

TCP receiver makes use of 3 logical thread pools:

- io worker pool - `line.tcp.io.worker.count`, threads responsible for handling incoming TCP connections 
- writer pool - `line.tcp.writer.worker.count`, threads responsible for table writes
- shared pool - `shared.worker.count`, threads responsible for handling O3 data

Depending on the number of concurrent TCP connections `io worker pool` size might need to be adjusted. The
ideal ratio is `1:1` - a thread per connection. In less busy environments it is possible for single `io worker`
thread to handle multiple connections simultaneously. We recommend starting with conservative ration, measure and
increase ration up to `1:1`. More threads than connections will be wasting server CPU.

Another consideration is the number of tables updates concurrently. `writer pool` should be tuned to increase
concurrency. `writer` threads can also handle multiple tables concurrently. `1:1` ratio is the maximum required ratio
between `writer` threads and tables.

:::note
Sending updates for multiple tables from single TCP connection might be inefficient. Configure `writer pool` size to 1 for
optimal performance.
:::

When ingesting data out of order (O3) `shared pool` accelerates O3 tasks. It is also responsible for SQL execution.
`shared pool` size should be set to use the remaining available CPU cores.

### Configuration reference

The TCP receiver configuration can be completely customized using
[configuration keys](/docs/reference/configuration/#influxdb-line-protocol).
You can use this to configure the tread pool, buffer and queue sizes, receiver
IP address and port, load balancing etc.

## UDP receiver

The UDP receiver can handle both single and multi row write requests. It is
currently single-threaded, and performs both network IO and write jobs out of
one thread. The UDP worker thread can work either on its own thread or use the
common thread pool. It supports both multicast and unicast.

### Overview

By default, QuestDB listens for `multicast` line protocol packets over UDP on
`232.1.2.3:9009`. If you are running QuestDB with Docker, you will need to
publish the port `9009` using `-p 9009:9009` and publish multicast packets with
TTL of at least 2. This port can be customized, and you can also configure
QuestDB to listen for `unicast`.

### Commit strategy

Uncommitted rows are committed either:

- after receiving a number of continuous messages equal to
  `line.udp.commit.rate` or
- when UDP receiver has idle time, i.e. ingestion slows down or completely
  stops.

### Configuration

The UDP receiver configuration can be completely customized using
[configuration keys](/docs/reference/configuration/#udp-specific-settings).
You can use this to configure the IP address and port the receiver binds to,
commit rates, buffer size, whether it should run on a separate thread etc.

### Examples

Find an example of how to use this in the
[InfluxDB sender library section](/docs/reference/api/java-embedded/#influxdb-sender-library).

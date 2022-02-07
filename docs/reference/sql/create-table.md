---
title: CREATE TABLE reference
sidebar_label: CREATE TABLE
description: CREATE TABLE SQL keywords reference documentation.
---

To create a new table in the database, the `CREATE TABLE` keywords followed by
column definitions are used:

```questdb-sql
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP, s STRING)
  timestamp(ts);
```

:::info

Checking table metadata can be done via the `tables()` and `table_columns()`
functions which are described in the
[meta functions](/docs/reference/function/meta/) documentation page.

:::

## IF NOT EXISTS

An optional `IF NOT EXISTS` clause may be added directly after the
`CREATE TABLE` keywords to indicate that a new table should be created if one
with the desired table name does not already exist.

```questdb-sql
CREATE TABLE IF NOT EXISTS test_table(price DOUBLE, ts TIMESTAMP) timestamp(ts);
```

## Table name

Internally the table name is used as a directory name on the file system. It can
contain both ASCII and Unicode characters. The table name **must be unique** and
an error is returned if a table already exists with the requested name. Table
names containing spaces or period `.` character must be enclosed in **double
quotes**, for example:

```questdb-sql
CREATE TABLE "example out of.space" (a INT);
INSERT INTO "example out of.space" values (1);
```

## Column name

As with table names, the column name is used for file names internally. Although
it does support both ASCII and Unicode characters, character restrictions
specific to the file system still apply. Tables may have up to **2,147,483,647**
columns.

:::note

Column names must be unique within each table and **must not** contain a period
`.` character.

:::

## Type definition

When specifying a column, a name and
[type definition](/docs/reference/sql/datatypes/) must be provided. The `symbol`
type may have additional optional parameters applied.

![Flow chart showing the syntax of the different column types](/img/docs/diagrams/columnTypeDef.svg)

### Symbols

Optional keywords and parameters may follow the `symbol` type which allow for
further optimization on the handling of this type. For more information on the
benefits of using this type, see the [symbol](/docs/concept/symbol/) overview.

#### Symbol capacity

`CAPACITY` is an optional keyword used when defining a symbol type on table
creation to indicate how many distinct values this column is expected to have.
When `distinctValueEstimate` is not explicitly specified, a default value of
`cairo.default.symbol.capacity` is used.

`distinctValueEstimate` - the value used to size data structures for
[symbols](/docs/concept/symbol/). These data structures will resize themselves
when necessary to allow QuestDB to function correctly. Underestimating the
symbol value count may result in drop of performance whereas over-estimating may
result in higher disk space and memory consumption.

```questdb-sql
CREATE TABLE my_table(symb SYMBOL capacity 128, price DOUBLE, ts TIMESTAMP),
  index (symb) timestamp(ts);
```

The symbol capacity is not to be confused with **index capacity** described in
[column indexes](#column-indexes) below.

```questdb-sql
CREATE TABLE my_table
  (symb SYMBOL capacity 128 nocache index capacity 256, price DOUBLE, ts TIMESTAMP)
timestamp(ts);
```

#### Symbol caching

`CACHE | NOCACHE` is used to specify whether a symbol should be cached. `CACHE`
means that QuestDB will use a Java Heap-based Map to resolve symbol values and
keys. When a column has a large number of distinct symbol values (over 100,000,
for example), the heap impact might be significant and may cause OutOfMemory
errors, depending on the heap size.

To avoid Java Heap impact, `NOCACHE` leverages an off-heap structure which can
deal with larger value counts but is slower. The default option for `symbol`
types is `CACHE`.

```questdb-sql
CREATE TABLE my_table
  (symb SYMBOL capacity 128 nocache, price DOUBLE, ts TIMESTAMP)
timestamp(ts);
```

### Casting types

`castDef` - casts the type of a specific column. `columnRef` must reference
existing column in the `selectSql`

![Flow chart showing the syntax of the cast function](/img/docs/diagrams/castDef.svg)

```questdb-sql
CREATE TABLE test AS (SELECT cast(x as DOUBLE) x FROM long_sequence(10));
```

## Column indexes

Index definitions (`indexDef`) are used to create an
[index](/docs/concept/indexes/) for a table column. The referenced table column
must be of type `SYMBOL`.

![Flow chart showing the syntax of the index function](/img/docs/diagrams/indexDef.svg)

```questdb-sql
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP),
  index (symb) timestamp(ts);
```

An index capacity may be provided for the index using and references a
`valueBlockSize`

![Flow chart showing the syntax of the CAPACITY keyword](/img/docs/diagrams/indexCapacityDef.svg)

```questdb-sql
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP),
  index (symb capacity 128) timestamp(ts);
-- equivalent to
CREATE TABLE my_table(symb SYMBOL index capacity 128, price DOUBLE, ts TIMESTAMP),
  timestamp(ts);
```

`valueBlockSize` is an index storage parameter that specifies how many row IDs
to store in a single storage block on disk. This value is optional and will
default to the value of the `cairo.index.value.block.size`
[configuration key](/docs/reference/configuration/). Fewer blocks used to store
row IDs achieves better performance. At the same time over-sizing
`valueBlockSize` will result in higher than necessary disk space usage.

Consider an example table with 200 unique stock symbols and 1,000,000,000
records over time. The index will have to store 1,000,000,000 / 200 row IDs for
each symbol, i.e. 5,000,000 per symbol.

- If `valueBlockSize` is 1,048,576 in this case, QuestDB will use 5 blocks to
  store the row IDs
- If `valueBlockSize` is 1,024 in this case, the block count will be 4,883

## Designated timestamp

The timestamp function allows for specifying which column (which must be of
`timestamp` type) should be a designated timestamp for the table. For more
information, see the [designated timestamp](/docs/concept/designated-timestamp/)
reference.

:::caution

The designated timestamp column **cannot be changed** after the table has been
created.

:::

## Partitioning

`PARTITION BY` allows for specifying the
[partitioning strategy](/docs/concept/partitions/) for the table. The default
partitioning strategy is `NONE` and tables can be partitioned by one of the
following:

- `YEAR`
- `MONTH`
- `DAY`
- `HOUR`

:::caution

The partitioning strategy **cannot be changed** after the table has been
created.

:::

## WITH table parameters

![Flow chart showing the syntax of keyword to specify WITH table commit parameters](/img/docs/diagrams/createTableWithCommitParam.svg)

Table parameters which influence how often commits of out-of-order data occur
may be set during table creation using the `WITH` keyword. The following two
parameters may be applied:

- `maxUncommittedRows` - equivalent to `cairo.max.uncommitted.rows`
- `commitLag` - equivalent to `cairo.commit.lag` expects a value with a modifier
  to specify the unit of time for the value:

  | unit | description  |
  | ---- | ------------ |
  | us   | microseconds |
  | s    | seconds      |
  | m    | minutes      |
  | h    | hours        |
  | d    | days         |

For more information on commit lag and the maximum uncommitted rows, see the
guide for [out-of-order commits](/docs/guides/out-of-order-commit-lag/).

## Create table syntax diagram

![Flow chart showing the syntax of the CREATE TABLE keyword](/img/docs/diagrams/createTable.svg)

## Examples

The following examples demonstrate creating tables from basic statements, and
introduce features such as partitioning and designated timestamps. For more
information on the concepts introduced to below, see

- [designated timestamp](/docs/concept/designated-timestamp/) reference on
  electing a timestamp column
- [partition](/docs/concept/partitions/) documentation which describes how
  partitions work in QuestDB
- [symbol](/docs/concept/symbol/) reference for using the `symbol` data type

This example will create a table without a designated timestamp and does not
have a partitioning strategy applied.

```questdb-sql title="Basic example"
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP, s STRING);
```

The same table can be created and a designated timestamp may be specified. New
records with timestamps which are out-of-order (O3) chronologically will be
ordered at the point of ingestion. Configuring how the system handles ingestion
of out-of-order records is done via
[commit lag](/docs/guides/out-of-order-commit-lag/) configuration.

```questdb-sql title="Adding a designated timestamp"
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP, s STRING)
  timestamp(ts);
```

```questdb-sql title="Adding a partitioning strategy by DAY"
CREATE TABLE my_table(symb SYMBOL, price DOUBLE, ts TIMESTAMP, s STRING)
  timestamp(ts)
PARTITION BY DAY;
```

```questdb-sql title="Adding parameters for symbol type"
CREATE TABLE
  my_table(symb SYMBOL capacity 256 nocache index capacity 1048576,
  price DOUBLE, ts TIMESTAMP, s STRING)
  timestamp(ts)
PARTITION BY DAY;
```

### CREATE TABLE AS

#### Cloning existing SQL structure

When SQL is `SELECT * FROM tab` or any arbitrary SQL result, the table data will
be copied with the corresponding structure.

```questdb-sql title="Create table as select"
CREATE TABLE x AS(
  SELECT
    rnd_int() a,
    rnd_double() b,
    rnd_symbol('ABB', 'CDD') c
  FROM
    long_sequence(100)
  WHERE false;
)
```

:::note

Notice the `where false` condition.

:::

```questdb-sql title="Clone an existing wide table and change type of cherry-picked columns"
CREATE TABLE x AS (SELECT * FROM table WHERE false),
  cast(price AS LONG),
  cast(instrument as SYMBOL INDEX);
```

Here we changed type of `price` (assuming it was `INT`) to `LONG` and changed
type of `sym` to [symbol](/docs/concept/symbol/) and created an
[index](/docs/concept/indexes/).

#### Create a new table using SQL structure and data

Let's assume we imported a text file into the table `taxi_trips_unordered` and
now we want to turn this data into time series through ordering trips by
`pickup_time`, assign dedicated timestamp and partition by month:

```questdb-sql title="Create table as select with data manipulation"
CREATE TABLE taxi_trips AS(
  SELECT * FROM taxi_trips_unordered ORDER BY pickup_time
) timestamp(pickup_time)
PARTITION BY MONTH;
```

### CREATE TABLE WITH parameters

Adding `WITH` to a create table statement allows for providing table-specific
configuration.

#### Specifying commit lag and maximum uncommitted rows

Let's assume we have out-of-order records arriving at a table `my_table`. If we
know beforehand that the maximum _lag_ of later records is likely to be 240
seconds, we can schedule sorting and commits of out-of-order data to occur
within this time boundary. The _lag_ configuration can be combined with the
maximum uncommitted rows so that a commit will occur based on expected row
count, or the _lag_ boundary is met:

```questdb-sql
CREATE TABLE my_table (ts TIMESTAMP) timestamp(ts)
PARTITION BY DAY WITH maxUncommittedRows=250000, commitLag = 240s
```

For more information on out-of-order lag and uncommitted rows, see the
documentation for
[out-of-order data commits](/docs/guides/out-of-order-commit-lag/).

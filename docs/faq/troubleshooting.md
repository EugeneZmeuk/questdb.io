---
title: Troubleshooting
description: Troubleshooting guide for QuestDB.
---

The following document contains common hardware and software configuration
issues met when running QuestDB, as well as solutions to them.

## Why is ILP data not immediately available?

InfluxDB line protocol (ILP) does not commit data on single lines or when the
sender disconnects, but instead uses a number of rules to break incoming data
into commit batches. This results in data not being visible in `SELECT` queries
immediately after being received. Refer to
[InfluxDB line protocol](/docs/guides/influxdb-line-protocol/#automatic-commit)
guide to understand these rules.

## How do I update or delete a row?

`UPDATE` and `DELETE` statements will be included in the next QuestDB versions,
but for now, they are not supported yet. There are some ways to delete rows:

- In case if you want to delete all older rows, you could drop the whole
  partition with the `ALTER TABLE DROP PARTITION`
  [syntax](/docs/reference/sql/alter-table-drop-partition)
- Write a copy of the table without the rows you want to delete, drop the table
  and then rename the new table to the one you wanted.

Here is an example of the second approach:

```questdb-sql
CREATE TABLE mytable_copy AS (
    SELECT * FROM mytable WHERE column_value != 42
) TIMESTAMP(ts) PARTITION BY DAY;

DROP TABLE mytable;
RENAME table mytable_copy TO mytable;
```

A similar approach with a table copy may be used to in order to update table
rows.

## Why do I get `table busy` error messages when inserting data over PostgreSQL wire protocol?

You may get `table busy [reason=insert]` or similar errors when running `INSERT`
statements concurrently on the same table. This means that the table is locked
by inserts issued from another SQL connection or other client protocols for data
import, like ILP over TCP or CSV over HTTP. To reduce the chances of getting
this error, try using auto-commit to keep the transaction as short as possible.

We're also considering adding automatic insert retries on the database side, but
for now, it is safe to handle this error on the client side and retry the
insert.

## Why do I see `could not open read-write` messages when creating a table or inserting rows?

Log messages may appear like the following:

```
2022-02-01T13:40:11.336011Z I i.q.c.l.t.LineTcpMeasurementScheduler could not create table [tableName=cpu, ex=could not open read-write
...
io.questdb.cairo.CairoException: [24] could not open read-only [file=/root/.questdb/db/cpu/service.k]
```

The machine may have insufficient limits for the maximum number of open files.
Try checking the `ulimit` value on your machine. Refer to
[capacity planning](/docs/operations/capacity-planning/#maximum-open-files) page
for more details.

## Why do I see `errno=12` mmap messages in the server logs?

Log messages may appear like the following:

```
2022-02-01T13:40:10.636014Z E i.q.c.l.t.LineTcpConnectionContext [8655] could not process line data [table=test_table, msg=could not mmap  [size=248, offset=0, fd=1766, memUsed=314809894008, fileLen=8192], errno=12]
```

The machine may have insufficient limits of memory map areas a process may have.
Try checking and increasing the `vm.max_map_count` value on your machine. Refer
to
[capacity planning](/docs/operations/capacity-planning/#max-virtual-memory-areas-limit)
page for more details.

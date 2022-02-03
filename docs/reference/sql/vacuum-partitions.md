---
title: VACUUM PARTITIONS
sidebar_label: VACUUM PARTITIONS
description: VACUUM PARTITIONS SQL keyword reference documentation
---

The `VACUUM PARTITIONS` command triggers partition version cleanup.

When a table is appended out of order, a new version of a partition can be
written to the disk. The old partition version directory is deleted once it is
not read by queries. In the event of file system errors, physical deletion of
old files can be interrupted and an outdated partition version is left behind
consuming the disk space.

The `VACUUM PARTITIONS` command starts a new scan over table partitions and
deletes unused partition versions. This command rarely has to be executed and
provides a manual mechanism to trigger a cleanup.

## Syntax

<!--- "VacuumQuery ::= 'VACUUM' 'PARTITIONS' tableName" -->

![Flow chart showing Vacuum Partition syntax](/img/docs/diagrams/vacuumPartitions.svg)

## Example

```questdb-sql
VACUUM PARTITIONS trades
```

---
title: Capacity planning
description:
  How to plan and configure system resources available to QuestDB to ensure that
  server operation continues uninterrupted.
---

Capacity planning should be considered as part of the requirements of deploying
QuestDB to forecast CPU, memory, network capacity, and a combination of these
elements, depending on the expected demands of the system. This page describes
configuring these system resources with example scenarios that align with both
edge cases and common setup configurations.

All the configuration settings referred to below except for OS settings are
configured in QuestDB by either a `server.conf` configuration file or as
environment variables. For more details on applying configuration settings in
QuestDB, refer to the [configuration](/docs/reference/configuration/) page.

## Storage and filesystem

The following sections describe aspects to be considered regarding the storage
of data and filesystem considerations.

:::caution

- QuestDB officially supports **EXT4** or **XTS** or any filesystem that
  supports [mmap](https://man7.org/linux/man-pages/man2/mmap.2.html).

- Users **can't use NFS or a similar distributed filesystem** directly with a
  QuestDB database.

:::

### Partitioning

When creating tables, a partitioning strategy is recommended in order to be able
to enforce a data retention policy to save disk space, and for optimizations on
the number of concurrent file reads performed by the system. For more
information on this topic, see the following resources:

- [partitions](/docs/concept/partitions/) page which provides a general overview
  of this concept
- [data retention](/docs/operations/data-retention/) guide provides further
  details on partitioning tables with examples on how to drop partitions by time
  range

**Records per partition**

The number of records per partition should factor into the partitioning strategy
(`YEAR`, `MONTH`, `DAY`, `HOUR`). Having too many records per partition or
having too few records per partition and having query operations across too many
partitions has the result of slower query times. A general guideline is that
roughly between 1 million and 100 million records is optimal per partition.

### Choosing a schema

This section provides some hints for choosing the right schema for a dataset
based on the storage space that types occupy in QuestDB.

#### Symbols

[Symbols](/docs/concept/symbol/) are a data type that is recommended to be used
for strings that are repeated often in a dataset. The benefit of using this data
type is lower storage requirements than regular strings and faster performance
on queries as symbols are internally stored as `int` values.

:::info

Only symbols can be indexed in QuestDB. Although multiple indexes can be
specified for a table, there would be a performance impact on the rate of
ingestion.

:::

The following example shows the creation of a table with a `symbol` type that
has multiple options passed for performance optimization.

```questdb-sql
CREATE TABLE my_table(
    symb SYMBOL capacity 256 nocache index capacity 1048576,
    ts TIMESTAMP, s STRING
) timestamp(ts)  PARTITION BY DAY;
```

This example adds a `symbol` type with:

- **capacity** specified to estimate how many unique symbols values to expect
- **caching** disabled which allows dealing with larger value counts
- **index** for the symbol column with a storage block value

A full description of the options used above for `symbol` types can be found in
the [CREATE TABLE](/docs/reference/sql/create-table/#symbol) page.

#### Numbers

The storage space that numbers occupy can be optimized by choosing `byte`,
`short`, and `int` data types appropriately. When values are not expected to
exceed the limit for that particular type, savings on disk space can be made.

| type  | storage per value | numeric range             |
| ----- | ----------------- | ------------------------- |
| byte  | 8 bits            | -128 to 127               |
| short | 16 bits           | -32768 to 32767           |
| int   | 32 bits           | -2147483648 to 2147483647 |

## CPU configuration

In QuestDB, there are worker pools which can help separate CPU-load between
sub-systems. This section describes configuration strategies based on the
forecast behavior of the database.

:::caution

- Multiple workers must not have affinity (pinning) for the same core by ID.
  Although this is possible through manual configuration settings described
  below, this must be avoided as it can lead to indeterminate behavior.
- When configuring the affinity of worker threads to CPUs and setting dedicated
  worker threads for tasks as described in the following sections,
  **hyper-threading must be disabled** in the system BIOS. If hyper-threading
  cannot be disabled, the core IDs should be ascertained and workers should not
  use adjacent cores to prevent overlapping work.

:::

### Shared workers

The number of worker threads shared across the application can be configured as
well as affinity to pin processes to specific CPUs by ID. Shared worker threads
service SQL execution subsystems and, in the default configuration, every other
subsystem. Except for SQL, every other subsystem can be configured to use their
own worker threads. More information on these settings can be found on the
[shared worker](/docs/reference/configuration/#shared-worker) configuration
page.

QuestDB will allocate CPU resources differently depending on how many CPU cores
are available. This behavior is default but can be overridden via configuration.
By checking the CPU Core count, QuestDB will assume that CPU hyper-threading is
enabled. If hyper-threading is disabled on your system, you will have to
configure CPU pools manually. Please refer to [CPU affinity](#cpu-affinity)
configuration.

#### 8 CPU Cores or less

QuestDB will configure a shared worker pool to handle everything except the
InfluxDB line protocol (ILP) writer which gets a dedicated CPU core. The worker
count is calculated as follows:

$(cpuAvailable / 2) - 1 - (line.tcp.writer.worker.count)$

#### 16 CPU Cores or less

ILP I/O Worker pool is configured to use 2 CPU cores to speed up ingestion and
the ILP Writer is using 1 core. The shared worker pool is handing everything
else and is configured using this formula:

$(cpuAvailable / 2) - 1 - (line.tcp.writer.worker.count) - (line.tcp.io.worker.count)$

For example, with 16 hyper-threaded cores, the shared pool will have 4 threads:

$16/2-1-2-1$

#### 17 CPU Cores and more

The ILP I/O Worker pool is configured to use 6 CPU Cores to speed up ingestion
and the ILP Writer is using 1 core. The shared worker pool is handling
everything else and is configured using this formula:

$(cpuAvailable / 2) - 1 - (line.tcp.writer.worker.count) - (line.tcp.io.worker.count)$

For example, with 32 hyper-threaded cores, the shared pool will have 8 threads:

$32/2-1-6-1$

### Writer page size

The default page size for writers is 16MB. In cases where there are a large
number of small tables, using 16MB to write a maximum of 1Mb of data, for
example, is a waste of OS resources. To changes the default value, set the
`append.page.size` value in `server.conf` which is a rounded (ceiling) of the
multiple of OS page sizes:

```bash title="server.conf"
cairo.sql.append.page.size=1
```

### InfluxDB over TCP

This section describes methods for optimizing ingestion of InfluxDB line
protocol messages over TCP. For all configuration settings available for this
subsystem, see the [InfluxDB line over TCP](#influxdb-line-protocol-tcp)
configuration reference.

#### Message length

When the message length is known, a starting point for optimization on ingestion
is setting maximum measurement sizes and specifying buffer size for processing
records:

```bash title="server.conf"
# max line length for measurements
line.tcp.max.measurement.size=2048
# buffer size to process messages at one time, cannot be less than measurement size
line.tcp.msg.buffer.size=2048
```

#### CPU affinity

Given a single client sending data to QuestDB via InfluxDB line protocol over
TCP, the following configuration can be applied which sets a dedicated worker
and pins it with `affinity` to a CPU by core ID:

```bash title="server.conf"
line.tcp.worker.count=1
line.tcp.worker.affinity=1
```

Given two clients writing over TCP, multiple worker threads can be pinned to CPU
cores by a comma-separated list of CPUs by core ID:

```bash title="server.conf"
line.tcp.worker.count=2
line.tcp.worker.affinity=1,2
```

#### Committing records

These two configuration settings are relevant for maintenance jobs which commit
uncommitted records to tables. This maintenance of committing records will occur
if either:

- the max number of uncommitted rows is hit (default of `1000`) or
- when the maintenance job interval is reached

```bash title="server.conf"
# commit when this number of uncommitted records is reached
cairo.max.uncommitted.rows=1000
# commit uncommitted rows when this timer is reached
line.tcp.maintenance.job.interval=1000
```

### InfluxDB over UDP

Given a single client sending data to QuestDB via InfluxDB line protocol over
UDP, the following configuration can be applied which dedicates a thread for a
UDP writer and specifies a CPU core by ID:

```bash title="server.conf"
line.udp.own.thread=true
line.udp.own.thread.affinity=1
```

### Postgres

Given clients sending data to QuestDB via Postgres interface, the following
configuration can be applied which sets a dedicated worker and pins it with
`affinity` to a CPU by core ID:

```bash title="server.conf"
pg.worker.count=4
pg.worker.affinity=1,2,3,4
```

## Network Configuration

For InfluxDB line, Postgres wire and HTTP protocols, there are a set of
configuration settings relating to the number of clients that may connect, the
internal I/O capacity and connection timeout settings. These settings are
configured in the `server.conf` file in the format:

```bash
<protocol>.net.connection.<config>
```

Where `<protocol>` is one of:

- `http` - HTTP connections
- `pg` - Postgres wire protocol
- `line.tcp` - InfluxDB line protocol over TCP

And `<config>` is one of the following settings:

| key       | description                                                                                                                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`   | The number of simultaneous connections to the server. This value is intended to control server memory consumption.                                                                                                         |
| `timeout` | Connection idle timeout in milliseconds. Connections are closed by the server when this timeout lapses.                                                                                                                    |
| `hint`    | Applicable only for Windows, where TCP backlog limit is hit. For example Windows 10 allows max of 200 connection. Even if limit is set higher, without hint=true it won't be possible to connect more than 200 connection. |
| `sndbuf`  | Maximum send buffer size on each TCP socket. If value is -1 socket send buffer remains unchanged from OS default.                                                                                                          |
| `rcvbuf`  | Maximum receive buffer size on each TCP socket. If value is -1, the socket receive buffer remains unchanged from OS default.                                                                                               |

For example, this is configuration for Linux with relatively low number of
concurrent connections:

```bash title="server.conf InfluxDB line protocol network example configuration for moderate number of concurrent connections"
# bind to all IP addresses on port 9009
line.tcp.net.bind.to=0.0.0.0:9009
# maximum of 30 concurrent connection allowed
line.tcp.net.connection.limit=30
# nothing to do here, connection limit is quite low
line.tcp.net.connection.hint=false
# connections will time out after 60s of no activity
line.tcp.net.connection.timeout=60000
# receive buffer is 4Mb to accomodate large messages
line.tcp.net.rcvbuf=4m
```

Let's assume you would like to configure InfluxDB line protocol for large number
of concurrent connection on Windows:

```bash title="server.conf InfluxDB line protocol network example configuration for large number of concurrent connections on Windows"
# bind to specific NIC on port 9009, NIC is identified by IP address
line.tcp.net.bind.to=10.75.26.3:9009
# large number of concurrent connections
line.tcp.net.connection.limit=400
# Windows will not allow 400 client to connect unless we use the "hint"
line.tcp.net.connection.hint=true
# connections will time out after 30s of no activity
line.tcp.net.connection.timeout=30000
# receive buffer is 1Mb because messages are small, smaller buffer will
# reduce memory usage, 400 connection times 1MB = 400MB RAM is required to handle input
line.tcp.net.rcvbuf=1m
```

For reference on the defaults of the `http` and `pg` protocols, refer to the
[server configuration page](/docs/reference/configuration/)

## OS configuration

This section describes approaches for changing system settings on the host
QuestDB is running on when system limits are reached due to maximum open files
or virtual memory areas. QuestDB passes operating system errors to its logs
unchanged and as such, changing the following system settings should only be
done in response to such OS errors.

### Maximum open files

The storage model of QuestDB has the benefit that most data structures relate
closely to the file system, with columnar data being stored in its own `.d` file
per partition. In edge cases with extremely large tables, the number of open
files may hit a user or system-wide maximum limit and can cause unpredictable
behavior.

The following commands allow for checking current user and system limits for
maximum number of open files:

```bash title="checking ulimit"
# Soft limit
ulimit -Sn
# Hard limit
ulimit -Hn
```

**Setting system-wide open file limit:**

To increase this setting and have the configuration persistent, the limit on the
number of concurrently open files can be changed in `/etc/sysctl.conf`:

```bash title="/etc/sysctl.conf"
fs.file-max=100000
```

To confirm that this value has been correctly configured, reload `sysctl` and
check the current value:

```bash
# reload configuration
sysctl -p
# query current settings
sysctl fs.file-max
```

### Max virtual memory areas limit

If the host machine has insufficient limits of map areas, this may result in out
of memory exceptions. To increase this value and have the configuration
persistent, mapped memory area limits can be changed in `/etc/sysctl.conf`:

```bash title="/etc/sysctl.conf"
vm.max_map_count=262144
```

Each mapped area needs kernel memory, and it's recommended to have around 128
bytes available per 1 map count.

```bash
# reload configuration
sysctl -p
# query current settings
cat /proc/sys/vm/max_map_count
```

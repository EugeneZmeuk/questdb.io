import clsx from "clsx"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Highlight from "../components/Highlight"
import React, { useCallback, useEffect, useState } from "react"
import Customers from "../components/Customers"
import customFields from "../config/customFields"

import Button from "@theme/Button"
import Chevron from "@theme/Chevron"
import PageLayout from "@theme/PageLayout"
import useWindowWidth from "@theme/useWindowWidth"
import SvgImage from "../components/SvgImage"

import doCss from "../css/index/docker.module.css"
import feCss from "../css/index/feature.module.css"
import flCss from "../css/index/flashy.module.css"
import inCss from "../css/index/integration.module.css"
import juCss from "../css/index/jumbotron.module.css"
import meCss from "../css/index/menu.module.css"
import shCss from "../css/index/showcase.module.css"
import usCss from "../css/index/usp.module.css"
import prCss from "../css/property.module.css"
import seCss from "../css/section.module.css"

import GithubLogo from "../assets/img/github.svg"
import PgLogo from "../assets/img/pages/index/integrations/pg.svg"
import GrafanaLogo from "../assets/img/pages/index/integrations/grafana.svg"
import KafkaLogo from "../assets/img/pages/index/integrations/kafka.svg"
import PythonLogo from "../assets/img/pages/index/integrations/python.svg"
import PandasLogo from "../assets/img/pages/index/integrations/pandas.svg"
import InfluxdataLogo from "../assets/img/pages/index/integrations/influxdata.svg"
import TableauLogo from "../assets/img/pages/index/integrations/tableau.svg"
import MetabaseLogo from "../assets/img/pages/index/integrations/metabase.svg"
import DockerLogo from "../assets/img/pages/index/docker.svg"
import PgwireLogo from "../assets/img/pages/index/pgwire.svg"
import FossIcon from "../assets/img/pages/index/foss.svg"
import SearchTimeIcon from "../assets/img/pages/index/searchTime.svg"
import SliceTimeIcon from "../assets/img/pages/index/sliceTime.svg"
import NavigateTimeIcon from "../assets/img/pages/index/navigateTime.svg"
import MergeTimeIcon from "../assets/img/pages/index/mergeTime.svg"

const FeatureTabs = () => {
  const [opened, setOpened] = useState<"digital" | "realtime" | "integration">(
    "digital",
  )
  const handleClickIs = useCallback(() => {
    setOpened("digital")
  }, [])
  const handleClickGoodFor = useCallback(() => {
    setOpened("realtime")
  }, [])
  const handleClickIsNot = useCallback(() => {
    setOpened("integration")
  }, [])

  return (
    <section className={clsx(seCss.section, seCss["section--odd"])}>
      <div className={clsx(seCss["section--inner"], seCss["section--center"])}>
        <h2
          className={clsx(
            seCss.section__title,
            seCss["section__title--wide"],
            "text--center",
          )}
        >
          Why QuestDB?
        </h2>

        <div
          className={clsx(
            seCss.section__footer,
            seCss["section__footer--feature-tabs"],
          )}
        >
          <div className={meCss.menu__list}>
            <Button
              className={meCss.menu__button}
              onClick={handleClickIs}
              size="small"
              variant={opened === "digital" ? "primary" : "tertiary"}
            >
              Digital transformation
            </Button>
            <Button
              className={meCss.menu__button}
              onClick={handleClickGoodFor}
              size="small"
              variant={opened === "realtime" ? "primary" : "tertiary"}
            >
              Real-time insights
            </Button>
            <Button
              className={meCss.menu__button}
              onClick={handleClickIsNot}
              size="small"
              variant={opened === "integration" ? "primary" : "tertiary"}
            >
              Enterprise integration
            </Button>
          </div>

          <div className={meCss.menu__content}>
            <div
              className={clsx(meCss.menu__panel, {
                [meCss["menu__panel--active"]]: opened === "digital",
              })}
            >
              <p className={prCss.property}>Reduce hardware costs</p>
              <p className={prCss.property}>Contain operational complexity</p>
              <p className={prCss.property}>Decrease development costs</p>
              <p className={prCss.property}>Cloud native (AWS, Azure, GCP)</p>
              <p className={prCss.property}>On-premises or embedded</p>
            </div>

            <div
              className={clsx(meCss.menu__panel, {
                [meCss["menu__panel--active"]]: opened === "realtime",
              })}
            >
              <p className={prCss.property}>Streaming</p>
              <p className={prCss.property}>Operational analytics / OLAP</p>
              <p className={prCss.property}>Monitoring and observability</p>
              <p className={prCss.property}>Predictive analytics</p>
            </div>

            <div
              className={clsx(meCss.menu__panel, {
                [meCss["menu__panel--active"]]: opened === "integration",
              })}
            >
              <p className={prCss.property}>Active directory</p>
              <p className={prCss.property}>High-performance replication</p>
              <p className={prCss.property}>High-availability</p>
              <p className={prCss.property}>Clustering</p>
              <p className={prCss.property}>Enterprise security</p>
              <p className={prCss.property}>Postgres compatible</p>
            </div>

            <Button className={meCss.menu__cta} to="/enterprise">
              Enterprise &gt;
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

const Integration = () => (
  <section
    className={clsx(
      seCss.section,
      seCss["section--inner"],
      seCss["section--center"],
    )}
  >
    <h2
      className={clsx(
        seCss.section__title,
        seCss["section__title--wide"],
        "text--center",
      )}
    >
      Integration with the tools you love
    </h2>

    <div className={inCss.integration}>
      <p className={inCss.integration__item}>
        <SvgImage image={<PgLogo />} title="Postgres logo" />
        Postgres
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<GrafanaLogo />} title="Grafana logo" />
        Grafana
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<KafkaLogo />} title="Kafka logo" />
        Kafka
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<PythonLogo />} title="Python logo" />
        Python
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<PandasLogo />} title="Pandas logo" />
        Pandas
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<InfluxdataLogo />} title="Telegraf logo" />
        Telegraf
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<TableauLogo />} title="Tableau logo" />
        Tableau
      </p>
      <p className={inCss.integration__item}>
        <SvgImage image={<MetabaseLogo />} title="Metabase logo" />
        Metabase
      </p>
    </div>
  </section>
)

const Top = () => {
  const { siteConfig } = useDocusaurusContext()

  return (
    <section
      className={clsx(seCss["section--inner"], seCss["section--slim--accent"])}
    >
      <div className={juCss.jumbotron}>
        <h1
          className={clsx(
            seCss.section__title,
            seCss["section__title--jumbotron"],
            seCss["section__title--accent"],
          )}
        >
          Fast SQL for time series
        </h1>

        <p
          className={clsx(
            seCss.section__subtitle,
            seCss["section__subtitle--jumbotron"],
            seCss["section__subtitle--accent"],
          )}
        >
          {siteConfig.tagline}
        </p>

        <div className={juCss.jumbotron__cta}>
          <Button className={juCss.jumbotron__link} href={customFields.demoUrl}>
            Live Demo
          </Button>
          <Button
            className={clsx(
              juCss.jumbotron__link,
              juCss["jumbotron__cta--github"],
            )}
            href={customFields.githubUrl}
            icon={<SvgImage image={<GithubLogo />} title="GitHub" />}
            variant="secondary"
          >
            GitHub
          </Button>
        </div>
        <p className={juCss.jumbotron__description}>
          Query our demo dataset with 1.6 billion rows in milliseconds
        </p>
      </div>

      <div className={doCss.docker}>
        <pre className={doCss.docker__inner}>
          <code className={doCss.docker__code}>
            {`docker pull questdb/questdb
docker run -p 9000:9000 questdb/questdb`}
          </code>
          <a
            href={customFields.dockerUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SvgImage
              image={<DockerLogo className={doCss.docker__icon} />}
              title="Docker"
            />
          </a>
        </pre>
      </div>
    </section>
  )
}

const Usp = () => (
  <section className={clsx(seCss.section, seCss["section--odd"])}>
    <div className={seCss["section--inner"]}>
      <div className={usCss.usp}>
        <div className={usCss.usp__inner}>
          <img
            alt="Speedometer"
            className={usCss.usp__illustration}
            height={113}
            src="/img/pages/index/rawPower.svg"
            width={176}
          />

          <h2 className={usCss.usp__title}>Built for performance</h2>

          <p className={usCss.usp__description}>SIMD-optimized analytics</p>
          <p className={usCss.usp__description}>Row- and column-based access</p>
          <p className={usCss.usp__description}>Vectorized query execution</p>
          <p className={usCss.usp__description}>Tiny memory footprint</p>
          <p className={usCss.usp__description}>C++ and zero-GC Java</p>
        </div>
      </div>

      <div className={clsx(usCss.usp, usCss["usp--wide"])}>
        <div className={usCss.usp__inner}>
          <img
            alt="A code editor with a chart that shows the result of the query"
            className={usCss.usp__illustration}
            height={113}
            src="/img/pages/index/easyToUse.svg"
            width={205}
          />

          <h2 className={usCss.usp__title}>Optimized for time series</h2>

          <p className={usCss.usp__description}>
            Relational model for time series
          </p>
          <p className={usCss.usp__description}>
            Data stored in chronological order
          </p>
          <p className={usCss.usp__description}>Time partitioned</p>
          <p className={usCss.usp__description}>Immediate consistency</p>
          <p className={usCss.usp__description}>Fast InfluxDB line protocol</p>
        </div>
      </div>

      <div className={usCss.usp}>
        <div className={usCss.usp__inner}>
          <img
            alt="A code editor containing a SQL statement"
            className={usCss.usp__illustration}
            height={113}
            src="/img/pages/index/featureRich.svg"
            width={176}
          />

          <h2 className={usCss.usp__title}>Implemented with SQL</h2>

          <p className={usCss.usp__description}>
            Time series and relational joins
          </p>
          <p className={usCss.usp__description}>Postgres compatibility</p>
          <p className={usCss.usp__description}>
            Aggregations and downsampling
          </p>
          <p className={usCss.usp__description}>Unlimited sub-queries</p>
          <p className={usCss.usp__description}>Built-in SQL optimizer</p>
        </div>
      </div>
    </div>
  </section>
)

const Cards = () => (
  <section className={clsx(seCss.section, seCss["section--odd"])}>
    <div className={clsx(seCss["section--inner"], seCss["section--center"])}>
      <h3
        className={clsx(
          seCss.section__title,
          feCss["section__title--wide"],
          "text--center",
        )}
      >
        Why time series?
      </h3>

      <div
        className={clsx(
          seCss.section__footer,
          seCss["section__footer--feature-cards"],
        )}
      >
        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>DevOps monitoring</h3>
          <p className={feCss.feature__content}>
            Collect metrics and events from your infrastructure (CPU, memory,
            networks, etc.) and get real-time visibility into your entire stack.
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>Financial market data</h3>
          <p className={feCss.feature__content}>
            Store market data to identify historical trends and correlations
            using statistical methods and generate trading signals.
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>Connected devices</h3>
          <p className={feCss.feature__content}>
            Capture, store and respond to data from sensors at any resolution in
            industrial applications.
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>Application metrics</h3>
          <p className={feCss.feature__content}>
            Empower your application users to track and visualize logs, API
            calls, and any application activity in real-time.
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>
            Machine learning with time-series data
          </h3>
          <p className={feCss.feature__content}>
            Use QuestDB with popular Python frameworks and tools for leveraging
            anomaly detection algorithms, machine learning libraries,
            statistical analysis with Pandas, or Jupyter notebooks.
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>Integrated data</h3>
          <p className={feCss.feature__content}>
            Pull together all your application, device, and infrastructure data
            for a complete, 360º view of all aspects of your business.
          </p>
        </div>
      </div>
    </div>
  </section>
)

const Console = () => {
  return (
    <section
      className={clsx(
        seCss.section,
        seCss["section--inner"],
        seCss["section--center"],
      )}
    >
      <h2
        className={clsx(
          seCss.section__title,
          seCss["section__title--wide"],
          "text--center",
        )}
      >
        Interactive Console
      </h2>
      <p
        className={clsx(
          seCss.section__subtitle,
          seCss["section__subtitle--narrow"],
          "text--center",
        )}
      >
        Interactive console to import data (drag and drop) and start querying
        right away. Check our{" "}
        <a href="/docs/reference/client/web-console/">
          Web Console documentation
        </a>{" "}
        to get started.
      </p>

      <img
        alt="Artistic view of QuestDB's Web Console split in 3 components: the navigation tree, the SQL code editor and data displayed as a chart"
        className={seCss.section__illustration}
        height={467}
        src="/img/pages/index/console.svg"
        width={600}
      />

      <div
        className={clsx(
          seCss.section__footer,
          seCss["section__footer--console"],
        )}
      >
        <div className={clsx(flCss.flashy, flCss["flashy--primary"])}>
          <SvgImage image={<PgwireLogo />} title="Postgres logo" />
          <h3 className={flCss.flashy__title}>Postgres compatibility</h3>
          <p className={flCss.flashy__content}>
            Interact with QuestDB using the Postgres layer and any tool that
            connects to it.
          </p>
        </div>

        <div className={flCss.flashy}>
          <SvgImage image={<FossIcon />} title="Antenna" />
          <h3 className={flCss.flashy__title}>Open source</h3>
          <p className={flCss.flashy__content}>
            QuestDB is open source. Follow us on GitHub. Watch the repo to get
            notified of further releases and new features!
          </p>

          <div className={flCss.flashy__links}>
            <a
              className={flCss.flashy__link}
              href={customFields.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to GitHub&nbsp;&nbsp;&gt;
            </a>
            <a className={flCss.flashy__link} href={customFields.slackUrl}>
              Join Slack&nbsp;&nbsp;&gt;
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const S = [3, 1, 6, 10]
const M = [3, 0, 4, 8]
const L = [4, 0, 4, 8]

const getTopByIndex = (m: number[], index: 1 | 2 | 3 | 4): number => {
  const scale = {
    1: 25 * (m[0] ?? 0),
    2: -25 * (m[1] ?? 0),
    3: -25 * (m[2] ?? 0),
    4: -25 * (m[3] ?? 0),
  }

  return scale[index] ?? 0
}

const searchQuery = `SELECT timestamp, tempC
FROM sensors
WHERE timestamp IN '2021-05-14;1M';`

const sliceQuery = `SELECT timestamp, avg(tempC)
FROM sensors
SAMPLE BY 5m;`

const navigateQuery = `SELECT timestamp, sensorName, tempC
FROM sensors
LATEST ON timestamp PARTITION BY sensorName;`

const mergeQuery = `SELECT sensors.timestamp ts, rain1H
FROM sensors
ASOF JOIN weather;`

type Index = 1 | 2 | 3 | 4

const QueryScroller = () => {
  const [top, setTop] = useState(S)
  const [index, setIndex] = useState<Index>(2)
  const windowWidth = useWindowWidth()
  const handleClick1 = useCallback(() => {
    setIndex(1)
  }, [])
  const handleClick2 = useCallback(() => {
    setIndex(2)
  }, [])
  const handleClick3 = useCallback(() => {
    setIndex(3)
  }, [])
  const handleClick4 = useCallback(() => {
    setIndex(4)
  }, [])
  const handleUpClick = useCallback(() => {
    setIndex(Math.max(index - 1, 1) as Index)
  }, [index])
  const handleDownClick = useCallback(() => {
    setIndex(Math.min(index + 1, 4) as Index)
  }, [index])

  useEffect(() => {
    if (windowWidth != null && windowWidth < 622) {
      setTop(S)
      return
    }

    if (windowWidth != null && windowWidth < 800) {
      setTop(M)
      return
    }

    setTop(L)
  }, [windowWidth])

  return (
    <section
      className={clsx(
        seCss.section,
        seCss["section--inner"],
        seCss["section--center"],
        seCss["section--showcase"],
      )}
    >
      <h2
        className={clsx(
          seCss.section__title,
          seCss["section__title--wide"],
          "text--center",
        )}
      >
        Augmented SQL for time series
      </h2>

      <p
        className={clsx(
          seCss.section__subtitle,
          seCss["section__subtitle--narrow"],
          "text--center",
        )}
      >
        QuestDB enhances ANSI SQL with time series extensions to manipulate time
        stamped data
      </p>

      <div className={shCss.showcase}>
        <div className={shCss.showcase__inner}>
          <div
            className={clsx(shCss.showcase__chevron)}
            onClick={handleUpClick}
            style={{ visibility: index === 1 ? "hidden" : "visible" }}
          >
            <Chevron />
          </div>
          <div className={clsx(shCss.showcase__left)}>
            <div
              className={clsx(
                shCss.showcase__offset,
                shCss[`showcase__${index}`],
              )}
              style={{ top: getTopByIndex(top, index) }}
            >
              <Highlight code={searchQuery} />
              <Highlight code={`-- Search time\n${searchQuery}`} />
              <Highlight code={sliceQuery} />
              <Highlight code={`-- Slice time\n${sliceQuery}`} />
              <Highlight code={navigateQuery} />
              <Highlight code={`-- Navigate time\n${navigateQuery}`} />
              <Highlight code={mergeQuery} />
              <Highlight code={`-- Merge time\n${mergeQuery}`} />
            </div>
          </div>
          <div
            className={clsx(
              shCss.showcase__chevron,
              shCss["showcase__chevron--bottom"],
            )}
            onClick={handleDownClick}
            style={{ visibility: index === 4 ? "hidden" : "visible" }}
          >
            <Chevron />
          </div>
          <div className={shCss.showcase__right}>
            <div
              className={clsx(shCss.showcase__button, {
                [shCss["showcase__button--active"]]: index === 1,
              })}
              onClick={handleClick1}
            >
              <h3 className={shCss.showcase__header}>
                <SvgImage
                  image={<SearchTimeIcon className={shCss.showcase__icon} />}
                  title="Magnifying glass icon"
                />
                Search Time
              </h3>
              <p className={shCss.showcase__description}>
                Filter and search for specific timestamps with “WHERE”
              </p>
            </div>

            <div
              className={clsx(shCss.showcase__button, {
                [shCss["showcase__button--active"]]: index === 2,
              })}
              onClick={handleClick2}
            >
              <h3 className={shCss.showcase__header}>
                <SvgImage
                  image={<SliceTimeIcon className={shCss.showcase__icon} />}
                  title="Knife icon"
                />
                Slice Time
              </h3>
              <p className={shCss.showcase__description}>
                Create time buckets and aggregate by intervals with “SAMPLE BY”
              </p>
            </div>

            <div
              className={clsx(shCss.showcase__button, {
                [shCss["showcase__button--active"]]: index === 3,
              })}
              onClick={handleClick3}
            >
              <h3 className={shCss.showcase__header}>
                <SvgImage
                  image={<NavigateTimeIcon className={shCss.showcase__icon} />}
                  title="Indication arrow icon"
                />
                Navigate Time
              </h3>
              <p className={shCss.showcase__description}>
                Search time series from most recent values to oldest with
                “LATEST BY”
              </p>
            </div>
            <div
              className={clsx(shCss.showcase__button, {
                [shCss["showcase__button--active"]]: index === 4,
              })}
              onClick={handleClick4}
            >
              <h3 className={shCss.showcase__header}>
                <SvgImage
                  image={<MergeTimeIcon className={shCss.showcase__icon} />}
                  title="Two overlapping squares"
                />
                Merge Time
              </h3>
              <p className={shCss.showcase__description}>
                Join two tables based on timestamp where timestamps do not
                exactly match with “ASOF JOIN”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  const title = "QuestDB | Time series data, faster"

  return (
    <PageLayout
      canonical=""
      description={customFields.description}
      title={title}
      replaceTitle
    >
      <Top />
      <Customers nbElements={6} />
      <Usp />
      <Integration />
      <FeatureTabs />
      <QueryScroller />
      <Cards />
      <Console />
    </PageLayout>
  )
}

export default Home

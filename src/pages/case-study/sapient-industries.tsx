import clsx from "clsx"
import React from "react"

import Button from "@theme/Button"
import Layout from "../../theme/Layout"

import caCss from "../../css/case-study/card.module.css"
import juCss from "../../css/case-study/jumbotron.module.css"
import ouCss from "../../css/case-study/outcome.module.css"
import seCss from "../../css/section.module.css"
import chCss from "../../css/case-study/chart.module.css"

const Sapient = () => {
  const title =
    "Sapient use QuestDB for real-time analytics in smart infrastructure"
  const description =
    "QuestDB is used as a time series database by Sapient for usage insights, anomaly detection, and predictive maintenance."

  return (
    <Layout
      canonical="/case-study/sapient-industries/"
      description={description}
      title={title}
    >
      <section
        className={clsx(
          seCss.section,
          seCss["section--center"],
          juCss.jumbotron,
        )}
      >
        <div className={juCss.jumbotron__summary}>
          <div className={juCss.jumbotron__header}>
            <Button
              href="https://www.sapient.industries/?utm_source=questdb"
              variant="plain"
            >
              <img
                alt="Sapient Industries logo"
                className={juCss.jumbotron__logo}
                height={45}
                src="/img/pages/case-study/sapient-industries/logo.svg"
                width={100}
              />
            </Button>
            <span className={juCss.jumbotron__name}>Case study</span>
          </div>
          <h1 className={seCss.section__title}>
            Sapient use QuestDB for real-time analytics in smart infrastructure
          </h1>
          <p
            className={clsx(
              seCss.section__subtitle,
              juCss.jumbotron__description,
            )}
          >
            QuestDB is used by Sapient Industries in their proprietary analytics
            platform, which modernizes building infrastructure by monitoring
            energy data from electrical equipment for usage insights that enable
            anomaly detection, energy savings, asset management, and facility
            optimization.
          </p>
        </div>

        <div className={juCss.jumbotron__banner}>
          <img
            alt="An illustration showing some of the capabilities of Sapient Industries' analytics platform"
            height={170}
            src="/img/pages/case-study/sapient-industries/resource-utilization.png"
            width={800}
          />
        </div>
      </section>

      <section className={clsx(seCss.section, seCss["section--odd"])}>
        <div className={clsx(seCss["section--inner"], ouCss.outcome__wrapper)}>
          <p className={ouCss.outcome}>
            <img
              alt="Dollar icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/dollar.svg"
            />
            Control costs by using fewer cloud resources to reach ingestion
            speeds
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Workflow icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/workflow.svg"
            />
            Compatibile with RESTful components, PostgreSQL tooling
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Leaf icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/leaf.svg"
            />
            SQL queries are simple to read and intuitive to compose
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Gauge icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/gauge.svg"
            />
            Analytics platform for efficient ingestion of hundreds of GB/month
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Voice icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/voice.svg"
            />
            Simple setup with minimal maintenance
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Time icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/time.svg"
            />
            High-performance solution for real-time analytics
          </p>
        </div>
      </section>

      <section className={clsx(seCss.section, caCss.card)}>
        <p className={caCss.card__title}>
          Sapient empowers customers to unlock and leverage real-time electrical
          data to solve the increasing challenge of efficient facility
          operations. The insights derived from these analytics help customers
          build more sustainable and efficient operations to manage
          infrastructure, predict maintenance cycles, and reduce energy costs.
        </p>

        <p className={caCss.card__subtitle}>
          In this case study, Dan Worth, Principal Software Engineer at Sapient
          Industries describes how and why QuestDB is relied upon within
          high-performance clusters for real-time analytics.
        </p>
      </section>

      <section className={seCss.section}>
        <div
          className={clsx(
            "markdown",
            seCss["section--inner"],
            seCss["section--column"],
          )}
        >
          <h3>Sapient Industries provide analytics for smart buildings</h3>
          <p className="font-size--large">
            Our integrated platform applies machine learning and analytics to
            facility electrical data, delivering deep insights that drive cost,
            carbon, and operational efficiencies. Our customers capitalize on
            next-level building intelligence to harmonize and execute energy,
            facilities, sustainability, and real estate initiatives.
          </p>
          <p className="font-size--large">
            Our solution supports stakeholders across facilities management,
            energy, real estate, sustainability, asset management, IT, and
            finance. Our platform’s analytics drive immediate impact and
            intuitively enable data-driven decision-making by providing users
            with actionable insights at every node of a building’s energy
            consumption.
          </p>
          <img
            alt="A diagram showing how Sapient Industries collects and consolidates input to contextualize industrial sensor data"
            className={chCss.chart}
            height={433}
            src="/img/pages/case-study/sapient-industries/diagram.png"
            width={1100}
          />
          <h3>Why we use QuestDB for real-time analytics</h3>
          <p className="font-size--large">
            QuestDB facilitates actionable performance because of the speed for
            complex queries. Data can be pulled in real-time without having to
            store it. One major draw for us was that QuestDB uses SQL; this
            eliminated the learning curve for our team. We don’t have to learn a
            new custom query language and we can easily compose common queries
            as we go with our existing familiarity with SQL.
          </p>
          <p className="font-size--large">
            We’re capturing minute-level energy usage data from electrical
            equipment throughout facilities. These devices and pieces of
            equipment range from IT gear like laptops and workstations, to
            industrial machinery, lighting, facility equipment, refrigerators,
            and all other energy-consuming equipment.
          </p>

          <p className="font-size--large">
            Upon collecting electrical consumption data from the thousands of
            pieces of equipment in a building, we use machine learning
            algorithms to automatically label each device throughout the
            facility. We then employ a collection of ‘device-utilization’
            queries to check for abnormalities such as sudden amperage
            increases, deliver energy usage comparisons over time and geography,
            provide emissions calculations, among countless other metrics.
          </p>
          <p className="font-size--large">
            When customers have a detailed breakdown of the equipment-specific
            energy consumption in their facilities, they can make data-driven
            decisions that have broad-reaching benefits across the organization.
            Insights driven by the detection of energy usage spikes, abnormally
            high energy density, or irregularities in current draw drive
            efficiencies across maintenance, space reconfiguration, procurement
            decisions, sustainability investments and more.
          </p>
          <h3>Our analytics platform is cloud-native and highly available </h3>
          <p className="font-size--large">
            For our deployment, QuestDB is configured as a StatefulSet in a
            Kubernetes cluster on Google Cloud Platform. We deploy two instances
            on different node-pools and route traffic to both for High
            Availability. We back up partitions hourly to Google Cloud Storage
            using custom Go programs that we developed.
          </p>

          <p className="font-size--large">
            Our deployment’s API queries QuestDB over REST API, and we’re
            ingesting data using InfluxDB Line Protocol for high throughput. For
            the data requirements, we’re typically ingesting 250GB worth of
            sensor data into QuestDB per month, and we currently have about
            1.2TB in an instance.
          </p>
          <div
            className={clsx(
              "markdown",
              seCss["section--inner"],
              seCss["section--column"],
            )}
          >
            <p className={caCss.card__title}>
              <span className={caCss.card__quote}>&ldquo;</span>Sapient enables
              building intelligence by providing the data needed to make smart
              and proactive operational decisions, which yield multiple larger
              benefits around facility planning, asset investments, and
              sustainability goals. Our proprietary software generates these
              data insights, and we chose QuestDB for the simplicity of SQL,
              high-throughput ingestion, and the compatibility of our tooling
              with PostgreSQL wire.
              <span className={caCss.card__quote}>&rdquo;</span>
            </p>
            <p className={caCss.card__title}>
              <b>
                Dan Worth, Principal Software Engineer at Sapient Industries
              </b>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Sapient

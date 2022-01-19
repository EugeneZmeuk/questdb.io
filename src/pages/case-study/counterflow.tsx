import clsx from "clsx"
import React from "react"

import Button from "@theme/Button"
import PageLayout from "@theme/PageLayout"

import caCss from "../../css/case-study/card.module.css"
import juCss from "../../css/case-study/jumbotron.module.css"
import ouCss from "../../css/case-study/outcome.module.css"
import seCss from "../../css/section.module.css"
import chCss from "../../css/case-study/chart.module.css"

const Counterflow = () => {
  const title =
    "Counterflow AI use QuestDB for machine learning-driven network security"
  const description =
    "QuestDB is used by Counterflow AI as a time series database for storing network packet data analyzed by their real-time threat detection offering."

  return (
    <PageLayout
      canonical="/case-study/counterflow/"
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
              href="https://www.counterflow.ai/?utm_source=questdb"
              variant="plain"
            >
              <img
                alt="Counterflow AI logo"
                className={juCss.jumbotron__logo}
                height={65}
                src="/img/pages/customers/logos/counterflow.svg"
                width={150}
              />
            </Button>
            <span className={juCss.jumbotron__name}>Case study</span>
          </div>
          <h1 className={seCss.section__title}>
            QuestDB powers analytics in Counterflow’s network security suite
          </h1>
          <p
            className={clsx(
              seCss.section__subtitle,
              juCss.jumbotron__description,
            )}
          >
            QuestDB is used by Counterflow AI as a time series database for
            storing network packet data analyzed by their real-time threat
            detection engine.
          </p>
        </div>

        <div className={juCss.jumbotron__banner}>
          <img
            alt="The web-based dashboard for Counterflow AI's ThreatEye network security system"
            height={170}
            src="/img/pages/case-study/counterflow/dashboard.png"
            width={900}
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
            Cost reduction due to lower resource consumption
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Workflow icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/workflow.svg"
            />
            RESTful API support allows simple interoperation with existing stack
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Leaf icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/leaf.svg"
            />
            SQL compatibility simplifies developer onboarding
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Gauge icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/gauge.svg"
            />
            Powers a real-time system that operates at enterprise network speeds
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Voice icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/voice.svg"
            />
            Active developer community that helps with troubleshooting
          </p>
          <p className={ouCss.outcome}>
            <img
              alt="Time icon"
              className={ouCss.outcome__icon}
              src="/img/pages/case-study/icons/time.svg"
            />
            Fast turnaround time from prototype phase to production deployment
          </p>
        </div>
      </section>

      <section className={clsx(seCss.section, caCss.card)}>
        <p className={caCss.card__title}>
          CounterFlow AI is a cybersecurity software company offering an AIOps
          platform for network forensics. Their flagship product, ThreatEye,
          integrates advanced security technologies into a streaming machine
          learning pipeline to identify network faults, anomalies and threats at
          wire speed.
        </p>

        <p className={caCss.card__subtitle}>
          In this case study, VP Product Development Randy Caldejon describes
          how and why QuestDB is relied upon within high-performance network
          security systems developed by Counterflow AI.
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
          <img
            alt="Encrypted traffic is growing, SSL is nearly obsolete, and malware is hidden within encryption"
            className={chCss.chart}
            height={433}
            src="/img/pages/case-study/counterflow/traffic-overview.jpg"
            width={791}
          />
          <h3>Encrypted traffic analysis for network security</h3>
          <p className="font-size--large">
            Encrypted internet traffic has increased from around 50% in 2014 to
            between 80% and 90% today. Alongside this rise in encrypted traffic
            over HTTPS, the recent introduction of new protocols such as DNS
            over HTTPS and TLS 1.3 means that network defenders are faced with
            dramatically reduced server identity and content visibility. Our
            security offering allows LiveAction partners to gain end-to-end
            network visibility into the nature of this traffic using Encrypted
            Traffic Analysis (ETA).
          </p>
          <p className="font-size--large">
            ETA provides techniques to gain insight into network behavior
            despite encryption while protecting user privacy. It combines Deep
            Packet Dynamics with machine learning to identify malicious patterns
            in network activity. The benefit of this approach is that it can
            scale with continued growth in network traffic and increased use of
            encrypted protocols despite having no visibility into the content of
            the exchanges.
          </p>
          <img
            alt="A diagram showing six patterns of network traffic highlighted by Deep Packet Dynamics"
            className={chCss.chart}
            height={433}
            src="/img/pages/case-study/counterflow/threateye_dpd.png"
            width={800}
          />

          <h3>Analytics to process millions of events per second</h3>
          <p className="font-size--large">
            ThreatEye NV is powered by a streaming machine learning engine (MLE)
            that ingests the high-fidelity flow data generated by its software
            probes. We use this to provide end-to-end visibility into the nature
            of network traffic using real-time inferences in combination with
            Encrypted Traffic Analysis.
          </p>
          <p className="font-size--large">
            Distinct from batch processing, streaming ML is powered by analyzers
            designed to inspect network traffic without multiple passes over the
            data stream. The streaming nature of this solution means that we
            have to process millions of events per second.
          </p>
          <h3>Why we chose QuestDB for time series analytics</h3>
          <p className="font-size--large">
            We’re typically executing 25k to 100k inserts per second, depending
            on the size of the customer and the network activity. We started
            with InfluxDB as our central time series database, but we quickly
            started hitting performance issues with scalability in production
            environments, and we needed to find a practical alternative. After
            InfluxDB, we tried TimescaleDB, which was reasonable for
            performance, but the database configuration was inconvenient for us
            and the system had a poor footprint.
          </p>

          <p className="font-size--large">
            When we tried QuestDB, importing data over CSV was orders of
            magnitude faster than the other time series databases we used
            before. Our tools export either JSON or CSV, which means that a
            RESTful API to import and export data allows for seamless
            interfacing with the rest of our technology stack.
          </p>

          <h3>Why performance matters for streaming data scenarios</h3>
          <p className="font-size--large">
            We’re analyzing over 150 features of network flows, and our
            customers want to see common aggregations such as{" "}
            <b>top-n clients</b> consuming data on the network. SQL
            compatibility makes this easy to calculate in QuestDB, quick to
            verify in the web console, or visualize with Grafana using Postgres
            wire.
          </p>
          <p className="font-size--large">
            Our solution runs in hybrid-cloud deployments and needs to scale up
            to 40Gbps worth of inspected network data. High-performance is
            critical to ensure scalable and reliable analytics when deploying in
            high-throughput scenarios such as enterprise networks.
          </p>

          <img
            alt="The web-based dashboard for Counterflow AI’s ThreatEye network security system"
            className={chCss.chart}
            height={433}
            src="/img/pages/case-study/counterflow/threateye_ip_filter.png"
            width={800}
          />

          <div
            className={clsx(
              "markdown",
              seCss["section--inner"],
              seCss["section--column"],
            )}
          >
            <p className={caCss.card__title}>
              <span className={caCss.card__quote}>&ldquo;</span>QuestDB is
              impressive and stands out as a superior option. We use it as the
              basis of our time series analytics for network threat detection.
              <span className={caCss.card__quote}>&rdquo;</span>
            </p>
            <p className={caCss.card__title}>
              <b>Randy Caldejon, VP Product Development at Counterflow AI</b>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default Counterflow

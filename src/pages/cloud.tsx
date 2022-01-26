import React, { FormEvent, ReactElement, useState } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import clsx from "clsx"

import Layout from "../theme/Layout"
import Button from "@theme/Button"
import Input from "@theme/Input"
import SvgImage from "../components/SvgImage"

import ElasticSolutionIcon from "../assets/img/pages/cloud/elastic-solution.svg"
import HighAvailabilityIcon from "../assets/img/pages/cloud/high-availability.svg"
import HighPerformanceIcon from "../assets/img/pages/cloud/high-performance.svg"
import SecurityIcon from "../assets/img/pages/cloud/security.svg"
import ManagedQuestdbIcon from "../assets/img/pages/cloud/managed-questdb.svg"
import AwsLogo from "../assets/img/aws.svg"

import seCss from "../css/section.module.css"
import foCss from "../css/enterprise/form.module.css"
import ilCss from "../css/cloud/illustration.module.css"
import hlCss from "../css/cloud/highlights.module.css"
import flCss from "../css/cloud/flashy.module.css"
import slCss from "../css/cloud/slack.module.css"

import SlackLogo from "../assets/img/slack.svg"
import customFields from "../config/customFields"

type HighlightItem = {
  title: string
  description: string
  image: ReactElement
  imageTitle: string
}

const Top = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const target = event.target as HTMLFormElement
    const body = {}

    for (const [key, value] of new FormData(target).entries()) {
      body[key] = value
    }

    try {
      await fetch("https://crast.questdb.io/contact/cloud", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
    } catch (e) {}

    setSent(true)
  }

  return (
    <section className={seCss["section--inner"]}>
      <div className={seCss.section__header}>
        <h1
          className={clsx(
            seCss.section__title,
            seCss["section__title--accent"],
          )}
        >
          QuestDB Cloud
        </h1>

        <form className={foCss.form} onSubmit={handleSubmit}>
          <TransitionGroup component={null}>
            <CSSTransition
              key={sent.toString()}
              timeout={200}
              classNames="item"
            >
              <div className={foCss.form__wrapper}>
                {!sent && (
                  <>
                    <Input
                      className={foCss.form__input}
                      name="email"
                      pattern={
                        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
                      }
                      placeholder="Work Email"
                      required
                      title="Email address should be valid"
                      type="email"
                    />
                    <Button type="submit">
                      {loading && <span className={foCss.form__loader} />}
                      <span
                        className={clsx({
                          [foCss["form__button--hidden"]]: loading,
                        })}
                      >
                        Early&nbsp;access
                      </span>
                    </Button>
                  </>
                )}
                {sent && (
                  <>
                    <p className={foCss.form__success}>
                      Thank you, we will be in touch soon!
                    </p>
                  </>
                )}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </form>

        <img
          alt="Artistic view of the console with sub-queries"
          className={ilCss.illustration}
          height={394}
          src="/img/pages/enterprise/banner.svg"
          width={900}
        />
      </div>
    </section>
  )
}

const Highlights = () => {
  const items: HighlightItem[] = [
    {
      title: "Managed QuestDB",
      description: "Hosted, managed and monitored by us",
      image: <ManagedQuestdbIcon width="90" height="90" />,
      imageTitle: "Postgres logo",
    },
    {
      title: "Elastic solution",
      description: "Scalable QuestDB instances in a few steps",
      image: <ElasticSolutionIcon width="90" height="90" />,
      imageTitle: "Postgres logo",
    },
    {
      title: "High availability",
      description: "Multi-node replicas with automated deployments",
      image: <HighAvailabilityIcon width="90" height="90" />,
      imageTitle: "Postgres logo",
    },
    {
      title: "High performance",
      description: "Real-time SQL analytics optimized for time series",
      image: <HighPerformanceIcon width="90" height="90" />,
      imageTitle: "Postgres logo",
    },
    {
      title: "Security",
      description: "Built with industry-standard security in mind",
      image: <SecurityIcon width="90" height="90" />,
      imageTitle: "Postgres logo",
    },
  ]

  return (
    <section
      className={clsx(seCss["section--inner"], seCss["section--column"])}
    >
      <p
        className={clsx(
          seCss.section__subtitle,
          hlCss.highlights__subtitle,
          "text--center",
        )}
      >
        Enjoy all of QuestDB&apos;s core and enterprise features, first
        available on{" "}
        <SvgImage image={<AwsLogo width="50" height="30" />} title="AWS logo" />
      </p>
      <div className={hlCss.highlights}>
        {items.map((item, key) => (
          <div className={flCss.flashy} key={`${item.title}-${key}`}>
            <SvgImage image={item.image} title={item.imageTitle} />
            <h3 className={flCss.flashy__title}>{item.title}</h3>
            <p className={flCss.flashy__content}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const Slack = () => {
  return (
    <section className={seCss["section--inner"]}>
      <div className={slCss.slack}>
        <div className={slCss.slack__text}>
          <div className={slCss.slack__logo}>
            <SvgImage image={<SlackLogo />} title="Slack logo" />
          </div>
          Like to get support and ask questions about QuestDB? Join our
          community with 1000+ developers on Slack!
        </div>
        <div className={slCss.slack__cta}>
          <Button variant="primary" href={customFields.slackUrl}>
            Go to Slack
          </Button>
        </div>
      </div>
    </section>
  )
}

const CloudPage = () => {
  const title = "Cloud"
  const description = ""

  return (
    <Layout canonical="/cloud" description={description} title={title}>
      <Top />
      <Highlights />
      <Slack />
    </Layout>
  )
}

export default CloudPage

import clsx from "clsx"
import React, { useCallback, useState } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import Button from "@theme/Button"
import Chevron from "@theme/Chevron"
import Layout from "../theme/Layout"
import useResizeObserver from "@theme/useResizeObserver"

import caCss from "../css/customers/card.module.css"
import juCss from "../css/customers/jumbotron.module.css"
import quCss from "../css/customers/quote.module.css"
import seCss from "../css/section.module.css"
import _quotes from "../assets/quotes"

// temporary duplication across customer and enterprise page for quote module

const quotes = _quotes.map(({ author, company, logo, role, text }) => {
  const Quote = () => (
    <div key={company} className={quCss.quote}>
      <div className={quCss.quote__symbol} />

      <div className={quCss.quote__logo}>
        <img
          alt={logo.alt}
          className="responsive-image"
          height={logo.height}
          src={logo.src}
          width={logo.width}
          style={{ top: logo.offset ?? 0 }}
        />
      </div>

      <p className={quCss.quote__content}>{text}</p>

      <p className={quCss.quote__author}>
        <span className={quCss.quote__chevron}>&gt;</span>
        {author}
        <br />
        {role}
        ,&nbsp;
        {company}
      </p>
    </div>
  )

  return Quote
})

type BulletProps = {
  index: number
  onClick: (index: number) => void
  page: number
  viewportSize: number
}

const Bullet = ({ index, onClick, page, viewportSize }: BulletProps) => {
  const handleClick = useCallback(() => {
    onClick(index * viewportSize)
  }, [index, onClick, viewportSize])

  return (
    <span
      className={clsx(quCss.controls__pin, {
        [quCss["controls__pin--selected"]]: page === index,
      })}
      onClick={handleClick}
    />
  )
}

const QUOTE_WIDTH = 350

const Customer = () => {
  const title = "Customers"
  const description =
    "Discover how QuestDB is powering the core infrastructure of companies dealing with time-series data"

  const { ref, width } = useResizeObserver<HTMLDivElement>()
  // An "item" is a quote
  // Index in the array of quotes of the item that is "focused"
  const [index, setIndex] = useState(0)
  // How many items we can show on the screen
  const viewportSize = Math.max(1, Math.floor((width ?? 0) / QUOTE_WIDTH))
  // How many items will actually be displayed (can be smaller than viewportSize)
  const viewportCount =
    viewportSize === 0 ? 0 : Math.ceil(quotes.length / viewportSize)
  // Page number
  const page = Math.floor(index / viewportSize)
  // The quotes to show
  const viewportQuotes = quotes.slice(
    page * viewportSize,
    (page + 1) * viewportSize,
  )
  const increaseIndex = useCallback(() => {
    setIndex((index) => Math.min(index + viewportSize, quotes.length - 1))
  }, [viewportSize])
  const decreaseIndex = useCallback(() => {
    setIndex((index) => Math.max(index - viewportSize, 0))
  }, [viewportSize])
  return (
    <Layout canonical="/customers" description={description} title={title}>
      <section className={clsx(seCss.section, seCss["section--odd"])}>
        <div className={juCss.jumbotron}>
          <div className={juCss.jumbotron__left}>
            <h1 className={seCss.section__title}>Success Stories</h1>
            <p
              className={clsx(
                seCss.section__subtitle,
                juCss.jumbotron__subtitle,
              )}
            >
              These are some of the most innovative stories from our users
              highlighting how QuestDB is powering the core infrastructure of
              companies working with time-series data.
            </p>
          </div>
          <div className={juCss.jumbotron__illustration}>
            <img
              alt="People co-working on a dashboard"
              height={274}
              src="/img/pages/customers/top.svg"
              width={250}
            />
          </div>
        </div>
      </section>
      <section
        className={clsx(seCss["section--inner"], seCss["section--column"])}
      >
        <h2 className={quCss.title}>What our users say about QuestDB</h2>

        <div className={quCss.carousel} ref={ref}>
          <TransitionGroup component={null}>
            <CSSTransition key={page} timeout={200} classNames="item">
              <div className={quCss.carousel__group}>
                {viewportQuotes.map((Quote) => (
                  <Quote key={quotes.indexOf(Quote)} />
                ))}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>

        <div className={quCss.controls}>
          <div
            className={clsx(
              quCss["controls__chevron-wrapper"],
              quCss["controls__chevron-wrapper--left"],
              {
                [quCss["controls__chevron-wrapper--hidden"]]: page === 0,
              },
            )}
            onClick={decreaseIndex}
          >
            <Chevron className={quCss.controls__chevron} side="left" />
          </div>

          <div className={quCss.controls__middle}>
            {Array(viewportCount)
              .fill(0)
              .map((_, idx) => (
                <Bullet
                  index={idx}
                  key={idx}
                  onClick={setIndex}
                  page={page}
                  viewportSize={viewportSize}
                />
              ))}
          </div>

          <div
            className={clsx(
              quCss["controls__chevron-wrapper"],
              quCss["controls__chevron-wrapper--right"],
              {
                [quCss["controls__chevron-wrapper--hidden"]]:
                  page === viewportCount - 1,
              },
            )}
            onClick={increaseIndex}
          >
            <Chevron className={quCss.controls__chevron} side="right" />
          </div>
        </div>
      </section>

      <section className={clsx(seCss.section, seCss["section--inner"])}>
        <div className={caCss.card}>
          <div className={caCss.card__illustration}>
            <img
              alt="Yahoo logo"
              height={400}
              src="/img/pages/case-study/yahoo/summary.jpg"
              width={525}
            />
          </div>
          <p className={caCss.card__summary}>
            <img
              alt="Yahoo logo"
              className={caCss.card__logo}
              height={50}
              src="/img/pages/customers/cards/yahoo.svg"
              width={140}
            />
            “We use QuestDB to monitor metrics for autoscaling decisions within
            our ML engine that provides search, recommendation, and
            personalization via models and aggregations on continuously-changing
            data.”
            <em className={caCss.card__author}>
              - <strong>Jon Bratseth</strong>, Yahoo
            </em>
            <Button className={caCss.card__cta} to="/case-study/yahoo/">
              View full case study
            </Button>
          </p>
        </div>
      </section>
      <section className={clsx(seCss.section, seCss["section--inner"])}>
        <div className={caCss.card}>
          <p className={caCss.card__summary}>
            <img
              alt="Toggle.global logo"
              className={caCss.card__logo}
              height={50}
              src="/img/pages/customers/cards/toggle.svg"
              width={140}
            />
            “We switched from InfluxDB to QuestDB to get queries that are on
            average 300x faster utilizing 1/4 of the hardware, without ever
            overtaxing our servers.”
            <em className={caCss.card__author}>
              - <strong>Armenak Mayalian</strong>, Toggle
            </em>
            <Button className={caCss.card__cta} to="/case-study/toggle/">
              View full case study
            </Button>
          </p>
          <div className={caCss.card__illustration}>
            <img
              alt="Comparison of AI and chess to investing"
              height={453}
              src="/img/pages/case-study/toggle/summary.png"
              width={600}
            />
          </div>
        </div>
      </section>
      <section className={clsx(seCss.section, seCss["section--inner"])}>
        <div className={caCss.card}>
          <div className={caCss.card__illustration}>
            <img
              alt="An photo of a cellphone with the Turk Telekom logo"
              src="/img/pages/case-study/turk-telekom/card.png"
            />
          </div>
          <p className={caCss.card__summary}>
            <img
              alt="Türk Telekom logo"
              className={caCss.card__logo}
              height={50}
              src="/img/pages/customers/logos/turk_telekom.svg"
              width={140}
            />
            “QuestDB allows us to query data while writing millions of records.
            It is an excellent database for time series analysis, calculation of
            aggregates and can efficiently store our data.”
            <em className={caCss.card__author}>
              - <strong>Erdem Aydemir</strong>, Innova (Türk Telekom)
            </em>
            <Button className={caCss.card__cta} to="/case-study/turk-telekom/">
              View full case study
            </Button>
          </p>
        </div>
      </section>
      <section className={clsx(seCss.section, seCss["section--inner"])}>
        <div className={caCss.card}>
          <p className={caCss.card__summary}>
            <img
              alt="Sapient Industries logo"
              className={caCss.card__logo}
              height={80}
              src="/img/pages/customers/cards/sapient.svg"
              width={120}
            />
            “Sapient ingests, analyzes and converts billions of data points into
            meaningful insights through AI and machine learning. We chose
            QuestDB for the simplicity of SQL, high-throughput ingestion, and
            PostgreSQL wire compatibility with our tooling.”
            <em className={caCss.card__author}>
              - <strong>Dan Worth</strong>, Sapient Industries
            </em>
            <Button
              className={caCss.card__cta}
              to="/case-study/sapient-industries/"
            >
              View full case study
            </Button>
          </p>
          <div className={caCss.card__illustration}>
            <img
              alt="Logo of Sapient Industries along with an illustration of their analytics dashboard."
              height={360}
              src="/img/pages/case-study/sapient-industries/card.png"
              width={640}
            />
          </div>
        </div>
      </section>
      <section className={clsx(seCss.section, seCss["section--inner"])}>
        <div className={caCss.card}>
          <div className={caCss.card__illustration}>
            <img
              alt="A CNC milling machine built by DATRON"
              height={360}
              src="/img/pages/case-study/datron/summary.png"
              width={640}
            />
          </div>
          <p className={caCss.card__summary}>
            <img
              alt="Datron logo"
              className={caCss.card__logo}
              height={50}
              src="/img/pages/customers/cards/datron.svg"
              width={140}
            />
            “QuestDB offers new possibilities while reducing costs and
            simplifying data analysis.”
            <em className={caCss.card__author}>
              - <strong>Tim Borowski</strong>, DATRON
            </em>
            <Button className={caCss.card__cta} to="/case-study/datron/">
              View full case study
            </Button>
          </p>
        </div>
      </section>
    </Layout>
  )
}

export default Customer

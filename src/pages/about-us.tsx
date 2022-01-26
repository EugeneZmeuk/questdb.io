import React from "react"
import clsx from "clsx"

import paCss from "../css/community/page.module.css"
import seCss from "../css/section.module.css"
import teCss from "../css/about-us/team.module.css"
import ubCss from "../css/about-us/used-by.module.css"
import inCss from "../css/about-us/investors.module.css"
import prCss from "../css/about-us/press.module.css"

import Layout from "../theme/Layout"
import Button from "@theme/Button"

import SvgImage from "../components/SvgImage"

import { CustomerLogo } from "src/components/Customers/types"
import ProductMetrics from "../components/ProductMetrics"

import Logo468Capital from "../assets/img/pages/about-us/468capital.svg"
import SeedcampLogo from "../assets/img/pages/about-us/seedcamp.svg"
import UncorrelatedLogo from "../assets/img/pages/about-us/uncorrelated.svg"
import YCombinatorLogo from "../assets/img/pages/about-us/ycombinator.svg"
import ExternalLink from "../assets/img/external-link.svg"

import pressReleases, { PressRelease } from "../assets/press"

import { investorsColumn1, investorsColumn2 } from "../assets/investors"

type PressItemProps = {
  release: PressRelease
}

const usedByLogos: CustomerLogo[] = [
  {
    src: "/img/pages/customers/logos/airbus.svg",
    alt: "Airbus logo",
    width: 140,
    height: 56,
  },
  {
    src: "/img/pages/customers/logos/kepler.svg",
    alt: "Kepler logo",
    width: 140,
    height: 56,
  },
  {
    src: "/img/pages/customers/logos/turk_telekom.svg",
    alt: "Turk Telekom logo",
    width: 140,
    height: 56,
  },
  {
    src: "/img/pages/customers/logos/yahoo.svg",
    alt: "Yahoo!",
    width: 140,
    height: 56,
  },
]

const Top = () => {
  return (
    <section className={seCss["section--inner"]}>
      <div className={seCss.section__header}>
        <h1
          className={clsx(
            seCss.section__title,
            seCss["section__title--accent"],
            "text--center",
          )}
        >
          We are building the{" "}
          <em className={seCss.section__title__em}>fastest</em> open source
          timeseries database
        </h1>
        <ProductMetrics />
      </div>
    </section>
  )
}

const UsedBy = () => {
  return (
    <section className={clsx(seCss["section--odd"])}>
      <section
        className={clsx(seCss["section--inner"], seCss["section--column"])}
      >
        <div className={seCss.section__header}>
          <p className={clsx(seCss.section__subtitle)}>
            Used by industry leaders in production environments
          </p>
        </div>
        <div className={ubCss.logos}>
          {usedByLogos.map((logo) => (
            <div key={logo.alt} className={ubCss.logo__item}>
              <img alt={logo.alt} height={80} src={logo.src} width={200} />
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

const Investors = () => {
  return (
    <section
      className={clsx(seCss["section--inner"], seCss["section--column"])}
    >
      <div className={(seCss.section__header, seCss.section__header__left)}>
        <h2
          className={clsx(seCss.section__title, seCss["section__title--wide"])}
        >
          Investors
        </h2>
        <p className={clsx(seCss.section__subtitle)}>
          We&apos;ve raised over $15M in funding, backed by leading enterprise
          VCs and open source founders/executives.
        </p>
      </div>
      <div className={inCss.investors}>
        <div className={inCss.investors__logos}>
          <SvgImage
            image={<Logo468Capital width="200" height="46" />}
            title="468 Capital"
          />
          <SvgImage
            image={<UncorrelatedLogo width="200" height="48" />}
            title="Uncorrelated Ventures"
          />
          <SvgImage
            image={<YCombinatorLogo width="200" height="42" />}
            title="Y Combinator"
          />
          <SvgImage
            image={
              <SeedcampLogo
                width="180"
                height="54"
                style={{ marginTop: "-8px" }}
              />
            }
            title="Seedcamp"
          />
        </div>

        <div className={inCss.investors__col}>
          {investorsColumn1.map((investor) => (
            <div className={inCss.investor} key={investor.name}>
              <h3 className={inCss.investor__name}>{investor.name}</h3>
              <p className={inCss.investor__position}>{investor.position}</p>
            </div>
          ))}
        </div>

        <div className={inCss.investors__col}>
          {investorsColumn2.map((investor) => (
            <div className={inCss.investor} key={investor.name}>
              <h3 className={inCss.investor__name}>{investor.name}</h3>
              <p className={inCss.investor__position}>{investor.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Team = () => {
  return (
    <section className={clsx(seCss["section--odd"])}>
      <section
        className={clsx(seCss["section--inner"], seCss["section--column"])}
      >
        <h2
          className={clsx(seCss.section__title, seCss["section__title--wide"])}
        >
          The QuestDB team
        </h2>
        <div className={clsx(paCss.flex__section, teCss.team__people)}>
          <div className={clsx(paCss.half__section, teCss.team__people__text)}>
            <p>
              QuestDB is a remote-first company, with regional offices in
              London, Berlin and San Francisco.
            </p>
            <p>
              Our team is building the fastest open-source timeseries database
              from scratch and produces all of the components in-house. We are
              performance-obsessed and strive to create a product that
              developers want.
            </p>
            <p>Here&apos;s what our team say about working at QuestDB:</p>
            <div className={teCss.team__articles}>
              <div className={teCss.team__article}>
                <h4 className={teCss.team__article__title}>
                  <a href="/blog/2021/11/09/miguel-arregui-working-at-questdb">
                    Why I joined QuestDB as a core database engineer
                  </a>
                </h4>
                <div className={teCss.team__article__details}>
                  <div className={teCss.team__article__image}>
                    <img
                      src="/img/pages/about-us/miguel.png"
                      alt="Miguel Arregui photo"
                      width="50"
                      height="50"
                    />
                  </div>
                  <div className={teCss.team__article__text}>
                    <p className={teCss.team__article__author}>
                      Miguel Arregui
                    </p>
                    <p className={teCss.team__article__position}>
                      Core database engineer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={clsx(paCss.half__section, teCss.team__people__photo)}>
            <img
              src="/img/pages/about-us/team.jpg"
              alt="QuestDB team"
              width="522"
              height="300"
              className={teCss.team__people__photo__img}
            />
          </div>
        </div>
        <div className={teCss.team__work}>
          <div className={teCss.team__work__text}>
            We&apos;re hiring passionate talents to join us in building the
            fastest open source time series database!
          </div>
          <div className={teCss.team__work__cta}>
            <Button variant="primary" to="/careers">
              See openings
            </Button>
          </div>
        </div>
      </section>
    </section>
  )
}

const PressItem = ({ release }: PressItemProps) => (
  <a
    className={prCss.press_release}
    key={release.url}
    href={release.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 className={prCss.press_release__title}>{release.title}</h3>
    <div className={prCss.press_release__details}>
      <p className={prCss.press_release__details__author}>{release.author}</p>
      <SvgImage
        image={<ExternalLink />}
        title={`URL for ${String(release.title)}`}
      />
    </div>
  </a>
)

const Press = () => {
  return (
    <section
      className={clsx(seCss["section--inner"], seCss["section--column"])}
    >
      <h2 className={clsx(seCss.section__title, seCss["section__title--wide"])}>
        Press
      </h2>
      <div className={clsx(prCss.press, prCss["press--col3"])}>
        {pressReleases.map((item) => (
          <PressItem key={item.url} release={item} />
        ))}
      </div>
    </section>
  )
}

const AboutUsPage = () => {
  const title = "About us"
  const description = ""

  return (
    <Layout canonical="/about-us" description={description} title={title}>
      <Top />
      <UsedBy />
      <Investors />
      <Team />
      <Press />
    </Layout>
  )
}

export default AboutUsPage

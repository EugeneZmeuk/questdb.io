import clsx from "clsx"
import React, { useCallback, useRef } from "react"

import Button from "@theme/Button"
import Layout from "../theme/Layout"

import caCss from "../css/careers/card.module.css"
import joCss from "../css/careers/job.module.css"
import liCss from "../css/careers/list.module.css"
import seCss from "../css/section.module.css"

const CareersPage = () => {
  const title = "Careers at QuestDB"
  const description =
    "Join us at QuestDB to build breakthrough technology that will power the infrastructure of tomorrow."
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const handleClick = useCallback(() => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [titleRef])

  return (
    <Layout canonical="/careers" description={description} title={title}>
      <section
        className={clsx(seCss["section--inner"], seCss["section--center"])}
      >
        <div className={caCss.card}>
          <div className={caCss.card__side}>
            <h1 className={caCss["card__title--important"]}>Careers</h1>
            <p className={caCss.card__content}>
              We help developers handle explosive amounts of data while getting
              them started in just a few minutes with the fastest and most
              accessible time series database.
            </p>
            <Button className={caCss.card__cta} onClick={handleClick}>
              Current openings
            </Button>
          </div>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
            )}
          >
            <img
              alt="Illustration of team collaboration"
              height={201}
              src="/img/pages/careers/teamCollaboration.svg"
              width={305}
            />
          </div>
        </div>
        <div className={clsx(caCss.card, caCss["card--reverse"])}>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
              caCss["card__side--baseline"],
            )}
          >
            <img
              alt="Illustration of team spirit"
              height={230}
              src="/img/pages/careers/teamSpirit.svg"
              width={305}
            />
          </div>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title}>Working at QuestDB</h2>
            <p className={caCss.card__content}>
              We hire talented and passionate people who share our mission to
              empower developers to solve their problems with data. We are
              building breakthrough technology to power the infrastructure of
              tomorrow
            </p>
            <ul className={liCss.list}>
              <li className={liCss.list__item}>
                We are a company with thousands of users; our mission is to
                empower them
              </li>
              <li className={liCss.list__item}>
                We invest in a culture that promotes ownership, autonomy and
                independent thinking
              </li>
              <li className={liCss.list__item}>
                We have transparent leadership and value employees’ strategic
                inputs
              </li>
              <li className={liCss.list__item}>
                Our team is ambitious and tackles the most difficult problems at
                the deepest data infrastructure layer
              </li>
            </ul>
          </div>
        </div>
        <div className={caCss.card}>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title} ref={titleRef}>
              Current openings
            </h2>
          </div>
          <div className={clsx(caCss.card__side, caCss["card__side--center"])}>
            <a className={joCss.job} href="core-database-engineer/">
              <h3 className={joCss.job__title}>Core Database Engineers</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="developer-in-test/">
              <h3 className={joCss.job__title}>Developers in Test</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="developer-relations-engineer/">
              <h3 className={joCss.job__title}>
                Developer Relations Engineers
              </h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="senior-backend-engineer-python/">
              <h3 className={joCss.job__title}>Backend Engineers (Python)</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="senior-cloud-engineer/">
              <h3 className={joCss.job__title}>Cloud Engineers</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="people-and-talent-acquisition/">
              <h3 className={joCss.job__title}>People & Talent Acquisition</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
            <a className={joCss.job} href="technical-content-writer/">
              <h3 className={joCss.job__title}>Technical Content Writers</h3>
              <p className={joCss.job__location}>Remote</p>
              <span className={joCss.job__cta}>
                Details&nbsp;
                <img
                  alt="Right arrow"
                  height={20}
                  src="/img/pages/careers/arrowRight.svg"
                  width={20}
                />
              </span>
            </a>
          </div>
        </div>
        <div className={clsx(caCss.card, caCss["card--reverse"])}>
          <div
            className={clsx(
              caCss.card__side,
              caCss["card__side--illustration"],
              caCss["card__side--baseline"],
            )}
          >
            <img
              alt="Illustration of a developer with efficient"
              height={230}
              src="/img/pages/careers/timeseriesApplication.svg"
              width={305}
            />
          </div>
          <div className={caCss.card__side}>
            <h2 className={caCss.card__title}>What we offer</h2>
            <ul className={liCss.list}>
              <li className={liCss.list__item}>
                Generous equity options package
              </li>
              <li className={liCss.list__item}>Flexible working hours</li>
              <li className={liCss.list__item}>100% remote</li>
              <li className={liCss.list__item}>
                Freedom of choice for your technical equipment
              </li>
              <li className={liCss.list__item}>
                Wonderful, highly qualified colleagues
              </li>
              <li className={liCss.list__item}>
                Truly international: more than 10 different nationalities
              </li>
              <li className={liCss.list__item}>
                A transparent, collaborative & inclusive culture
              </li>
              <li className={liCss.list__item}>
                Exciting opportunities for career progression as we grow
              </li>
              <li className={liCss.list__item}>
                Little to zero controls combined with autonomous work where you
                set your own pace in a collaborative environment
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CareersPage

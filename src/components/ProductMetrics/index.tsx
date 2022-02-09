import React from "react"
import { usePluginData } from "@docusaurus/useGlobalData"

import pmCss from "../../css/product-metrics/product-metrics.module.css"
import SvgImage from "../SvgImage"

import GithubLogo from "../../assets/img/github.svg"
import SlackLogo from "../../assets/img/slack.svg"
import DatabaseLogo from "../../assets/img/database.svg"
import QuestDBLogo from "../../assets/img/questdb.svg"

type Repository = {
  repo: {
    stargazers_count: number
  }
}

const numberWithCommas = (x: number) => {
  const rounded = Math.floor(x / 100) * 100
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const ProductMetrics = () => {
  const { repo } = usePluginData<Repository>("fetch-repo")
  const { contributorsCount } = usePluginData<{ contributorsCount: number }>(
    "fetch-contributors-count",
  )

  return (
    <div className={pmCss["product-metrics"]}>
      <div className={pmCss["product-metric"]}>
        <div className={pmCss["product-metric__content"]}>
          <SvgImage
            image={<GithubLogo width="60" height="60" />}
            title="Github logo"
          />
          <div className={pmCss["product-metric__content__text"]}>
            <h3 className={pmCss["product-metric__content__text__header"]}>
              {numberWithCommas(repo.stargazers_count)}+
            </h3>
            <p className={pmCss["product-metric__content__text__description"]}>
              stargazers
            </p>
          </div>
        </div>
      </div>
      <div className={pmCss["product-metric"]}>
        <div className={pmCss["product-metric__content"]}>
          <SvgImage
            image={<SlackLogo width="60" height="60" />}
            title="Slack logo"
          />
          <div className={pmCss["product-metric__content__text"]}>
            <h3 className={pmCss["product-metric__content__text__header"]}>
              {numberWithCommas(1100)}+
            </h3>
            <p className={pmCss["product-metric__content__text__description"]}>
              developers
            </p>
          </div>
        </div>
      </div>
      <div className={pmCss["product-metric"]}>
        <div className={pmCss["product-metric__content"]}>
          <SvgImage
            image={<QuestDBLogo width="60" height="60" />}
            title="QuestDB logo"
          />
          <div className={pmCss["product-metric__content__text"]}>
            <h3 className={pmCss["product-metric__content__text__header"]}>
              {contributorsCount}
            </h3>
            <p className={pmCss["product-metric__content__text__description"]}>
              contributors
            </p>
          </div>
        </div>
      </div>
      <div className={pmCss["product-metric"]}>
        <div className={pmCss["product-metric__content"]}>
          <SvgImage
            image={<DatabaseLogo width="80" height="80" />}
            title="Database logo"
          />
          <div className={pmCss["product-metric__content__text"]}>
            <h3 className={pmCss["product-metric__content__text__header"]}>
              Fastest
            </h3>
            <p className={pmCss["product-metric__content__text__description"]}>
              growing TSDB on DB-Engines
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductMetrics

import React from "react"
import clsx from "clsx"

import Button from "@theme/Button"
import Layout from "../Layout"
import TutorialPostItem from "@theme/TutorialPostItem"

import seCss from "../../css/section.module.css"
import tutorials, { FeatureType, Tutorial } from "../../assets/tutorials"
import styles from "./styles.module.css"

type Props = Readonly<{
  items: Tutorial[]
}>

function renderCards(cards: Tutorial[]) {
  return cards.map(({ content }) => {
    const Content = (content as any) as React.ComponentType<{}>
    const isExternal = typeof Content !== "function"

    return (
      <TutorialPostItem
        key={content.metadata.permalink}
        frontMatter={content.frontMatter}
        isExternal={isExternal}
        isTutorialPage
        metadata={content.metadata}
      >
        {isExternal ? undefined : <Content />}
      </TutorialPostItem>
    )
  })
}

function TutorialListPage(props: Props) {
  const all = [...props.items, ...tutorials].sort(
    (a, b) =>
      new Date(b.content.metadata.date).getTime() -
      new Date(a.content.metadata.date).getTime(),
  )
  const featuredResources = all.filter(
    ({ content }) => content.frontMatter.featureType === FeatureType.RESOURCE,
  )

  const featuredComparisons = all.filter(
    ({ content }) => content.frontMatter.featureType === FeatureType.COMPARISON,
  )

  const cards = all.filter(
    ({ content }) => content.frontMatter.featureType == null,
  )
  const description =
    "Content from the QuestDB team and community contributors for learning about time series analytics, visualization, integrations, and example applications using QuestDB."

  return (
    <Layout
      canonical="/tutorial"
      description={description}
      title="Tutorials and community resources for working with time series data"
      wrapperClassName="blog-wrapper"
    >
      <section className={clsx(seCss.section, seCss["section--odd"])}>
        <div className={styles.jumbotron}>
          <div className={styles.jumbotron__left}>
            <h1 className={seCss.section__title}>
              Tutorials and community resources
            </h1>
            <p
              className={clsx(
                seCss.section__subtitle,
                styles.jumbotron__subtitle,
              )}
            >
              {description}
            </p>
            <Button
              className={styles.jumbotron__cta}
              href="https://github.com/questdb/questdb.io/issues/new?labels=Tutorial&template=submit-a-tutorial.md"
            >
              Submit content
            </Button>
          </div>
        </div>
      </section>

      <div className="container margin-vert--lg">
        {featuredComparisons.length > 0 && (
          <>
            <h2 className={styles.cards__title}>
              Comparing time-series databases
            </h2>
            <div className="row">
              <main className={clsx("col", styles.cards__container)}>
                {renderCards(featuredComparisons)}
              </main>
            </div>
          </>
        )}

        {featuredResources.length > 0 && (
          <>
            <h2 className={styles.cards__title}>Featured tutorials</h2>
            <div className="row">
              <main className={clsx("col", styles.cards__container)}>
                {renderCards(featuredResources)}
              </main>
            </div>
          </>
        )}

        <h2 className={styles.cards__title}>All tutorials and resources</h2>
        <div className="row">
          <main className={clsx("col", styles.cards__container)}>
            {renderCards(cards)}
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default TutorialListPage

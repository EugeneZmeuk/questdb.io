const visit = require("unist-util-visit")
const ssrTemplate = require("./src/internals/ssr.template")
const consts = require("./src/config/consts")
const customFields = require("./src/config/customFields")
const math = require("remark-math")
const katex = require("rehype-katex")

function variable() {
  const RE_VAR = /{@([\w-_]+)@}/g
  const getVariable = (full, partial) =>
    partial ? customFields[partial] : full

  function textVisitor(node) {
    node.value = node.value.replace(RE_VAR, getVariable)
  }

  function linkVisitor(node) {
    node.url = node.url.replace(RE_VAR, getVariable)

    if (node.title) {
      node.title = node.title.replace(RE_VAR, getVariable)
    }
  }

  function transformer(ast) {
    visit(ast, "text", textVisitor)
    visit(ast, "code", textVisitor)
    visit(ast, "link", linkVisitor)
  }

  return transformer
}

const config = {
  title: "QuestDB: the database for time series",
  tagline: "QuestDB is the fastest open source time series database",
  url: `https://${consts.domain}`,
  baseUrl: "/",
  baseUrlIssueBanner: false,
  favicon: "/img/favicon.png",
  organizationName: "QuestDB",
  projectName: "questdb",
  customFields: customFields,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  plugins: [
    require.resolve("./plugins/fetch-latest-release/index"),
    require.resolve("./plugins/fetch-repo/index"),
    require.resolve("./plugins/fetch-contributors-count/index"),
    require.resolve("./plugins/webpack-ts/index"),
    require.resolve("./plugins/optimize/index"),
    require.resolve("./plugins/manifest/index"),
    require.resolve("./plugins/delay-code-block-appearance"),
    [
      require.resolve("./plugins/tutorial/compiled/index"),
      {
        remarkPlugins: [variable, math],
        rehypePlugins: [katex],
      },
    ],
    [
      "@docusaurus/plugin-pwa",
      {
        pwaHead: [
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.webmanifest",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#d14671",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "#21222c",
          },
        ],
      },
    ],
  ],
  themeConfig: {
    announcementBar: {
      id: "github-star",
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: "/img/og.gif",
    gtag: {
      trackingID: "GTM-PVR7M2G",
      anonymizeIP: true,
    },
    prism: {
      defaultLanguage: "questdb-sql",
      additionalLanguages: ["rust", "csharp", "julia", "cpp", "java"],
      theme: require("./src/internals/prism-github"),
      darkTheme: require("./src/internals/prism-dracula"),
    },
    algolia: {
      apiKey: "b2a69b4869a2a85284a82fb57519dcda",
      indexName: "questdb",
    },
    navbar: {
      title: " ",
      logo: {
        alt: "QuestDB",
        src: "/img/navbar/questdb.svg",
      },
      items: [
        {
          label: "Get Started",
          position: "left",
          items: [
            {
              label: "Docker",
              to: "/docs/get-started/docker/",
            },
            {
              label: "Binaries",
              to: "/docs/get-started/binaries/",
            },
            {
              label: "Homebrew",
              to: "/docs/get-started/homebrew/",
            },
          ],
        },
        {
          label: "Resources",
          position: "left",
          items: [
            {
              label: "Customers",
              to: "/customers",
            },
            {
              label: "Enterprise",
              to: "/enterprise",
            },
            {
              label: "Cloud",
              to: "/cloud",
            },
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "Tutorials",
              to: "/tutorial",
            },
            {
              label: "Careers",
              to: "/careers/",
            },
            {
              label: "About us",
              to: "/about-us/",
            },
          ],
        },
        {
          label: "Community",
          position: "left",
          items: [
            {
              label: "QuestDB Swag",
              to: "/community/",
            },
            {
              label: "GitHub",
              to: customFields.githubUrl,
            },
            {
              label: "Slack",
              to: customFields.slackUrl,
            },
            {
              label: "Stack Overflow",
              to: customFields.stackoverflowUrl,
            },
            {
              label: "Twitter",
              to: customFields.twitterUrl,
            },
          ],
        },
        {
          label: "Documentation",
          to: "/docs/introduction/",
          position: "left",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "QuestDB",
          items: [
            {
              label: "Enterprise",
              to: "/enterprise/",
            },
            {
              label: "Cloud",
              to: "/cloud",
            },
            {
              label: "Customers",
              to: "/customers/",
            },
            {
              label: "Careers",
              to: "/careers/",
            },
            {
              label: "About us",
              to: "/about-us/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: customFields.githubUrl,
            },
            {
              label: "Slack",
              href: customFields.slackUrl,
            },
            {
              label: "Stack Overflow",
              to: customFields.stackoverflowUrl,
            },
            {
              label: "Twitter",
              href: customFields.twitterUrl,
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Documentation",
              to: "/docs/introduction/",
            },
            {
              label: "Tutorials",
              to: "/tutorial/",
            },
            {
              label: "Blog",
              to: "/blog/",
            },
            {
              label: "Roadmap",
              href: `https://github.com/orgs/questdb/projects/1/views/5`,
            },
            {
              label: "Videos",
              to: customFields.videosUrl,
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          remarkPlugins: [variable, math],
          rehypePlugins: [katex],
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: {
          remarkPlugins: [variable, math],
          rehypePlugins: [katex],
          feedOptions: {
            type: "all",
            copyright: customFields.copyright,
          },
          showReadingTime: true,
        },
        sitemap: {
          // Removed: https://github.com/ekalinin/sitemap.js/blob/master/CHANGELOG.md#50-breaking-changes
          // cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "daily",
          priority: 0.7,
          trailingSlash: true,
        },
        theme: {
          customCss: [
            require.resolve("./src/css/katex.min.css"),
            require.resolve("./src/css/_global.css"),
          ],
        },
      },
    ],
  ],
}

module.exports = {
  ...config,
  ssrTemplate: ssrTemplate(config),
}

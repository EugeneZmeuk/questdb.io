type Quote = {
  website: string
  logo: {
    alt: string
    src: string
    height: number
    width: number
    offset?: number
  }
  text: string
  author: string
  role: string
  company: string
}

const quotes: Quote[] = [
  {
    website: "https://www.airbus.com/",
    logo: {
      alt: "Airbus logo",
      src: "/img/pages/customers/cards/airbus.svg",
      height: 56,
      width: 140,
    },
    text:
      "QuestDB is used at Airbus for real-time applications involving hundreds of millions of data points per day. For us, QuestDB is an outstanding solution that meets (and exceeds) our performance requirements.",
    author: "Oliver Pfeiffer",
    role: "Software Architect",
    company: "Airbus",
  },
  {
    website: "https://www.yahoo.com/",
    logo: {
      alt: "Yahoo logo",
      src: "/img/pages/customers/cards/yahoo.svg",
      height: 56,
      width: 140,
    },
    text:
      "We use QuestDB to monitor metrics for autoscaling decisions within our ML engine that provides search, recommendation, and personalization via models and aggregations on continuously changing data.",
    author: "Jon Bratseth",
    role: "VP Architect",
    company: "Yahoo",
  },
  {
    website: "https://www.keplercheuvreux.com/en/",
    logo: {
      alt: "Kepler logo",
      src: "/img/pages/customers/cards/kepler.svg",
      height: 56,
      width: 140,
    },
    text:
      "When we set out to design the next generation of our execution platform, one of our requirements was large-scale model calibration based on real-time market data streams. QuestDB allows us to derive quick insights on live and historical data that would not be achievable with other open source time series databases.",
    author: "Jean-Francois Perreton",
    role: "Head of Algo Quant",
    company: "Kepler Cheuvreux",
  },
  {
    website: "https://aquis.eu/",
    logo: {
      alt: "Aquis Exchange logo",
      src: "/img/pages/customers/cards/aquis.svg",
      height: 30,
      width: 100,
      offset: 5,
    },
    text:
      "QuestDB is a time series database truly built by developers for developers. We found that QuestDB provides a unicorn solution to handle extreme TPS while also offering a simplified SQL programming interface.",
    author: "Viet Lee",
    role: "CTO",
    company: "Aquis Exchange",
  },
  {
    website: "https://www.publicissapient.com/",
    logo: {
      alt: "Sapient logo",
      src: "/img/pages/customers/cards/sapient.svg",
      height: 28,
      width: 140,
    },
    text:
      "Sapient ingests, analyzes and converts billions of data points into meaningful insights through AI and machine learning. We chose QuestDB for the simplicity of SQL, high-throughput ingestion, and PostgreSQL wire compatibility with our tooling.",
    author: "Dan Worth",
    role: "Principal Software Engineer",
    company: "Sapient Industries",
  },
  {
    website: "https://syndica.io",
    logo: {
      alt: "Syndica logo",
      src: "/img/pages/customers/cards/syndica.svg",
      height: 30,
      width: 113,
    },
    text:
      "QuestDB outperforms every database we have tested and delivered a 10x improvement in querying speed. It has become a critical piece of our infrastructure.",
    author: "Ahmed Abbasi",
    role: "Co-Founder/CEO",
    company: "Syndica",
  },
  {
    website: "https://www.tqsintegration.com",
    logo: {
      alt: "TQS Integration logo",
      src: "/img/pages/customers/cards/tqs-integration.svg",
      height: 56,
      width: 140,
    },
    text:
      "TQS Integration uses QuestDB in data architecture solutions for clients in the Life Science, Pharmaceutical, Energy, and Renewables industries. We use QuestDB when we require a time series database that’s simple and efficient for data collection, contextualization, visualization, and analytics.",
    author: "Holger Amort",
    role: "Senior Data Scientist",
    company: "TQS Integration",
  },
  {
    website: "https://www.ably.io/",
    logo: {
      alt: "Ably logo",
      src: "/img/pages/customers/cards/ably.svg",
      height: 46,
      width: 120,
    },
    text:
      "QuestDB allows me to build tools and systems without having to learn proprietary query languages while maintaining industry-leading performance and a straightforward setup.",
    author: "Ben Gamble",
    role: "Head of Dev Rel",
    company: "Ably",
  },
  {
    website: "https://toggle.ai/",
    logo: {
      alt: "Toggle logo",
      src: "/img/pages/customers/cards/toggle.svg",
      height: 56,
      width: 140,
    },
    text:
      "We switched from InfluxDB to QuestDB to get queries that are on average 300x faster utilizing 1/4 of the hardware, without ever overtaxing our servers.",
    author: "Armenak Mayalian",
    role: "CTO",
    company: "Toggle",
  },
  {
    website: "https://www.turktelekom.com.tr/en",
    logo: {
      alt: "Türk Telekom logo",
      src: "/img/pages/customers/logos/turk_telekom.svg",
      height: 56,
      width: 140,
    },
    text:
      "QuestDB allows us to query data while writing millions of records. It is an excellent database for time series analysis and can efficiently store our data. QuestDB’s community is constantly growing and its popularity is on the rise.",
    author: "Erdem Aydemir",
    role: "Software Engineer",
    company: "Innova (Türk Telekom)",
  },
  {
    website: "https://www.samtec.com/",
    logo: {
      alt: "Samtec logo",
      src: "/img/pages/customers/cards/samtec.svg",
      height: 56,
      width: 140,
    },
    text:
      "QuestDB is the most promising open source platform for time series analytics. It's thoughtfully designed to be both wicked fast and easy to use.",
    author: "Nick Slocum",
    role: "Senior Software Engineer",
    company: "Samtec",
  },
  {
    website: "https://www.biba.uni-bremen.de/en/institute/infrastructure.html",
    logo: {
      alt: "BIBA logo",
      src: "/img/pages/customers/cards/biba.svg",
      height: 56,
      width: 140,
    },
    text:
      "At BIBA, we leverage QuestDB in IoT and Industrial Automation. Aside from out-of-the-box readiness, the performance is fantastic, and the ease of usage provides us a path to perform faster and better analyses.",
    author: "Shan Desai",
    role: "Research Scientist",
    company: "BIBA",
  },
]

export default quotes

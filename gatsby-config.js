const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  siteMetadata: {
    title: `Gatsby About Me`,
    author: `Les Orchard <me@lmorchard.com>`,
    description: `About me page`,
    siteUrl: `https://lmorchard.com/`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages/`,
      },
    },
    {
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/content/pages/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve("./src/layouts/default.js"),
        },
      },
    },
    {
      resolve: "gatsby-source-feedparser",
      options: {
        name: "LMOBlog",
        url: `https://blog.lmorchard.com/index.rss`,
      },
    },
    {
      resolve: "gatsby-source-feedparser",
      options: {
        name: "LMOTyping",
        url: `https://typing.lmorchard.com/feed/index.xml`,
      },
    },
    {
      resolve: "gatsby-source-feedparser",
      options: {
        name: "Decafbad",
        url: `https://decafbad.com/blog/atom.xml`,
      },
    },
    {
      resolve: "gatsby-source-feedparser",
      options: {
        name: "Pinboard",
        url: `https://feeds.pinboard.in/rss/u:deusx/`,
      },
    },
  ],
};

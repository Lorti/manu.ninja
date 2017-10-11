module.exports = {
  siteMetadata: {
    title: 'manu.ninja | Frond-End Development, Games and Digital Art',
    description:
      'manu.ninja is the personal blog of Manuel Wieser, where he talks about front-end development, web development, coding, games and digital art',
    siteUrl: 'https://manu.ninja',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          //   'gatsby-remark-autolink-headers',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        generator: 'Gatsby',
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(({ node: post }) => {
                return Object.assign({}, post.frontmatter, {
                  description: post.excerpt,
                  url: site.siteMetadata.siteUrl + post.frontmatter.path,
                  custom_elements: [{ 'content:encoded': post.html }],
                })
              })
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] }
              ) {
                edges {
                  node {
                    html
                    excerpt
                    frontmatter {
                      title
                      path
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/feed.xml',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-68912237-1',
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://manu.ninja`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        lang: 'en',
        name: 'manu.ninja | Frond-End Development, Games and Digital Art',
        short_name: 'manu.ninja',
        description:
          'manu.ninja is the personal blog of Manuel Wieser, where he talks about front-end development, web development, coding, games and digital art',
        display: 'standalone',
        start_url: '/?utm_source=homescreen',
        theme_color: '#f58231',
        background_color: '#fff',
        icons: [
          {
            // Everything in '/static' will be copied to an equivalent directory in '/public'.
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-offline',
  ],
}

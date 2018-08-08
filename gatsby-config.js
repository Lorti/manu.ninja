module.exports = {
  siteMetadata: {
    title: 'manu.ninja | Front-End Development, Games and Digital Art',
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
          // Keep this in `package.json`, as we'll use it's `github-slugger` dependency.
          // 'gatsby-remark-autolink-headers',

          // Find a way to handle (relative) social media images and use these packages.
          // 'gatsby-remark-copy-linked-files',
          // {
          //   resolve: 'gatsby-remark-images',
          //   options: {
          //     maxWidth: 960,
          //     linkImagesToOriginal: false,
          //   },
          // },

          'gatsby-remark-prismjs',
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://manu.ninja`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-68912237-1',
        anonymize: true,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        lang: 'en',
        name: 'manu.ninja | Front-End Development, Games and Digital Art',
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
          {
            src: '/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
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
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    path
                    external
                  }
                }
              }
            }
            allSitePage(filter: {component: {regex: "/(category|pages|tag)/"}}) {
              edges {
                node {
                  path
                  component
                }
              }
            }
          }
        `,
        serialize: ({ site, allMarkdownRemark, allSitePage }) => {
          const posts = allMarkdownRemark.edges
            .filter(edge => !edge.node.frontmatter.external)
            .map(edge => edge.node.frontmatter.path)

          const pages = allSitePage.edges.map(edge => edge.node.path)

          return [].concat(posts, pages).map(path => {
            return {
              url: site.siteMetadata.siteUrl + path,
              lastmodISO: new Date().toISOString(),
            }
          })
        },
      },
    },
    'gatsby-plugin-offline',
  ],
}

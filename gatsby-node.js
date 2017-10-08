const path = require('path')

const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`)
  const posts = {}

  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!posts[tag]) {
          posts[tag] = []
        }
        posts[tag].push(node)
      })
    }
  })

  createPage({
    path: '/tags',
    component: tagTemplate,
    context: {
      posts,
    },
  })

  Object.keys(posts).forEach(tagName => {
    const post = posts[tagName]
    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        posts,
        post,
        tag: tagName,
      },
    })
  })
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const blogPostTemplate = path.resolve(`src/templates/post.js`)

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            excerpt(pruneLength: 250)
            html
            id
            frontmatter {
              date
              path
              title
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    createTagPages(createPage, posts)

    posts.forEach(({ node }, index) => {
      let related = []
      posts.forEach(post => {
        if (node.frontmatter.path !== post.node.frontmatter.path) {
          const matches = node.frontmatter.tags.filter(tag => {
            return post.node.frontmatter.tags.includes(tag)
          })
          const score = matches.length
          if (score) {
            related.push(Object.assign({}, post, { score }))
          }
        }
      })
      related = related.sort((a, b) => b.score - a.score)
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {
          related,
        },
      })
    })
  })
}

exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === 'build-html') {
    config.loader('null', {
      test: /webfontloader/,
      loader: 'null-loader',
    })
  }
}

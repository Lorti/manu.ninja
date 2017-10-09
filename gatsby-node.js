const path = require('path')

const createCategories = (createPage, edges) => {
  const template = path.resolve(`src/templates/category.js`)
  const posts = {}

  edges.forEach(({ node }) => {
    if (node.frontmatter.categories) {
      node.frontmatter.categories.forEach(category => {
        if (!posts[category]) {
          posts[category] = []
        }
        posts[category].push(node)
      })
    }
  })

  createPage({
    path: '/categories',
    component: template,
    context: {
      posts,
    },
  })

  Object.keys(posts).forEach(category => {
    createPage({
      path: `/categories/${category}`,
      component: template,
      context: {
        posts,
        category,
      },
    })
  })
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const template = path.resolve(`src/templates/post.js`)

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              path
              title
              date
              categories
              external
              summary
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

    createCategories(createPage, posts)

    posts.forEach(({ node }, index) => {
      let related = []
      posts.forEach(post => {
        if (node.frontmatter.path !== post.node.frontmatter.path) {
          const matches = node.frontmatter.categories.filter(category => {
            return post.node.frontmatter.categories.includes(category)
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
        component: template,
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

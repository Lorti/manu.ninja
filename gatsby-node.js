const fs = require('fs')
const path = require('path')
const fragments = [
  fs.readFileSync(
    path.join(__dirname, 'src/graphql/fragments.graphql'),
    'utf8'
  ),
]

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

const createTags = (createPage, edges) => {
  const template = path.resolve(`src/templates/tag.js`)
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
    component: template,
    context: {
      posts,
    },
  })

  Object.keys(posts).forEach(tag => {
    createPage({
      path: `/tags/${tag}`,
      component: template,
      context: {
        posts,
        tag,
      },
    })
  })
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const template = path.resolve(`src/templates/post.js`)

  return graphql(`
    ${fragments}
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            html
            ...frontmatterFragment
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
    createTags(createPage, posts)

    posts.forEach(a => {
      let related = []
      posts.forEach(b => {
        if (a.node.frontmatter.path !== b.node.frontmatter.path) {
          const alpha = a.node.frontmatter.categories
            .concat(a.node.frontmatter.tags)
            .sort()
          const beta = b.node.frontmatter.categories
            .concat(b.node.frontmatter.tags)
            .sort()
          const matches = alpha.filter(keyword => {
            return beta.includes(keyword)
          })
          const score = matches.length
          if (score > 1) {
            related.push(Object.assign({}, b, { score }))
          }
        }
      })
      related = related.sort((a, b) => b.score - a.score)
      related = related.slice(0, 7)
      createPage({
        path: a.node.frontmatter.path,
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

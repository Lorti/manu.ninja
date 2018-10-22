---
path: /gatsby-and-buttercms
title: Gatsby and ButterCMS
date: 2018-10-22
categories: [coding]
tags: [tools]
thumbnail: /author.jpg
---

Blazing fast modern site generator for React. Go beyond static sites: build blogs, ecommerce sites, full-blown apps, and more with Gatsby.

Add a blog or CMS to your website in minutes. ButterCMS is a headless CMS and blogging platform built for developers.

# Install Gatsby's CLI and create a new site

```bash
npm install --global gatsby-cli
```

```bash
gatsby new gatsby-site https://github.com/gatsbyjs/gatsby-starter-default
```

```bash
gatsby develop
```

<http://localhost:8000/>

# Use a Gatsby source plugin to fetch your ButterCMS blog posts

There are two types of plugins that work within Gatsby’s data system, “source” and “transformer” plugins.

Source plugins “source” data from remote or local locations into what Gatsby calls nodes.

Transformer plugins “transform” data provided by source plugins into new nodes and/or node fields.

https://www.gatsbyjs.org/packages/gatsby-source-buttercms/?=buttercms

```bash
npm install --save gatsby-source-buttercms
```

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-buttercms',
      options: {
        authToken: 'your_api_token'
      }
    }
  ]
}
```

```bash
gatsby develop
```

<http://localhost:8000/___graphql>

```graphql
{
  allButterPost {
    edges {
      node {
        title
        body
      }
    }
  }
}
```

# Add a list of your blog posts

`src/pages/index.js`

```js
import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'

const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
```

```js
import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'

const IndexPage = ({ data }) => {
  const posts = data.allButterPost.edges
    .map(({ node }) => {
      return <Link key={node.id} to={`/${node.slug}`}>{node.title}</Link>
    })

  return <Layout>{posts}</Layout>
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allButterPost {
      edges {
        node {
          id
          slug
          title
        }
      }
    }
  }
`
```

# Add pages for your blog posts

`src/templates/post.js`

```js
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

export default function Template({ data }) {
  const { title, date, body } = data.butterPost
  return (
    <Layout>
      <h1>{title}</h1>
      <h2>{date}</h2>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    butterPost(id: { eq: $id }) {
      title
      date
      body
    }
  }
`
```

`src/templates/gatsby-node.js`

```js
const path = require('path')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const template = path.resolve(`src/templates/post.js`)

  return graphql(`
    {
      allButterPost {
        edges {
          node {
            url
            id
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    result.data.allButterPost.edges.forEach(({ node }) => {
      console.log(node);
      createPage({
        path: `/${node.url}`,
        component: template,
        context: {
          id: node.id
        }
      })
    })
  })
}
```

Add optional context data. Data can be used as arguments to the page GraphQL query. The page "path" is always available as a GraphQL argument.

<https://www.gatsbyjs.org/docs/node-apis/#createPages>
<https://www.gatsbyjs.org/docs/actions/#createPage>

# Add pages for your pages

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-buttercms',
      options: {
        authToken: 'your_api_token',
        pages: [
          'page_slug'
        ]
      }
    }
  ]
}
```

then basically follow the same steps as for your blog posts

# Summary

we've learned how to use a Gatsby source plugin to convert headless CMS data to Gatsby nodes, how to query those nodes with GraphQL and create pages from it

---
path: /gatsby-and-buttercms
title: Gatsby and ButterCMS
date: 2018-11-20
categories: [coding]
tags: [tools]
thumbnail: /author.jpg
---

Learn how to build a Gatsby blog using ButterCMS. The code examples in this article let you combine Gatsby and ButterCMS in just a few minutes, no matter if you are a beginner or an expert.

## Why Gatsby and ButterCMS? 

Gatsby is a static site generator based on React and GraphQL. ButterCMS is a headless CMS and blogging platform. What does that mean and why should you use them?

A static site (HTML, CSS and JavaScript) is fast, secure and flexible. There is no database or server-side code that attackers can exploit. A static site generator pulls data from APIs, databases or files and generates pages using templates. 

As a developer you propably want to write your content as Markdown files. However, if your static site's content has to be managed by non-developers, they'll prefer a CMS. A headless CMS offers a read-only API, that can be read by your static site generator.

Gatsby combines React, GraphQL, webpack and other front-end technologies to provide a great developer experience. It's a great choice if you are already familiar with React and JSX. ButterCMS allows you to add a CMS to your Gatsby sites without having to worry about hosting, security, or performance. You can focus on implementing your front-end.

Now that we know the benefits of Gatsby and ButterCMS, let's get started!

## Setup

First, create a ButterCMS account. You'll be provided with an API token and an example blog post. You'll need both for this tutorial.

Next, install the Gatsby CLI.

```bash
npm install --global gatsby-cli
```

You can then create a new site from the official starting template. If you navigate to the directory and run `gatsby develop`, Gatsby will start a hot-reloading server at 
<http://localhost:8000/>. This way, you don’t have to refresh your page as Gatsby injects new versions of the files that you edited at runtime.

```bash
gatsby new gatsby-site https://github.com/gatsbyjs/gatsby-starter-default
cd gatsby-site
gatsby develop
```

## Posts

When building with Gatsby, you access your data via the query language [GraphQL](https://graphql.org/). There are many official and community plugins that fetch data from remote or local locations and make it available via GraphQL. These plugins are called "source plugins" and there is already a [Gatsby Source Plugin for ButterCMS](https://www.gatsbyjs.org/packages/gatsby-source-buttercms/?=buttercms) you can install.

```bash
npm install --save gatsby-source-buttercms
```

Add the plugin to your `gatsby-config.js` and copy and paste your ButterCMS API token.

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

After this change, you might have to restart the hot-reloading server (`gatsby develop`) before you can test the GraphQL fields and types the plugin is providing.

Head to GraphiQL, the in-browser IDE for exploring GraphQL, at <http://localhost:8000/___graphql> and explore the `butterPost` and `allButterPost` fields.

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

The plugin maps all JSON fields documented in the [Butter CMS API Reference](https://buttercms.com/docs/api/#blog-engine) to GraphQL fields.

## Add a list of your blog posts

Your ButterCMS data can now be queried in any Gatsby page or template. You can start by editing `src/pages/index.js` and adding a list of your blog posts to your home page.

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

### Add pages for your blog posts

Generating a page for each of your posts requires you to create a template and use [Gatsby's Node APIs](https://www.gatsbyjs.org/docs/node-apis), specifically the [`createPages`](https://www.gatsbyjs.org/docs/node-apis/#createPages) API and its [`createPage`](https://www.gatsbyjs.org/docs/actions/#createPage) action.

#### `src/templates/post.js`

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

#### `src/templates/gatsby-node.js`

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

# Categories, Tags, and Authors

Use the `filter` argument against your ButterCMS categories, tags, and authors to feature and filter the content of your blog.

```graphql
{
  allButterPost(filter: {
    tags: {
      elemMatch: {
        slug: { in: "example-tag" }
      }
    }
  }) {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

# Pages

If you want to add ButterCMS pages to your blog, add a list of page slugs to your `gatsby-config.js` and follow the same steps as for your blog posts, using the `butterPage` and `allButterPage` GraphQL fields.

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

ButterCMS automatically generates a slug when you create a new page: A page titled `Example Page` gets an `example-page` slug, which is shown below the page title in the ButterCMS editor.

# Conclusion

We have learned how to use a Gatsby source plugin to convert headless CMS data to Gatsby nodes, how to query those nodes with GraphQL, and how to create pages. This should give you a head start when building a Gatsby blog with ButterCMS.

Where to go from here? You could use what you've learned and add a page that lists your categories and tags. If you already have a lot of content, you might want to add pagination to your list of blog posts. You can do so by using the `limit` and `skip` arguments of the `allButterPost` field in GraphQL.

The [Gatsby Source Plugin for ButterCMS](https://www.gatsbyjs.org/packages/gatsby-source-buttercms/?=buttercms) is an open-source community plugin for Gatsby. If you want to contribute to the source plugin, [open a GitHub pull request](https://github.com/ButterCMS/gatsby-source-buttercms). If you have found a bug, [open a GitHub issue](https://github.com/ButterCMS/gatsby-source-buttercms).

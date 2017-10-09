import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Header from '../components/article/header'
import Content from '../components/article/content'

import Disqus from '../components/disqus'
import Related from '../components/related'

import excerpt from '../utils/excerpt'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data
  const { related } = pathContext
  const description = post.frontmatter.summary || excerpt(post.html)
  return (
    <div className="Column">
      <Helmet>
        <title>{`${post.frontmatter.title} | manu.ninja`}</title>
        <meta name="description" content={description} />
        {post.frontmatter.external && <meta name="robots" content="none" />}
      </Helmet>
      <article className="Article">
        <h1>{post.frontmatter.external}</h1>
        <Header post={post} />
        <Content post={post} />
      </article>
      <Disqus identifier={post.frontmatter.path} />
      <Related posts={related || []} />
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        path
        categories
        date(formatString: "MMM DD, YYYY")
      }
    }
  }
`

import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Header from '../components/article/header'
import Content from '../components/article/content'

import Disqus from '../components/disqus'
import Meta from '../components/meta'
import Related from '../components/related'

import excerpt from '../utils/excerpt'

export default function Template({ data, pathContext }) {
  const { site, markdownRemark: post } = data
  const { related } = pathContext
  const description = post.frontmatter.summary || excerpt(post.html)
  return (
    <div className="Column">
      <Helmet>
        {post.frontmatter.external && <meta name="robots" content="none" />}
      </Helmet>
      <Meta
        title={`${post.frontmatter.title} | manu.ninja`}
        description={description}
        pageUrl={`${site.siteMetadata.siteUrl}${post.frontmatter.path}`}
        imageUrl={
          post.frontmatter.thumbnail &&
          `${site.siteMetadata.siteUrl}${post.frontmatter.thumbnail}`
        }
      />
      <article className="Article">
        <Header post={post} />
        <Content post={post} />
      </article>
      <Disqus identifier={post.frontmatter.path} />
      <Related posts={related || []} />
    </div>
  )
}

export const pageQuery = graphql`
  query PostQuery($path: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        path
        categories
        date(formatString: "MMM DD, YYYY")
        thumbnail
        external
        summary
      }
    }
  }
`

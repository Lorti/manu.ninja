import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Header from '../components/article/header'
import Content from '../components/article/content'
import Disqus from '../components/disqus'
import Related from '../components/related'

import Meta from '../components/meta'
import ArticleSchema from '../components/schema/article'

import excerpt from '../utils/excerpt'

export default function Template({ data, pathContext }) {
  const { site, markdownRemark: post } = data
  const { related } = pathContext

  const title = `${post.frontmatter.title} | manu.ninja`
  const description = post.frontmatter.summary || excerpt(post.html)
  const pageUrl = `${site.siteMetadata.siteUrl}${post.frontmatter.path}`
  const imageUrl = post.frontmatter.thumbnail
    ? `${site.siteMetadata.siteUrl}${post.frontmatter.thumbnail}`
    : `${site.siteMetadata.siteUrl}/share.png`

  return (
    <div className="Column">
      <Helmet>
        {post.frontmatter.external && <meta name="robots" content="none" />}
      </Helmet>
      <Meta
        title={title}
        description={description}
        pageUrl={pageUrl}
        imageUrl={imageUrl}
      />
      <article className="Article">
        <Header post={post} />
        <Content post={post} siteUrl={site.siteMetadata.siteUrl} />
      </article>
      <ArticleSchema
        title={title}
        description={description}
        date={post.frontmatter.date}
        imageUrl={imageUrl}
      />
      <Disqus url={pageUrl} identifier={post.frontmatter.path} />
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
        date(formatString: "MMM DD, YYYY")
        categories
        tags
        summary
        thumbnail
        external
        sharing
      }
    }
  }
`

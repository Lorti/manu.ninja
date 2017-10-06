import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Header from '../components/article/header'

import Disqus from '../components/disqus'
import Related from '../components/related'

import headingLinks from '../utils/headings'

import 'prismjs/themes/prism-okaidia.css'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data
  const { related } = pathContext
  return (
    <div className="Column">
      <Helmet title={`${post.frontmatter.title} | manu.ninja`} />
      <article className="Article">
        <Header post={post} />
        <div
          className="Article-content"
          dangerouslySetInnerHTML={{ __html: headingLinks(post.html) }}
        />
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
        tags
        date(formatString: "MMM DD, YYYY")
        path
      }
    }
  }
`

import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Disqus from '../components/disqus'
import Related from '../components/related'
import Tags from '../components/tags'

import getReadingLength from '../utils/length'
import addHeadingLinks from '../utils/headings'

import 'prismjs/themes/prism-okaidia.css'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data
  const { related } = pathContext
  return (
    <div className="Column">
      <Helmet title={`${post.frontmatter.title} | manu.ninja`} />
      <article className="Article">
        <div className="Article-header u-textCenter">
          <Tags list={post.frontmatter.tags || []} />
          <h1 className="Article-title">{post.frontmatter.title}</h1>
          <p className="Article-date">
            <time dateTime={new Date(post.frontmatter.date).toISOString()}>
              {post.frontmatter.date}
            </time>
            &nbsp;&middot;&nbsp;
            {getReadingLength(post.html)}
          </p>
        </div>
        <div
          className="Article-content"
          dangerouslySetInnerHTML={{ __html: addHeadingLinks(post.html) }}
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
        date(formatString: "MMM DD, YYYY")
        path
        title
        tags
      }
    }
  }
`

import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Related from '../components/related'
import Tags from '../components/tags'

import 'prismjs/themes/prism-okaidia.css'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data
  const { next, prev, related } = pathContext
  return (
    <div className="Column">
      <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
      <Tags list={post.frontmatter.tags || []} />
      <article className="Article">
        <h1 className="Article-title">{post.frontmatter.title}</h1>
        <div
          className="Article-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <Related posts={related || []} />
      {prev && <Link to={prev.frontmatter.path}>{prev.frontmatter.title}</Link>}
      {next && <Link to={next.frontmatter.path}>{next.frontmatter.title}</Link>}
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

import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Tags from '../components/tags'

import 'prismjs/themes/prism-okaidia.css'

export default function Template({ data, pathContext }) {
  const { markdownRemark: post } = data;
  const { next, prev, related } = pathContext;
  return (
    <div className="Column">
      <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
      <article className="Article">
          {related.map(({node}) =>
            <li>{node.frontmatter.title}</li>
          )}
        <h1 className="Article-title">{post.frontmatter.title}</h1>
        <div
          className="Article-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <Tags list={post.frontmatter.tags || []} />
          {prev &&
            <Link to={prev.frontmatter.path}>
              {prev.frontmatter.title}
            </Link>}
          {next &&
            <Link to={next.frontmatter.path}>
              {next.frontmatter.title}
            </Link>}
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

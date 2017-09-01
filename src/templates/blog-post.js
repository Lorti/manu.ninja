import React from 'react'
import Helmet from 'react-helmet'

import 'prismjs/themes/prism-okaidia.css'

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  return (
    <div className="Column">
      <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
      <article className="Article">
        <h1 className="Article-title">{post.frontmatter.title}</h1>
        <div
          className="Article-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
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
      }
    }
  }
`

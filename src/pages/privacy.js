import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default function Privacy({ data }) {
  const page = data.markdownRemark
  return (
    <Layout>
      <div className="Column">
        <div className="Article">
          <div className="article-header u-textCenter">
            <h1 className="Article-title">{page.frontmatter.title}</h1>
          </div>
          <div
            className="Article-content"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    markdownRemark(frontmatter: { path: { eq: "/privacy" } }) {
      html
      frontmatter {
        title
      }
    }
  }
`

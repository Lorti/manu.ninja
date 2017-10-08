import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Introduction from '../components/Introduction'
import Header from '../components/article/header'
import Content from '../components/article/content'

export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <Introduction />
      <div className="Column">
        {posts.map(({ node: post }) => {
          return (
            <article className="Article" key={post.id}>
              <Header post={post} forListing={true} />
              <Content post={post} forListing={true} />
            </article>
          )
        })}
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          html
          frontmatter {
            title
            path
            categories
            date(formatString: "MMM DD, YYYY")
          }
        }
      }
    }
  }
`

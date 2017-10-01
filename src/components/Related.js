import React from 'react'
import Helmet from 'react-helmet'

import Link from 'gatsby-link'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function Related({ posts = [] }) {
  return (
    <div className="Links">
      <h3 className="Links-heading">You may also like…</h3>
      <ul>
        {posts.map(post => {
          return (
            <li className="Links-item">
              <span className="Links-meta">
                {post.node.frontmatter.tags.map(tag => {
                  return (
                    <Link to={`/tags/${tag}`}>
                      {capitalizeFirstLetter(tag)}
                    </Link>
                  )
                })}
              </span>
              <a
                className="Links-link u-truncated"
                href={post.node.frontmatter.path}
                target={post.node.frontmatter.external && '_blank'}
              >
                {post.node.frontmatter.title}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import React from 'react'
import Link from 'gatsby-link'

import mapTag from '../utils/tags.js'

export default function Related({ posts = [] }) {
  return (
    <div className="Links">
      <h3 className="Links-heading">You may also like…</h3>
      <ul>
        {posts.map(post => {
          return (
            <li key={post.node.frontmatter.path} className="Links-item">
              <span className="Links-meta">
                {post.node.frontmatter.tags.map(tag => {
                  return (
                    <Link key={tag} to={`/tags/${tag}`}>
                      {mapTag(tag)}
                    </Link>
                  )
                })}
              </span>
              <Link
                className="Links-link u-truncated"
                to={post.node.frontmatter.path}
                target={post.node.frontmatter.external && '_blank'}
              >
                {post.node.frontmatter.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

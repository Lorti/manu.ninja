import React from 'react'
import Link from 'gatsby-link'

import mapTag from '../utils/taxonomy.js'

export default function Related({ posts = [] }) {
  return (
    <div className="Links">
      <h3 className="Links-heading">You may also like…</h3>
      <ul>
        {posts.map(post => {
          return (
            <li key={post.node.frontmatter.path} className="Links-item">
              <span className="Links-meta">
                {post.node.frontmatter.categories.map(category => {
                  return (
                    <Link key={category} to={`/categories/${category}`}>
                      {mapTag(category)}
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

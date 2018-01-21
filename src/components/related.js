import React from 'react'
import Link from 'gatsby-link'

import mapTag from '../utils/taxonomy.js'

function RelatedLink({ title, path, external, language }) {
  if (external) {
    return (
      <a
        className="Links-link u-truncated"
        href={external}
        hrefLang={language ? language : 'en'}
        target="_blank"
        rel="noopener"
      >
        {title}
      </a>
    )
  }
  return (
    <Link className="Links-link u-truncated" to={path}>
      {title}
    </Link>
  )
}

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
              <RelatedLink
                title={post.node.frontmatter.title}
                path={post.node.frontmatter.path}
                external={post.node.frontmatter.external}
                language={post.node.frontmatter.language}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import React from 'react'
import Helmet from 'react-helmet'

import Link from 'gatsby-link'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function Tags({ pathContext }) {
  const { posts, post, tag } = pathContext
  if (tag) {
    return (
      <div>
        <h1>
          {post.length} post{post.length === 1 ? '' : 's'} tagged with{' '}
          {capitalizeFirstLetter(tag)}
        </h1>
        <ul>
          {post.map(({ id, frontmatter, excerpt }) => {
            return (
              <li key={id}>
                <h1>
                  <Link to={frontmatter.path}>{frontmatter.title}</Link>
                </h1>
                <p>{excerpt}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <h1>Tags</h1>
      <ul className="tags">
        {Object.keys(posts).map(tagName => {
          const tags = posts[tagName]
          return (
            <li key={tagName}>
              <Link to={`/tags/${tagName}`}>
                {capitalizeFirstLetter(tagName)}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

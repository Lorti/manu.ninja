import React from 'react'
import Link from 'gatsby-link'

import Header from '../components/article/header'
import Content from '../components/article/content'

import mapTag from '../utils/taxonomy'

export default function Tags({ pathContext }) {
  const { posts, tag } = pathContext
  if (tag) {
    const list = posts[tag]
    return (
      <div className="Column">
        <div className="Taxonomy">
          <h1 className="Taxonomy__heading u-textCenter">
            <strong>{mapTag(tag)}</strong> ({list.length} Articles)
          </h1>
        </div>
        {list.map(post => {
          return (
            <article className="Article" key={post.id}>
              <Header post={post} forListing={true} />
              <Content post={post} forListing={true} />
            </article>
          )
        })}
      </div>
    )
  }
  return (
    <div className="Column">
      <div className="Taxonomy">
        <h1 className="Taxonomy__heading">Tags</h1>
        <ul>
          {Object.keys(posts).map(tag => {
            const count = posts[tag].length
            return (
              <li key={tag}>
                <Link to={`/tags/${tag}`}>
                  {mapTag(tag)} ({count})
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

import React from 'react'
import Link from 'gatsby-link'

import Header from '../components/article/header'
import Content from '../components/article/content'

import mapTag from '../utils/taxonomy'

export default function Category({ pathContext }) {
  const { posts, category } = pathContext
  if (category) {
    const list = posts[category];
    return (
      <div className="Column">
        <h1>
          {mapTag(category)} ({list.length})
        </h1>
        {list.map((post) => {
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
      <h1>Categories</h1>
      <ul className="Column">
        {Object.keys(posts).map(category => {
          const count = posts[category].length
          return (
            <li key={category}>
              <Link to={`/categories/${category}`}>{mapTag(category)} ({count})</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

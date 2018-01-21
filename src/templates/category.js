import React from 'react'
import Link from 'gatsby-link'

import Content from '../components/article/content'
import Header from '../components/article/header'

import mapTag from '../utils/taxonomy'

export default function Category({ pathContext }) {
  const { posts, category } = pathContext
  if (category) {
    const list = posts[category]
    return (
      <div className="Column">
        <div className="Taxonomy">
          <h1 className="Taxonomy__heading u-textCenter">
            <strong>{mapTag(category)}</strong> ({list.length} Articles)
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
        <h1 className="Taxonomy__heading">Categories</h1>
        <ul>
          {Object.keys(posts)
            .sort()
            .map(category => {
              const count = posts[category].length
              return (
                <li key={category}>
                  <Link to={`/categories/${category}`}>
                    {mapTag(category)} ({count})
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

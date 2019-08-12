import React from 'react'
import { Link } from 'gatsby'

import Meta from '../components/meta'
import Layout from '../components/layout'
import Content from '../components/article/content'
import Header from '../components/article/header'

import mapTag from '../utils/taxonomy'

export default function Category({ pageContext }) {
  const { posts, category } = pageContext
  if (category) {
    const list = posts[category]
    return (
      <Layout>
        <Meta
          title={`Category “${mapTag(category)}”`}
          description={`manu.ninja has ${
            list.length
          } articles in the category “${mapTag(category)}”.`}
        />
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
      </Layout>
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

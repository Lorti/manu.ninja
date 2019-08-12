import React from 'react'
import { Link } from 'gatsby'

import Meta from '../components/meta'
import Layout from '../components/layout'
import Header from '../components/article/header'
import Content from '../components/article/content'

import mapTag from '../utils/taxonomy'

export default function Tags({ pageContext }) {
  const { posts, tag } = pageContext
  if (tag) {
    const list = posts[tag]
    return (
      <Layout>
        <Meta
          title={`Tag “${mapTag(tag)}”`}
          description={`manu.ninja has ${
            list.length
          } articles tagged with “${mapTag(tag)}”.`}
        />
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
      </Layout>
    )
  }
  return (
    <div className="Column">
      <div className="Taxonomy">
        <h1 className="Taxonomy__heading">Tags</h1>
        <ul>
          {Object.keys(posts)
            .sort()
            .map(tag => {
              const count = posts[tag].length
              return (
                <li key={tag}>
                  <Link to={`/tags/${tag}`}>
                    {mapTag(tag) || tag} ({count})
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

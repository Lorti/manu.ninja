import React from 'react'
import Link from 'gatsby-link'

export default function Tags({ list = [] }) {
  return (
    <p className="Article-category">
      {list.map(tag => (
        <Link to={`/tags/${tag}`}>{tag}</Link>
      ))}
    </p>
  )
}

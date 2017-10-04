import React from 'react'
import Link from 'gatsby-link'

import mapTag from '../utils/tags.js'

export default function Tags({ list = [] }) {
  return (
    <p className="Article-category">
      {list.map(tag => (
        <Link key={tag} to={`/tags/${tag}`}>
          {mapTag(tag)}
        </Link>
      ))}
    </p>
  )
}

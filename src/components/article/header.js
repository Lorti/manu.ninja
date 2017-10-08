import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import readingLength from '../../utils/length'
import mapTag from '../../utils/tags'

function Title({ frontmatter, forListing }) {
  if (forListing && frontmatter.external) {
    return (
      <a href={frontmatter.external} target="_blank">
        {frontmatter.title}
      </a>
    )
  }
  if (forListing && frontmatter.path) {
    return <Link to={frontmatter.path}>{frontmatter.title}</Link>
  }
  return <span>{frontmatter.title}</span>
}

function Tags({ tags }) {
  return (
    <p className="Article-category">
      {tags.map(tag => (
        <Link key={tag} to={`/tags/${tag}`}>
          {mapTag(tag)}
        </Link>
      ))}
    </p>
  )
}

export default function Header({ post, forListing }) {
  const { html, frontmatter } = post
  const { date, tags } = frontmatter
  return (
    <div className="Article-header u-textCenter">
      <Tags tags={tags} />

      <h1 className="Article-title">
        <Title frontmatter={frontmatter} forListing={forListing} />
      </h1>

      <p className="Article-date">
        <time dateTime={new Date(date).toISOString()}>{date}</time>
        &nbsp;&middot;&nbsp;
        {readingLength(html)}
      </p>
    </div>
  )
}

Header.propTypes = {
  post: PropTypes.object,
  forListing: PropTypes.bool,
}

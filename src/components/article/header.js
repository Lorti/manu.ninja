import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import readingLength from '../../utils/length'
import mapTag from '../../utils/taxonomy'

function Title({ frontmatter, forListing }) {
  const htmlTitle = frontmatter.htmlTitle || frontmatter.title
  if (forListing && frontmatter.external) {
    return (
      <a
        href={frontmatter.external}
        hrefLang={frontmatter.language ? frontmatter.language : 'en'}
        target="_blank"
        rel="noopener"
        dangerouslySetInnerHTML={{ __html: htmlTitle }}
      />
    )
  }
  if (forListing && frontmatter.path) {
    return (
      <Link
        to={frontmatter.path}
        dangerouslySetInnerHTML={{ __html: htmlTitle }}
      />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: htmlTitle }} />
}

function Category({ categories }) {
  return (
    <p className="Article-category">
      {categories.map(category => (
        <Link key={category} to={`/categories/${category}`}>
          {mapTag(category)}
        </Link>
      ))}
    </p>
  )
}

export default function Header({ post, forListing }) {
  const { html, frontmatter } = post
  const { date, categories } = frontmatter
  return (
    <div className="Article-header u-textCenter">
      <Category categories={categories} />

      <h1 className="Article-title">
        <Title frontmatter={frontmatter} forListing={forListing} />
      </h1>

      <p className="Article-date">
        <time dateTime={new Date(date).toISOString()}>{date}</time> &middot;{' '}
        {readingLength(html)}
      </p>
    </div>
  )
}

Header.propTypes = {
  post: PropTypes.object,
  forListing: PropTypes.bool,
}

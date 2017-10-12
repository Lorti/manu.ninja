import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import excerpt from '../../utils/excerpt'
import headingLinks from '../../utils/headings'

function ContentContent({ html, summary }) {
  if (summary) {
    return <p dangerouslySetInnerHTML={{ __html: summary }} />
  }
  return <p dangerouslySetInnerHTML={{ __html: excerpt(html) }} />
}

function ContentLink({ external, path }) {
  if (external) {
    return <a href={external}>Read more…</a>
  }
  return <Link to={path}>Read more…</Link>
}

export default function Content({ post, forListing }) {
  const { html, frontmatter } = post
  if (forListing) {
    return (
      <div className="Article-content">
        <ContentContent html={post.html} summary={frontmatter.summary} />
        <p className="Article-link">
          <ContentLink
            external={frontmatter.external}
            path={frontmatter.path}
          />
        </p>
      </div>
    )
  }
  return (
    <div
      className="Article-content"
      dangerouslySetInnerHTML={{ __html: headingLinks(html) }}
    />
  )
}

Content.propTypes = {
  post: PropTypes.object,
  forListing: PropTypes.bool,
}

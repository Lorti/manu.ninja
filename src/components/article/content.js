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

function ContentSharing({ url, title }) {
  const link = `https://twitter.com/intent/tweet?
original_referer=${encodeURIComponent(url)}
&text=${title}
&url=${url}
&via=manuelwieser`
  return (
    <p>
      If you liked this article, please consider{' '}
      <a href={link} target="_blank" rel="noopener">
        sharing
      </a>{' '}
      it with your followers.
    </p>
  )
}

function ContentLink({ external, path }) {
  if (external) {
    return <a href={external}>Read more…</a>
  }
  return <Link to={path}>Read more…</Link>
}

export default function Content({ post, siteUrl, forListing }) {
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
    <div className="Article-content">
      <div dangerouslySetInnerHTML={{ __html: headingLinks(html) }} />
      {post.frontmatter.sharing && (
        <ContentSharing
          url={siteUrl + post.frontmatter.path}
          title={post.frontmatter.title}
        />
      )}
    </div>
  )
}

Content.propTypes = {
  post: PropTypes.object,
  forListing: PropTypes.bool,
}

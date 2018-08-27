// https://facebook.github.io/relay/docs/en/fragment-container.html
// https://github.com/gatsbyjs/gatsby/tree/master/examples/gatsbygram

export const siteMetadataFragment = graphql`
  fragment Index_siteMetadata on Site {
    siteMetadata {
      title
      description
      siteUrl
    }
  }
`

export const frontmatterFragment = graphql`
  fragment Index_frontmatter on MarkdownRemark {
    frontmatter {
      title
      htmlTitle
      path
      date(formatString: "MMM DD, YYYY")
      categories
      tags
      summary
      thumbnail
      external
      language
      sharing
    }
  }
`

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
      path
      date(formatString: "MMM DD, YYYY")
      categories
      tags
      summary
      thumbnail
      external
      sharing
    }
  }
`

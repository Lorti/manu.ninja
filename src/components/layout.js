import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Banner from './banner'
import Footer from './footer'
import Meta from './meta'
import PersonSchema from './schema/person'

import '../graphql/fragments'
import '../styles/index.scss'

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          ...Index_siteMetadata
        }
      }
    `}
    render={data => (
      <>
        <Helmet>
          <meta
            name="google-site-verification"
            content="ksUOGNNttZF4FJuFdVLzSvvTEJyh5Leip6UsFAElMSc"
          />
          <link href="//cdnjs.cloudflare.com" rel="dns-prefetch" />
          <link href="//www.google-analytics.com" rel="dns-prefetch" />
        </Helmet>
        <Meta
          title={data.site.metaData.title}
          description={data.site.metaData.description}
          pageUrl={data.site.metaData.siteUrl}
          imageUrl={`${data.site.metaData.siteUrl}/share.png`}
        />
        <div className="Column">
          <Banner />
        </div>
        {this.props.children}
        <div className="Column">
          <Footer />
        </div>
        <PersonSchema imageUrl={`${data.site.metaData.siteUrl}/manu.jpg`} />
      </>
    )}
  />
)

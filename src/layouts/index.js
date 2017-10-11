import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import WebFont from 'webfontloader'

import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Meta from '../components/meta'

import './styles/index.scss'

class TemplateWrapper extends React.Component {
  componentDidMount() {
    WebFont.load({
      google: {
        families: ['Lato:400,400italic,700', 'Oswald:300,700'],
      },
    })
  }
  render() {
    const meta = this.props.data.site.siteMetadata
    return (
      <div>
        <Helmet>
          <meta
            name="google-site-verification"
            content="ksUOGNNttZF4FJuFdVLzSvvTEJyh5Leip6UsFAElMSc"
          />
          <link href="//cdnjs.cloudflare.com" rel="dns-prefetch" />
          <link href="//fonts.googleapis.com" rel="dns-prefetch" />
          <link href="//fonts.gstatic.com" rel="dns-prefetch" />
          <link href="//www.google-analytics.com" rel="dns-prefetch" />
        </Helmet>
        <Meta
          title={meta.title}
          description={meta.description}
          pageUrl={meta.siteUrl}
          imageUrl={`${meta.siteUrl}/share.png`}
        />
        <div className="Column">
          <Banner />
        </div>
        {this.props.children()}
        <div className="Column">
          <Footer />
        </div>
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const pageQuery = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`

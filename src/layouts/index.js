import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import WebFont from 'webfontloader'

import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Meta from '../components/meta'
import PersonSchema from '../components/schema/person'

import '../graphql/fragments'
import './styles/index.scss'

class TemplateWrapper extends React.Component {
  componentDidMount() {
    this.loadFonts()
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
        <PersonSchema imageUrl={`${meta.siteUrl}/manu.jpg`} />
      </div>
    )
  }

  loadFonts() {
    WebFont.load({
      google: {
        families: ['Lato:400,400italic,700', 'Oswald:300,700'],
      },
    })
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const pageQuery = graphql`
  query LayoutQuery {
    site {
      ...Index_siteMetadata
    }
  }
`

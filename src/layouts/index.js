import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import WebFont from 'webfontloader'

import Banner from '../components/Banner'
import Footer from '../components/Footer'

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
        <Helmet
          title={meta.title}
          meta={[{ name: 'description', content: meta.description }]}
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
      }
    }
  }
`

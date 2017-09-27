import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import WebFont from 'webfontloader';

import Banner from '../components/Banner';

import './styles/index.scss'

class TemplateWrapper extends React.Component {
  componentDidMount() {
    WebFont.load({
      google: {
        families: ['Lato:400,400italic', 'Oswald:300,700']
      }
    });
  }
  render() {
    return (
      <div>
        <Helmet
          title="Gatsby Default Starter"
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        />
        <div className="Column">
            <Banner />
        </div>
        <div className="Column">
          {this.props.children()}
        </div>
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

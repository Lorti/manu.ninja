import React from 'react'
import Link from 'gatsby-link'

class Disqus extends React.Component {
  componentDidMount() {
    this.loadDisqus()
  }

  render() {
    return <div id="disqus_thread" />
  }

  updateConfig() {
    const url = this.props.url
    const identifier = this.props.identifier.substring(1)

    window.disqus_config = function() {
      this.page.url = url
      this.page.identifier = identifier
    }
  }

  loadDisqus() {
    this.updateConfig()

    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true })
      return
    }

    const script = document.createElement('script')
    script.src = '//manuninja.disqus.com/embed.js'
    script.setAttribute('data-timestamp', +new Date())
    document.body.appendChild(script)
  }
}

export default Disqus

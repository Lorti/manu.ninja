import React from 'react'
import Link from 'gatsby-link'

class Disqus extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.loadDisqus()
    }
  }

  render() {
    return <div id="disqus_thread" />
  }

  loadDisqus() {
    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true })
      return
    }
    const identifier = this.props.identifier;
    window.disqus_config = function() {
      this.page.url = document.querySelector('link[rel="canonical"]').href
      this.page.identifier = identifier
      console.log(this.page);
    }
    const script = document.createElement('script')
    script.src = '//manuninja.disqus.com/embed.js'
    script.setAttribute('data-timestamp', +new Date())
    document.body.appendChild(script)
  }
}

export default Disqus

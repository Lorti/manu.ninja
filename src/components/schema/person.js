import React from 'react'

export default function Person({ imageUrl }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'http://schema.org/',
        '@type': 'Person',
        name: 'Manuel Wieser',
        honorificSuffix: 'BSc MA',
        image: imageUrl,
        jobTitle: 'Front-End Developer & Digital Artist',
        alumniOf: 'University of Applied Sciences Upper Austria',
        worksFor: {
          '@type': 'Organization',
          name: 'karriere.at',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'Austria',
        },
        email: 'office@manuelwieser.com',
        url: [
          'https://manu.ninja',
          'http://www.manuelwieser.com',
          'https://github.com/Lorti',
          'https://twitter.com/manuelwieser',
        ],
      })}
    </script>
  )
}

import React from 'react'

export default function Article({ title, description, date, imageUrl }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'http://schema.org/',
        '@type': 'BlogPosting',
        author: {
          '@type': 'Person',
          name: 'Manuel Wieser',
        },
        headline: title,
        datePublished: new Date(date).toISOString(),
        image: imageUrl,
        description: description,
      })}
    </script>
  )
}

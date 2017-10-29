import React from 'react'

export default function Article({ title, description, date, imageUrl }) {
  const data = `{
    "@context": "http://schema.org/",
    "@type": "BlogPosting",
    "author": {
      "@type": "Person",
      "name": "Manuel Wieser"
    },
    "headline": "${title}",
    "datePublished": "${new Date(date).toISOString()}",
    "image": "${imageUrl}",
    "description": "${description}"
  }`
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  )
}

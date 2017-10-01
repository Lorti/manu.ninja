import React from 'react'
import Link from 'gatsby-link'

export default function Banner() {
  return (
    <h1 className="Banner">
      <Link to="/">
        <img className="Banner-logo" src="/logo.svg" alt="Logo" />
        <span className="Banner-title">manu.ninja</span>
        <span className="Banner-line">
          Front-End Development, Games and Digital Art
        </span>
      </Link>
    </h1>
  )
}

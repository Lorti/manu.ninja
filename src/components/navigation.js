import React from 'react'
import { Link } from 'gatsby'

export default function Navigation() {
  return (
    <nav className="Navigation">
      <Link className="Navigation-item" to="/">Blog</Link>
      <Link className="Navigation-item" to="/talks">Talks</Link>
      <Link className="Navigation-item" to="/projects">Projects</Link>
      <Link className="Navigation-item" to="/about">About</Link>
    </nav>
  )
}

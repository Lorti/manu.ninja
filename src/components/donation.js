import React from 'react'
import Link from 'gatsby-link'

export default function Donation() {
  return (
    <div className="Donation">
      You can support <Link to="/">manu.ninja</Link> via{' '}
      <a href="https://www.paypal.me/manuninja">PayPal</a> and buy me a 🍺 or a
      cup o’ joe.
    </div>
  )
}

import React from 'react'
import { Link } from 'gatsby'

export default function Donation() {
  return (
    <div className="Donation">
      <small>
        You can support <Link to="/">manu.ninja</Link> via{' '}
        <a href="https://www.paypal.me/manuninja">PayPal</a> and buy me a 🍺 or
        a cup o’ joe.
      </small>
    </div>
  )
}

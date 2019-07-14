import React from 'react'
import { Link } from 'gatsby'

function Biography() {
  return (
    <>
      <div className="Grid Grid--withGutter">
        <div className="Grid-cell u-size1of5">
          <img
            className="Footer-image u-sizeFull u-round"
            src="/author.jpg"
            alt="Manuel Wieser, BSc MA"
          />
        </div>
        <div className="Grid-cell u-size4of5">
          <p>
            I’m an experienced front-end developer and versatile digital artist.
            I’m into building websites and creating content for real-time
            rendering, film and animation. I’m also a bearded hacker making
            games with my friends.
          </p>
          <p>
            You can contact me via <a href="https://github.com/Lorti">GitHub</a>
            , <a href="http://twitter.com/manuelwieser">Twitter</a> or{' '}
            <a href="mailto:office@manuelwieser.com">office@manuelwieser.com</a>
            .
          </p>
          <p>
            I’m currently working as a technical lead and full-stack web
            developer for <a href="https://www.karriere.at">karriere.at</a>,
            making software that helps people find the job of their dreams.
          </p>
        </div>
      </div>
    </>
  )
}
export default function Footer({ minimal }) {
  return (
    <footer className="Footer">
      {!minimal && (
        <>
          <hr />
          <Biography />
        </>
      )}

      <hr />

      <p className="Footer-copyright">
        <Link className="u-floatRight" to="/privacy">
          Imprint & Privacy Policy
        </Link>
        © {new Date().getFullYear()} Manuel Wieser
        <br />
        <small>
          <Link to="/">manu.ninja</Link> is the personal blog of Manuel Wieser,
          where he talks about front-end development, games and digital art
        </small>
      </p>
    </footer>
  )
}

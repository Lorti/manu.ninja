import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default function Talks({ data }) {
  const projects = data.allTalksJson.edges
  return (
    <Layout>
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <h1 className="Article-title">Talks</h1>
          </div>
          <div className="Article-content">
            <img
              style={{
                float: 'right',
                width: 240,
                maxWidth: '25%',
                marginTop: 0,
                marginLeft: '1.375em',
              }}
              src="/speaking.jpg"
              alt="Manuel Wieser speaking at Stahlstadt.js #18"
            />
            <p>
              Do you want me to talk about web development topics at your event?
              <br />
              Send a message to{' '}
              <a href="mailto:office@manuelwieser.com">
                office@manuelwieser.com
              </a>
              !
            </p>
            <p>
              <small>
                Click on a talk’s title to download the slides. If there’s a
                video recording it’s linked in the deck’s description.
              </small>
            </p>
          </div>
        </div>
        <div className="Talks">
          {projects.map(({ node: talk }) => {
            return (
              <div className="Talk">
                <p className="Talk-meta">
                  {talk.formattedDate} – {talk.location}
                </p>
                <h2 className="Talk-title">
                  <a className="Talk-link" href={talk.slides}>
                    {talk.title}
                  </a>
                </h2>
                <p className="Talk-event">{talk.event}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allTalksJson(sort: { order: DESC, fields: [date] }) {
      edges {
        node {
          title
          event
          slides
          video
          date
          formattedDate: date(formatString: "MMM DD, YYYY")
          location
        }
      }
    }
  }
`

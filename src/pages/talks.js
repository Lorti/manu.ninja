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
            <h1 className="Article-title">Speaking and Workshops</h1>
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
              I’m available for speaking and workshops, just send a message to{' '}
              <a href="mailto:office@manuelwieser.com">
                office@manuelwieser.com
              </a>
              . I’d be happy to talk about web design and development, game
              asset creation and challenges we’ve faced at{' '}
              <a href="https://www.karriere.at/">karriere.at</a>.
            </p>
          </div>
        </div>
        <div className="Talks">
          {projects.map(({ node: talk }) => (
            <div className="Talk" key={talk.url}>
              <p className="Talk-event">
                <a href={talk.url}>{talk.event}</a>
              </p>
              <h2 className="Talk-title">
                <a href={talk.slides}>{talk.title}</a>
              </h2>
              <p className="Talk-meta">
                <span>{talk.formattedDate}</span>
                <span>{talk.location}</span>
                {talk.slides ? <a href={talk.slides}>Slides</a> : ''}
                {talk.video ? <a href={talk.video}>Video</a> : ''}
              </p>
            </div>
          ))}
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
          url
          slides
          video
          formattedDate: date(formatString: "MMM DD, YYYY")
          location
        }
      }
    }
  }
`

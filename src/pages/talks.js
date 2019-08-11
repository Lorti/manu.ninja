import React from 'react'
import Layout from '../components/layout'
import Meta from '../components/meta'
import { graphql } from 'gatsby'

function Talk({ talk }) {
  return (
    <div className="Talk">
      <p className="Talk-event">
        {talk.url ? <a href={talk.url}>{talk.event}</a> : talk.event}
      </p>
      <h4 className="Talk-title">
        {talk.slides ? <a href={talk.slides}>{talk.title}</a> : talk.title}
      </h4>
      {talk.description ? (
        <p
          className="Talk-description"
          dangerouslySetInnerHTML={{ __html: talk.description }}
        ></p>
      ) : (
        ''
      )}
      <p className="Talk-meta">
        <span>{talk.formattedDate}</span>
        <span>{talk.location}</span>
        {talk.slides ? <a href={talk.slides}>Slides</a> : ''}
        {talk.video ? <a href={talk.video}>Video</a> : ''}
      </p>
    </div>
  )
}

export default function Talks({ data }) {
  const publicTalks = data.publicTalks.edges
  const universityTalks = data.universityTalks.edges
  const internalTalks = data.internalTalks.edges
  return (
    <Layout>
      <Meta
        title="Speaking and Workshops | manu.ninja"
        description="I’m available for speaking and workshops, talking about web design and development, game
              asset creation and challenges we’ve faced at karriere.at."
      />
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <h1 className="Article-title">Speaking and Workshops</h1>
          </div>
          <div className="Article-content">
            <p>
              I’m available for speaking and workshops, just send a message to{' '}
              <a href="mailto:office@manuelwieser.com">
                office@manuelwieser.com
              </a>
              . I’d be happy to talk about web design and development, game
              asset creation and challenges we’ve faced at{' '}
              <a href="https://www.karriere.at/">karriere.at</a>.
            </p>
            <img
              src="/manuel-speaking-at-stahlstadt-js.jpg"
              alt="Manuel speaking at Stahlstadt.js"
            />
            <h2>Talks</h2>
            <div className="Talks">
              {publicTalks.map(({ node: talk }) => (
                <Talk talk={talk} key={talk.id} />
              ))}
            </div>
            <h2>Lectures</h2>
            <p>
              This is a selection of lectures I have given at the University of
              Applied Sciences in Hagenberg, Upper Austria. The slides often
              contain examples and repository links that may also benefit others
              learning the discussed technology, which is why I wanted them to
              be public after the course(s).
            </p>
            <div className="Talks">
              {universityTalks.map(({ node: talk }) => (
                <Talk talk={talk} key={talk.id} />
              ))}
            </div>
            <h2>karriere.at</h2>
            <p>
              The karriere.at Dev-Café is an internal meetup where developers
              give talks on technology, tools or methods related to software
              development. I’ve supported this format with many talks, but also
              organized and held workshops for present and (hopefully) future
              co-workers.
            </p>
            <p>
              I won’t upload the slides, as many of them contain information
              specific to karriere.at. They only serve as list of topics I have
              and can give talks/workshops about at your event, if you’re
              interested.
            </p>
            <div className="Talks">
              {internalTalks.map(({ node: talk }) => (
                <Talk talk={talk} key={talk.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  fragment talk on TalksJson {
    id
    title
    description
    event
    url
    slides
    video
    formattedDate: date(formatString: "MMM DD, YYYY")
    location
  }

  query {
    publicTalks: allTalksJson(
      sort: { order: DESC, fields: [date] }
      filter: { karriere_at: { eq: null }, hagenberg: { eq: null } }
    ) {
      edges {
        node {
          ...talk
        }
      }
    }
    universityTalks: allTalksJson(
      sort: { order: ASC, fields: [date] }
      filter: { hagenberg: { eq: true } }
    ) {
      edges {
        node {
          ...talk
        }
      }
    }
    internalTalks: allTalksJson(
      sort: { order: DESC, fields: [date] }
      filter: { karriere_at: { eq: true } }
    ) {
      edges {
        node {
          ...talk
        }
      }
    }
  }
`

import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default function Talks({ data }) {
  const projects = data.allTalksJson.edges
  return (
    <Layout>
      <div className="Column">
        {projects.map(({ node: talk }) => {
          return (
            <div>
              <p>
                {talk.date} – {talk.location}
              </p>
              <h2>
                <a href={talk.slides}>{talk.title}</a>
              </h2>
              <p>{talk.location}</p>
            </div>
          )
        })}
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
          location
        }
      }
    }
  }
`

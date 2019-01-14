import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default function Projects({ data }) {
  const projects = data.allProjectsJson.edges
  return (
    <Layout>
      <div className="Column">
        {projects.map(({ node: project }) => {
          return (
            <div>
              <h2>
                <a href={project.url}>{project.title}</a>
              </h2>
              <p>{project.description}</p>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allProjectsJson(sort: { order: DESC, fields: [date] }) {
      edges {
        node {
          title
          url
          description
        }
      }
    }
  }
`

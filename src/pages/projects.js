import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default function Projects({ data }) {
  const projects = data.allProjects.edges
  const featured = data.allFeaturedProjects.edges
  return (
    <Layout>
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <h1 className="Article-title">Projects</h1>
          </div>
          <div className="Article-content">
            <p>Here you’ll find a selection of open-source projects I’ve created or contributed to, as well as personal and professional work. There’s a list of featured projects and a chronological list of projects.</p>
            <p>I try to actively maintain all of my open-source projects, if they’re not marked as deprecated.</p>
            <dl className="Grid Grid--withGutter">
              <h2 className="Grid-cell u-lg-before1of3">Featured Projects ✨</h2>
              {featured.map(({ node: project }) => {
                return (
                  <>
                    <dt className="Grid-cell u-lg-size1of3"><a href={project.url}>{project.title}</a></dt>
                    <dd className="Grid-cell u-lg-size2of3"><p>{project.description}</p></dd>
                  </>
                )
              })}
            </dl>
            <dl className="Grid Grid--withGutter">
              <h2 className="Grid-cell u-lg-before1of3">Projects <small>(Chronological 📅)</small></h2>
              {projects.map(({ node: project }) => {
                return (
                  <>
                    <dt className="Grid-cell u-lg-size1of3"><a href={project.url}>{project.title}</a></dt>
                    <dd className="Grid-cell u-lg-size2of3"><p>{project.description}</p></dd>
                  </>
                )
              })}
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  fragment ProjectFields on ProjectsJson {
    title
    url
    description
  }
  query {
    allProjects: allProjectsJson(sort: { order: DESC, fields: [date] }) {
      edges {
        node {
          ...ProjectFields
        }
      }
    }
    allFeaturedProjects: allProjectsJson(
      sort: {order: DESC, fields: [date]}, 
      filter: {featured: {eq: true}}
    ) {
      edges {
        node {
          ...ProjectFields
        }
      }
    }
  }
`

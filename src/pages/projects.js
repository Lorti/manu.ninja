import React from 'react'
import { Fragment } from 'react'
import Layout from '../components/layout'
import Meta from '../components/meta'
import { graphql } from 'gatsby'

export default function Projects({ data }) {
  const projects = data.allProjects.edges
  const featured = data.allFeaturedProjects.edges
  return (
    <Layout>
      <Meta
        title="Projects | manu.ninja"
        description="Here you’ll find a selection of open-source projects I’ve created
              or contributed to, as well as personal and professional work."
      />
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <h1 className="Article-title">Projects</h1>
          </div>
          <div className="Article-content">
            <p>
              Here you’ll find a selection of open-source projects I’ve created
              or contributed to, as well as personal and professional work. As
              soon as I find the time I’ll add games and digital art projects.
            </p>
            <p>
              There’s a list of featured projects and a chronological list of
              projects. Also I try to actively maintain all of my open-source
              projects, if they’re not marked as deprecated.
            </p>
            <h2>
              Featured Projects{' '}
              <span role="img" aria-label="Star">
                ✨
              </span>
            </h2>
            <dl>
              {featured.map(({ node: project }) => (
                <Fragment key={project.id}>
                  <dt>
                    <a href={project.url}>{project.title}</a>
                  </dt>
                  <dd>
                    <p>{project.description}</p>
                  </dd>
                </Fragment>
              ))}
            </dl>
            <h2>
              Projects{' '}
              <small>
                (Chronological{' '}
                <span role="img" aria-label="Calendar">
                  📅
                </span>
                )
              </small>
            </h2>
            <dl>
              {projects.map(({ node: project }) => (
                <Fragment key={project.id}>
                  <dt>
                    <a href={project.url}>{project.title}</a>
                  </dt>
                  <dd>
                    <p>{project.description}</p>
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  fragment ProjectFields on ProjectsJson {
    id
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
      sort: { order: DESC, fields: [date] }
      filter: { featured: { eq: true } }
    ) {
      edges {
        node {
          ...ProjectFields
        }
      }
    }
  }
`

import React from 'react'
import { Fragment } from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

export default function Projects({ data }) {
  const education = data.allEducationJson.edges
  const experience = data.allWorkExperienceJson.edges
  return (
    <Layout>
      <Helmet>
        <title>Who’s Manuel Wieser? | manu.ninja</title>
      </Helmet>
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <img
              style={{
                maxWidth: 240,
                borderRadius: '50%',
              }}
              src="/smile.jpg"
              alt="Manuel Wieser"
            />
            <h1 className="Article-title">I’m Manuel Wieser</h1>
            <p className="Article-date">
              Lead Web Developer (Technical Lead and Full-Stack Web Developer)
              <br />
              Speaker, Trainer and Lecturer
              <br />
              (Occasional) Designer, Digital Artist and Game Developer
            </p>
            <p className="Article-title">👨🏻‍💻👨🏻‍🏫👨🏻‍🎨</p>
          </div>
          <div className="Article-content">
            <h2>Third-Person Biography™</h2>
            <p>
              Manuel is Lead Web Developer at karriere.at, lecturer at the
              University of Applied Sciences Upper Austria and writes about
              Front-End Development, Games und Digital Art on his personal blog
              manu.ninja.
            </p>
            {/*
            <h2>What I do for a living</h2>
            <ul>
              <li>TODO</li>
            </ul>
            <h2>What I do for fun</h2>
            <ul>
              <li>TODO</li>
            </ul>
            */}
            <h2>Work Experience</h2>
            <dl>
              {experience.map(({ node: item }) => (
                <Fragment key={item.id}>
                  {item.current ? (
                    <dt>since {item.startDate}</dt>
                  ) : (
                    <dt>
                      {item.startDate} – {item.endDate}
                    </dt>
                  )}
                  <dd>
                    <h3>{item.position}</h3>
                    <h4>{item.company}</h4>
                    <p dangerouslySetInnerHTML={{ __html: item.description }} />
                  </dd>
                </Fragment>
              ))}
            </dl>
            <h2>Education</h2>
            <dl>
              {education.map(({ node: item }) => (
                <Fragment key={item.id}>
                  <dt>
                    {item.startDate} – {item.endDate}
                  </dt>
                  <dd>
                    <h3>{item.school}</h3>
                    <h4>{item.program}</h4>
                    <p dangerouslySetInnerHTML={{ __html: item.description }} />
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
  query {
    allWorkExperienceJson {
      edges {
        node {
          id
          position
          company
          startDate: start(formatString: "MMM, YYYY")
          endDate: end(formatString: "MMM, YYYY")
          current
          description
        }
      }
    }
    allEducationJson {
      edges {
        node {
          id
          school
          program
          startDate: start(formatString: "MMM, YYYY")
          endDate: end(formatString: "MMM, YYYY")
          description
        }
      }
    }
  }
`

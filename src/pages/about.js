import React from 'react'
import { Fragment } from 'react'
import Layout from '../components/layout'
import Meta from '../components/meta'
import { graphql } from 'gatsby'

export default function Projects({ data }) {
  const education = data.allEducationJson.edges
  const experience = data.allWorkExperienceJson.edges
  const thirdPersonBiography = `
    Manuel is Head of Front-End Development at karriere.at,
    lecturer at the University of Applied Sciences Upper Austria
    and writes about Front-End Development, Games und Digital Art
    on his personal blog manu.ninja.
  `
  return (
    <Layout minimal={true}>
      <Meta
        title="Who’s Manuel Wieser? | manu.ninja"
        description={thirdPersonBiography.replace(/\s+/g, ' ').trim()}
      />
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <img
              style={{
                maxWidth: 240,
                borderRadius: '50%',
              }}
              src="/author.jpg"
              alt="Manuel Wieser"
            />
            <h1 className="Article-title">I’m Manuel Wieser</h1>
            <p className="Article-date">
              Engineering Manager, Technical Lead, Front-End Developer
              <br />
              Speaker, Trainer and Lecturer
              <br />
              (Occasional) Designer, Digital Artist and Game Developer
            </p>
          </div>
          <div className="Article-content">
            <p>
              I’m an experienced front-end developer and lead developer for
              cross-functional Scrum/Kanban teams. I’ve recently transitioned to
              engineering management, trying to make everyone on my team an even
              better developer than myself.
            </p>
            <p>
              I love to share my knowledge and experience, whether on my
              personal blog, through talks and workshops, by creating or
              contributing to open-source projects, or as a lecturer at the
              University of Applied Sciences Upper Austria.
            </p>
            <p>
              I’m also a versatile digital artist, creating content for
              real-time applications, film and animation. I’ve developed a lot of small games
              with my friends, but all of this has unfortunately stopped being a
              priority in my life.
            </p>
            <p>
              You can contact me via{' '}
              <a href="https://github.com/Lorti">GitHub</a>,{' '}
              <a href="http://twitter.com/manuelwieser">Twitter</a> or{' '}
              <a href="mailto:office@manuelwieser.com">
                office@manuelwieser.com
              </a>
              . I’m available for speaking and workshops, talking about web
              design and development, game asset creation and challenges we’ve
              faced at <a href="https://www.karriere.at">karriere.at</a>.
            </p>
            <h2>Third-Person Biography™</h2>
            <p>{thirdPersonBiography}</p>
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

import React from 'react'
import Layout from '../components/layout'

export default function Projects() {
  return (
    <Layout>
      <div className="Column">
        <div className="Article">
          <div className="Article-header u-textCenter">
            <img
              style={{
                maxWidth: 240,
                borderRadius: '50%'
              }}
              src="/smile.jpg"
              alt="Manuel Wieser"
            />
            <h1 className="Article-title">I’m Manuel Wieser</h1>
            <p className="Article-date">
              Lead Developer and Software Architect<br/>
              Speaker, Trainer and Lecturer<br/>
              (Occasional) Designer, Digital Artist and Game Developer
            </p>
          </div>
          <div className="Article-content">
            <p>TODO Biography</p>
            <h2>What I do for a living</h2>
            <ul>
              <li>TODO</li>
            </ul>
            <h2>What I do for fun</h2>
            <ul>
              <li>TODO</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

import React from 'react'
import Layout from '../components/layout'

// TODO Why is /privacy not Markdown?

export default function Privacy() {
  return (
    <Layout>
      <div className="Column">
        <div className="Article">
          <div className="article-header u-textCenter">
            <h1 className="Article-title">Imprint & Data Privacy</h1>
          </div>

          <div className="Article-content">
            <p>
              <strong>Manuel Wieser</strong>
              <br />
              <a href="mailto:office@manuelwieser.com">
                office@manuelwieser.com
              </a>
              <br />
              Weingartshofstraße 29
              <br />
              4020 Linz
              <br />
              AUSTRIA
            </p>

            <h2>Cookies</h2>
            <div>
              <p>
                This website uses third-party cookies, which are stored by
                providers other than the person who manages this website.
              </p>
              <p>
                If you do not want cookies to be stored on your computer, please
                disable them in your browser’s settings. Saved cookies can also
                be deleted in the settings of the browser. The exclusion of
                cookies can lead to functional restrictions of this website.
              </p>
            </div>

            <h2>Hosting</h2>
            <div>
              <p>
                This website, or rather my hosting provider, logs every access
                to the server on which this service is located. The access data
                includes the name of the requested web page or file, date and
                time of retrieval, amount of data transferred, information about
                successful retrieval, browser type and version, the user’s
                operating system, referrer URL (the previously visited page), IP
                address and the requesting provider.
              </p>
            </div>

            <h2>Amazon PartnerNet</h2>
            <div>
              <p>
                This website takes part in the the Amazon EU Affiliate Program,
                which allows participants to earn advertising cost reimbursement
                on qualified purchases, by placing advertisements and links to
                Amazon products.
              </p>
              <p>
                Amazon uses cookies to track the origin of orders. Among other
                things, Amazon may recognize that you have clicked the affiliate
                link on this site and subsequently purchased a product from
                Amazon.
              </p>
              <p>
                For more information about Amazon’s data usage and opt-out
                options, please read{' '}
                <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=201909010.">
                  Amazon’s privacy policy.
                </a>
              </p>
            </div>

            <h2>Cloudflare</h2>
            <div>
              <p>
                This website uses a content delivery network (CDN) offered by
                Cloudflare.{' '}
                <a href="https://www.privacyshield.gov/participant?id=a2zt0000000GnZKAA0&status=Active">
                  Cloudflare is certified under the Privacy Shield Agreement
                </a>
                , which provides a guarantee to comply with European privacy
                legislation.
              </p>
              <p>
                A CDN is a service that helps deliver content using regionally
                distributed servers. The processing of the user data takes place
                solely for the aforementioned purposes and the maintenance of
                the security and functionality of the CDN. For more information,
                read{' '}
                <a href="https://www.cloudflare.com/security-policy">
                  Cloudflare’s privacy policy
                </a>
                .
              </p>
              <p>
                The <code>__cfduid</code> cookie is used to identify individual
                clients behind a shared IP address and apply security settings
                on a per-client basis. It does not correspond to any user ID in
                your web application, and does not store any personally
                identifiable information, please also read{' '}
                <a href="https://support.cloudflare.com/hc/en-us/articles/200170156-What-does-the-Cloudflare-cfduid-cookie-do-">
                  What does the Cloudflare cfduid cookie do?
                </a>
                .
              </p>
            </div>

            <h2>Disqus</h2>
            <div>
              <p>
                <a href="https://www.privacyshield.gov/participant?id=a2zt0000000TRkEAAW&status=Active">
                  DISQUS is certified under the Privacy Shield Agreement
                </a>
                , which provides a guarantee to comply with European privacy
                legislation.
              </p>
              <p>
                DISQUS with its features is only embedded on this website, and
                the administrator can influence the comments of the users.
                However, users enter into a direct contractual relationship with
                DISQUS, in which DISQUS processes users 'comments and acts as a
                contact for any deletion of users' data. For more information
                about their data usage, please read{' '}
                <a href="https://help.disqus.com/terms-and-policies/disqus-privacy-policy">
                  DISQUS’s privacy policy
                </a>
                .
              </p>
              <p>
                DISQUS may use your comment’s content and metadata, your IP
                address and cookies to display advertising. However, you can
                <a href="https://disqus.com/data-sharing-settings">
                  object to the processing of your data to display ads
                </a>
                .
              </p>
            </div>

            <h2>Google Analytics</h2>
            <div>
              <p>
                This website uses Google Analytics, a web analytics service
                provided by Google.{' '}
                <a href="https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&status=Active">
                  Google is certified under the Privacy Shield Agreement
                </a>
                , which provides a guarantee to comply with European privacy
                legislation.
              </p>
              <p>
                Information generated by{' '}
                <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                  Google Analytics’s cookies
                </a>{' '}
                about the user’s website usage is usually transmitted to a
                Google server in the USA and stored there.
              </p>
              <p>
                Google uses this information on this website's behalf to
                evaluate the use of the website by users, to compile reports on
                the activities within this website and to provide further
                services related to the use of this website and the internet
                usage. In this case, pseudonymous usage profiles of the users
                can be created from the processed data.
              </p>
              <p>
                This website only uses Google Analytics with activated IP
                anonymization. This means that the IP address of the users will
                be shortened by Google within member states of the European
                Union or in other contracting states of the Agreement on the
                European Economic Area. Only in exceptional cases will the full
                IP address be sent to a Google server in the US and shortened
                there.
              </p>
              <p>
                The IP address submitted by the user’s browser will not be
                merged with other data provided by Google. Users can prevent the
                storage of cookies by changing their browser settings. Users may
                also prevent the collection by Google of the data generated by
                the cookie and related to its use of the website and the
                processing of such data by Google by downloading and installing
                a{' '}
                <a href="https://tools.google.com/dlpage/gaoptout">
                  browser-plugin
                </a>
                .
              </p>
              <p>
                For more information about Google’s data usage, please read{' '}
                <a href="https://policies.google.com/technologies/ads">
                  Google’s Privacy Policy
                </a>{' '}
                and{' '}
                <a href="https://adssettings.google.com/authenticated">
                  Google’s Ads Settings
                </a>
                .
              </p>
            </div>

            <h2>Integration of Third-Party Content/Services</h2>
            <div>
              <p>
                This website uses <code>&lt;iframe&gt;</code> elements to embed
                content or services offered by third-party providers.
              </p>
              <ul>
                <li>
                  <a href="https://blog.codepen.io/legal/privacy/">
                    CodePen’s Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://speakerdeck.com/privacy">
                    Speaker Deck’s Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://sketchfab.com/privacy">
                    Sketchfab’s Privacy Policy
                  </a>
                </li>
              </ul>
              <p>
                This always assumes that the third-party providers of this
                content receive the IP address of a user, since they could not
                send the content to the user’s browsers without the IP address.
                The IP address is therefore required for the presentation of
                this content.
              </p>
              <p>
                Third parties may also use tracking pixels for statistical or
                marketing purposes. The tracking pixels can be used to evaluate
                information such as visitor traffic on the pages of this
                website. The pseudonymous information may also be stored in
                cookies on the user’s device and may include, but is not limited
                to, technical information about the browser and operating
                system, referring web pages, visit time, and other information
                regarding the use of this website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

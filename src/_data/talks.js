const talks = [
  {
    title: 'karriere.at Bootcamp 2019',
    event: 'Workshop',
    description:
      '5 days of workshops at Tabakfabrik Linz, teaching 12 people about web development and how to continue their learning afterwards',
    date: '2019-08-26',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Netlify Functions (Serverless and other Buzzwords …)',
    event: 'karriere.at Dev-Café',
    date: '2019-07-24',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: '5+ Interesting ECMAScript Proposals',
    event: 'karriere.at Dev-Café',
    date: '2019-06-26',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Microfrontends',
    event: 'karriere.at Dev-Café',
    date: '2019-04-17',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Testing',
    description:
      'Terminology, Unit Testing (Jest), End-to-End Testing (Nightwatch), Vue Test Utils, Cucumber',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-25',
    slides:
      'https://docs.google.com/presentation/d/1tyPn8oa_QkFNQ2TKAUIy6tq2fne2xb6gzMhT5VYSMEs/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'GraphQL',
    description:
      'GraphQL, GraphQL Services (GraphCMS, Hasura), Usage with Vue.js',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-18 18:00',
    slides:
      'https://docs.google.com/presentation/d/1oyEQ_CRiYBa78d4qGcB7xi3Yk6pXgbBISYwF5qmj-3o/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'Communication',
    description: 'REST APIs, WebSockets, NoSQL (Firebase), Feathers',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-18 12:00',
    slides:
      'https://docs.google.com/presentation/d/1LprTPxByFcvbRaTV7o_-VJJX-ZYNv2C-EICDu60-MNY/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'Progressive Web Apps',
    description:
      'Progressive Web Apps, Manifest, Service Workers, Cache API, Testing',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-11 18:00',
    slides:
      'https://docs.google.com/presentation/d/1LprTPxByFcvbRaTV7o_-VJJX-ZYNv2C-EICDu60-MNY/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'Tooling',
    description:
      'webpack, Vue CLI 3, Task Runners, Module Bundlers, Server-Side Rendering, Prerendering, Freemium Hosting',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-11 12:00',
    slides:
      'https://docs.google.com/presentation/d/1DuEe_QgahXHeB9EWh7VNBW71ViX_4JSSqwss9QrVIc4/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'Vue.js',
    description:
      'Vue.js, Single-File Components, Vue Router, Vuex, Vue Server Renderer',
    event: 'Hypermedia User Experience Engineering',
    date: '2019-03-04',
    slides:
      'https://docs.google.com/presentation/d/1k2RKJaX2Jd8zEozuIQEgYDxYFSCivfdK1Zc3exlxSj4/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    hagenberg: true,
  },
  {
    title: 'Vue.js Workshop',
    description: 'Workshop at HTL Ybbs for upper secondary school students',
    event: 'IndY',
    date: '2019-02-25',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Scaffolding a Progressive Web App using Vue CLI 3',
    event: 'webclerks #15',
    url: 'https://www.meetup.com/de-DE/webclerks/events/245731400/',
    slides:
      'https://speakerdeck.com/lorti/scaffolding-a-progressive-web-app-using-vue-cli-3-webclerks',
    date: '2018-11-14',
    location: 'Vienna, Austria',
    public: true,
  },
  {
    title: 'Scaffolding a Progressive Web App using Vue CLI 3',
    event: 'Stahlstadt.js #18',
    url: 'https://www.meetup.com/de-DE/stahlstadt-js/events/254352412/',
    slides:
      'https://speakerdeck.com/lorti/scaffolding-a-progressive-web-app-using-vue-cli-3-stahlstadt-dot-js',
    video: 'https://www.youtube.com/watch?v=cKwcZTtF_EU',
    date: '2018-10-09',
    location: 'Linz, Austria',
    public: true,
  },
  {
    title: 'Vue.js Workshop',
    description:
      'Workshop at karriere.at for PHP/Java developers to get a grasp on front-end development',
    event: 'Workshop',
    date: '2018-08-31',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'A/B Testing with Google Analytics',
    description:
      'Workshop at karriere.at for marketing/product managers and developers',
    event: 'Workshop',
    date: '2018-07-11',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'WebGL',
    event: 'karriere.at Dev-Café',
    slides:
      'https://docs.google.com/presentation/d/1cbMGGaRJx20sytiCOTG5q7H-2KZEGP1kVtvnD1MKe94/edit?usp=sharing',
    date: '2018-08-22',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'GraphQL',
    event: 'karriere.at Dev-Café',
    date: '2018-02-28',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Chrome Developer Tools',
    event: 'karriere.at Dev-Café',
    date: '2017-11-28',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title:
      'Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js ',
    event: 'webclerks #10',
    url: 'https://www.meetup.com/de-DE/webclerks/events/236971861/',
    slides:
      'https://speakerdeck.com/lorti/functional-reactive-game-programming',
    date: '2017-11-27',
    location: 'Vienna, Austria',
    public: true,
  },
  {
    title: 'JavaScript Workshop',
    description: 'Workshop at karriere.at for QA/DevOps team (test engineers)',
    event: 'Workshop',
    date: '2017-11-16',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title:
      'Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js ',
    event: 'Stahlstadt.js #14',
    url: 'https://www.meetup.com/de-DE/stahlstadt-js/events/239660401/',
    slides:
      'https://speakerdeck.com/lorti/functional-reactive-game-programming',
    date: '2017-06-07',
    location: 'Linz, Austria',
    public: true,
  },
  {
    title: 'Web Push Notifications',
    event: 'Stahlstadt.js #13',
    url: 'https://www.meetup.com/de-DE/stahlstadt-js/events/238215491/',
    slides: 'https://speakerdeck.com/lorti/web-push-notifications',
    date: '2017-03-27',
    location: 'Linz, Austria',
    public: true,
  },
  {
    title: 'Web Push Notifications',
    event: 'karriere.at Dev-Café',
    date: '2017-01-24',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Electron Hacking',
    event: 'karriere.at Dev-Café',
    date: '2016-07-26',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Refactoring form.js with Functional JavaScript and Tape',
    event: 'karriere.at Dev-Café',
    date: '2016-05-31',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'Dominant Colors for Lazy-Loading Images',
    event: 'Stahlstadt.js #9',
    url: 'https://www.meetup.com/de-DE/stahlstadt-js/events/230486844/',
    slides:
      'https://speakerdeck.com/lorti/dominant-colors-for-lazy-loading-images',
    date: '2016-05-19',
    location: 'Linz, Austria',
    public: true,
  },
  {
    title: 'Sassibilisieren',
    'description:': 'Converting Less to Sass using Regular Expression',
    event: 'karriere.at Dev-Café',
    date: '2015-09-24',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'CSS Refactoring',
    description:
      'A proposal for transparent and self-documenting CSS, HTML and JavaScript',
    event: 'karriere.at Dev-Café',
    date: '2015-08-25',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'phpspec',
    event: 'karriere.at Dev-Café',
    date: '2015-05-05',
    location: 'Linz, Austria',
    karriere_at: true,
  },
  {
    title: 'SVGs – What kind of sorcery is this?',
    event: 'karriere.at Dev-Café',
    date: '2015-01-27',
    location: 'Linz, Austria',
    karriere_at: true,
  },
];
module.exports = talks.sort((a, b) => new Date(b.date) - new Date(a.date));
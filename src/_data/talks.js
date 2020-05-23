const talks = [
  {
    title: 'Porting DOOM (1993) to WebAssembly',
    event: 'Stahlstadt.js #25',
    url: 'https://www.meetup.com/de-DE/stahlstadt-js/events/269972560/',
    date: '2020-04-23',
    slides: 'https://speakerdeck.com/lorti/porting-doom-1993-to-webassembly',
    video: 'https://www.youtube.com/watch?v=lZnz46a58_Y',
    location: 'Online (Twitch)',
    public: true,
  },
  {
    title: 'WebGL',
    description:
      'Use Cases for WebGL, CG Basics, WebGL, Three.js, A-Frame, WebXR',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-04-03 10:00',
    slides:
      'https://docs.google.com/presentation/d/1YO-xQYGTuLADxQZxUTrPw4M1RQ797ofnvYe3UCABdso/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'RxJS',
    description:
      'RxJS, Observables, Operators, Subscriptions, Subjects, Schedulers',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-04-03 08:00',
    slides:
      'https://docs.google.com/presentation/d/1wt-kYz-KYNhox-aBliC4oTeXUyxTXxAY4cqXzsbYByE/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=7gl-O_21aNU',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'End-to-End Testing',
    description: 'End-to-End Testing, Nightwatch, Cucumber',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-30 14:00',
    slides:
      'https://docs.google.com/presentation/d/16FZtYSnC68pAIjpt4Q5bUOObZtbfAnOa7sDHuImhw_0/edit?usp=sharing#slide=id.g550161889b_0_365',
    video: 'https://www.youtube.com/watch?v=Y_CgWAiitJ4',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Unit Testing',
    description: 'Unit Testing, Jest, Vue Test Utils',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-30 13:00',
    slides:
      'https://docs.google.com/presentation/d/16FZtYSnC68pAIjpt4Q5bUOObZtbfAnOa7sDHuImhw_0/edit?usp=sharing#slide=id.g550161889b_0_193',
    video: 'https://www.youtube.com/watch?v=WapYh_lNovk',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Testing',
    description: 'Introduction to Testing, Terminology, Types of Tools',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-30 12:00',
    slides:
      'https://docs.google.com/presentation/d/16FZtYSnC68pAIjpt4Q5bUOObZtbfAnOa7sDHuImhw_0/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=-0VVlC7D1HI',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'GraphQL',
    description:
      'GraphQL, GraphQL Services (GraphCMS, Storyblok, Hasura), Usage with Vue.js',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-23 13:00',
    slides:
      'https://docs.google.com/presentation/d/1dui18YHCNTYG7gP8RQ-8Qpa_IwJVKriEaqM0dEqCS-M/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=XuUmxeCBwPM',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Communication',
    description:
      'REST APIs, WebSockets, NoSQL (Firebase), Authentication/Authorization (Auth0), File Handling (Filestack)',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-23 12:00',
    slides:
      'https://docs.google.com/presentation/d/1own_92DLnWO5_CJWTGKSoyo-Jh4I1imyIbq13egT_Rg/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=pyPaN4UMU7A',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'JAMstack',
    description:
      'JAMstack, The Power of Serverless for Front-End Developers, JAMStack/Serverless Communication',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-16 15:00',
    slides:
      'https://docs.google.com/presentation/d/1mzhpBS5-9Q_ooA4JJWc1Tlt8Y0vU0j0u-97cWjKUSoc/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=f-AWmF6aaaU',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Progressive Web Apps',
    description:
      'Progressive Web Apps, Web App Manifest, Service Workers, Cache API, Push Notifications, Testing',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-16 14:00',
    slides:
      'https://docs.google.com/presentation/d/1-hqEimH0sFxhHS46WZgyyF2xrd97Ecv07451qboIb68/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=c2VjVHojHL4',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'CSS in 2020',
    description:
      'CSS Architecture (OOCSS, SMACSS, BEM, ITCSS, …), Flexbox/Grid, Custom Properties (CSS Variables), @supports',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-16 13:00',
    slides:
      'https://docs.google.com/presentation/d/1LiCDuVU4FiQ5GArVPw6_2aWiniBVjM7YKwv-C_FQ2zY/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=NaGs8F0N7Ro',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'JavaScript in 2020',
    description:
      'ECMAScript 6+ Compatibility Table, ECMAScript Proposals (The TC39 Process)',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-16 12:00',
    slides:
      'https://docs.google.com/presentation/d/1oTmRFWywQwqMm7TXxmAzy2lM0vxUYhfTE3rQCKAopK4/edit?usp=sharing',
    video: 'https://www.youtube.com/watch?v=HnERiJOAaqs',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Scaling Up',
    description:
      'Vue Router, Vuex (Stage Management), Vue Server Renderer, Prerendering, Security',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-09 13:00',
    slides:
      'https://docs.google.com/presentation/d/1f6V93e1xXDfhCT32e03XFqb5-Kj8kilnRdA6wdASLeo/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Tooling',
    description:
      'Task Runners (Grunt, Gulp), Module Bundlers (webpack, Parcel), Vue CLI 4, (Freemium) Hosting',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-09 12:00',
    slides:
      'https://docs.google.com/presentation/d/1KRRdFWVsarxZ8tMKQ4oPQ7mNW3k0RNDKzDOF68glz34/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'Vue.js',
    description:
      'Vue.js (Essentials, Components In-Depth, Transitions & Animations, Reusability & Composition, Reactivity), Community, Roadmap (RFCs)',
    event: 'Hypermedia User Experience Engineering 2020',
    date: '2020-03-02',
    slides:
      'https://docs.google.com/presentation/d/1jAJ0BH2rjf6erPEZiNk1_B5A6GOXdnlfURj7hD67Rg0/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2020': true,
  },
  {
    title: 'karriere.at Bootcamp 2019',
    event: 'Workshop',
    description:
      '5 days of workshops at Tabakfabrik Linz, teaching 12 people about web development and how to continue their learning afterwards',
    date: '2019-08-26',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'Netlify Functions (Serverless and other Buzzwords …)',
    event: 'karriere.at Dev-Café',
    date: '2019-07-24',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: '5+ Interesting ECMAScript Proposals',
    event: 'karriere.at Dev-Café',
    date: '2019-06-26',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'Microfrontends',
    event: 'karriere.at Dev-Café',
    date: '2019-04-17',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'Testing',
    description:
      'Terminology, Unit Testing (Jest), End-to-End Testing (Nightwatch), Vue Test Utils, Cucumber',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-25',
    slides:
      'https://docs.google.com/presentation/d/1tyPn8oa_QkFNQ2TKAUIy6tq2fne2xb6gzMhT5VYSMEs/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'GraphQL',
    description:
      'GraphQL, GraphQL Services (GraphCMS, Hasura), Usage with Vue.js',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-18 18:00',
    slides:
      'https://docs.google.com/presentation/d/1oyEQ_CRiYBa78d4qGcB7xi3Yk6pXgbBISYwF5qmj-3o/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'Communication',
    description: 'REST APIs, WebSockets, NoSQL (Firebase), Feathers',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-18 12:00',
    slides:
      'https://docs.google.com/presentation/d/1LprTPxByFcvbRaTV7o_-VJJX-ZYNv2C-EICDu60-MNY/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'Progressive Web Apps',
    description:
      'Progressive Web Apps, Manifest, Service Workers, Cache API, Testing',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-11 18:00',
    slides:
      'https://docs.google.com/presentation/d/1LprTPxByFcvbRaTV7o_-VJJX-ZYNv2C-EICDu60-MNY/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'Tooling',
    description:
      'webpack, Vue CLI 3, Task Runners, Module Bundlers, Server-Side Rendering, Prerendering, Freemium Hosting',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-11 12:00',
    slides:
      'https://docs.google.com/presentation/d/1DuEe_QgahXHeB9EWh7VNBW71ViX_4JSSqwss9QrVIc4/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'Vue.js',
    description:
      'Vue.js, Single-File Components, Vue Router, Vuex, Vue Server Renderer',
    event: 'Hypermedia User Experience Engineering 2019',
    date: '2019-03-04',
    slides:
      'https://docs.google.com/presentation/d/1k2RKJaX2Jd8zEozuIQEgYDxYFSCivfdK1Zc3exlxSj4/edit?usp=sharing',
    location: 'Hagenberg, Austria',
    'hagenberg-2019': true,
  },
  {
    title: 'Vue.js Workshop',
    description: 'Workshop at HTL Ybbs for upper secondary school students',
    event: 'IndY',
    date: '2019-02-25',
    location: 'Linz, Austria',
    'karriere.at': true,
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
    'karriere.at': true,
  },
  {
    title: 'A/B Testing with Google Analytics',
    description:
      'Workshop at karriere.at for marketing/product managers and developers',
    event: 'Workshop',
    date: '2018-07-11',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'WebGL',
    event: 'karriere.at Dev-Café',
    date: '2018-08-22',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'GraphQL',
    event: 'karriere.at Dev-Café',
    date: '2018-02-28',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'Chrome Developer Tools',
    event: 'karriere.at Dev-Café',
    date: '2017-11-28',
    location: 'Linz, Austria',
    'karriere.at': true,
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
    'karriere.at': true,
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
    'karriere.at': true,
  },
  {
    title: 'Electron Hacking',
    event: 'karriere.at Dev-Café',
    date: '2016-07-26',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'Refactoring form.js with Functional JavaScript and Tape',
    event: 'karriere.at Dev-Café',
    date: '2016-05-31',
    location: 'Linz, Austria',
    'karriere.at': true,
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
    'karriere.at': true,
  },
  {
    title: 'CSS Refactoring',
    description:
      'A proposal for transparent and self-documenting CSS, HTML and JavaScript',
    event: 'karriere.at Dev-Café',
    date: '2015-08-25',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'phpspec',
    event: 'karriere.at Dev-Café',
    date: '2015-05-05',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
  {
    title: 'SVGs – What kind of sorcery is this?',
    event: 'karriere.at Dev-Café',
    date: '2015-01-27',
    location: 'Linz, Austria',
    'karriere.at': true,
  },
];
module.exports = talks.sort((a, b) => new Date(b.date) - new Date(a.date));

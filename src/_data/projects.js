const projects = [
  {
    title: 'manu.ninja',
    url: 'https://github.com/Lorti/manu.ninja',
    description:
      'manu.ninja is the personal blog of Manuel Timelthaler. Jekyll, then Gatsby 1-2, then 11ty.',
    date: '2015-09',
    featured: true,
  },
  {
    title: 'sdldoom.wasm',
    url: 'https://github.com/Lorti/sdldoom.wasm',
    description: 'SDLDoom 1.10 compiled to WebAssembly using Emscripten.',
    date: '2020-04',
    featured: true,
  },
  {
    title: 'Module Bundlers and Task Runners',
    url: 'https://github.com/Lorti/module-bundlers-and-task-runners',
    description:
      'Examples of JavaScript module bundlers and task runners for my lectures and workshops, focusing on JS, HTML/CSS (Sass) and Vue.js.',
    date: '2019-05',
    featured: false,
  },
  {
    title: 'Microfrontends',
    url: 'https://github.com/Lorti/microfrontends',
    description:
      'A simple microfrontend architecture for explaining/showcasing the concept.',
    date: '2019-04',
    featured: true,
  },
  {
    title: 'hochzeit.manuelwieser.com',
    url: 'https://github.com/Lorti/hochzeit',
    description:
      'Personal wedding website with guest management, built using VuePress, Storyblok and Netlify Functions.',
    date: '2018-07',
    featured: false,
  },
  {
    title: 'vue-cli-plugin-e2e-nightwatch-cucumber',
    url: 'https://github.com/karriereat/vue-cli-plugin-e2e-nightwatch-cucumber',
    description: 'Nightwatch/Cucumber plugin for Vue CLI 3.',
    date: '2018-10',
    featured: false,
  },
  {
    title: 'Corsair',
    url: 'https://github.com/Lorti/corsair',
    description: 'Corsair using RxJS, Immutable.js and WebGL/three.js.',
    date: '2017-12',
    featured: true,
  },
  {
    title: 'RxJS Breakout',
    url: 'https://github.com/Lorti/rxjs-breakout',
    description: 'Breakout using Functional Reactive Programming and RxJS.',
    date: '2016-04',
    featured: true,
  },
  {
    title: 'Dominant Colors Lazy Loading (WordPress Plugin)',
    url:
      'https://github.com/Lorti/dominant-colors-lazy-loading-wordpress-plugin',
    description:
      'This WordPress plugin allows you to lazy-load your images while showing the dominant color of each image as a placeholder – like Pinterest or Google Images.',
    date: '2016-04',
    featured: true,
  },
  {
    title: 'gatsby-source-buttercms',
    url: 'https://github.com/ButterCMS/gatsby-source-buttercms',
    description:
      'Source plugin for pulling blog posts, authors, categories, tags, and content fields into Gatsby from ButterCMS.',
    date: '2018-09',
    featured: false,
  },
  {
    title: 'snow.js️',
    url: 'https://github.com/Lorti/snow.js',
    description:
      'snow.js is a module that exports a snow() function, which you can pass the number of snowflakes you’d like and an HTML element where they should be drawn.',
    date: '2018-11',
    featured: false,
  },
  {
    title: 'Japanese Phrasebook️',
    url: 'https://github.com/Lorti/phrasebook',
    description:
      '100% free Japanese Phrasebook app, built for travel and offline usage. Add it to your Home screen and access 670+ essential phrases in 19 topics. Requires no Internet connection and offers speech synthesis, so you know how to pronounce Japanese phrases correctly.',
    date: '2018-04',
    featured: true,
  },
  {
    title: 'vue-dictaphone',
    url: 'https://github.com/Lorti/vue-dictaphone',
    description: 'Vue.js dictaphone component to record audio from the user.',
    date: '2018-06',
    featured: false,
  },
  {
    title: 'WebGL Examples️',
    url: 'https://github.com/Lorti/webgl-examples',
    description:
      'Essential WebGL examples, adapted from MDN and Learning WebGL.',
    date: '2018-06',
    featured: false,
  },
  {
    title: 'Johannes',
    url: 'https://github.com/karriereat/hackathon-2018/tree/master/johannes',
    description:
      'Prototype for a collaborative real-time presentation software, meant as a self-hosted alternative to Google Slides. Built during a 24-hour hackathon in a team of three people using Firebase, Preact, TypeScript and Feathers.',
    date: '2018-11',
    featured: false,
  },
  {
    title: 'Animation Strip Generator (GUI)',
    url: 'https://github.com/karriereat/sprite-animation-generator',
    description:
      'Simple Electron app providing a GUI for a command-line utility.',
    date: '2016-07',
    featured: false,
  },
  {
    title: 'Animation Strip Generator',
    url: 'https://github.com/karriereat/animation-strip-generator',
    description:
      'A command-line utility for creating sprite animations from image sequences.',
    date: '2016-07',
    featured: false,
  },
  {
    title: 'Laravel Handlebars',
    url: 'https://github.com/ProAI/laravel-handlebars',
    description:
      'A Laravel 5 wrapper for LightnCandy for using the Handlebars (and Mustache) template engine. It allows you to use the same templates in different languages (like PHP and JavaScript) on the client and server.',
    date: '2016-08',
    featured: false,
  },
  {
    title: 'WebGL 3D Model Viewer Using three.js',
    url: 'https://github.com/Lorti/webgl-3d-model-viewer-using-three.js',
    description:
      'three.js example using an OBJ/MTL loader, orbit controls, nearest-neighbor filtering and a pure white ambient light to showcase pixel art textures.',
    date: '2016-02',
    featured: false,
  },
  {
    title: 'ARTUR Web Interface',
    url: 'https://github.com/Lorti/artur-web-interface',
    description:
      'ARTUR (Autonomous Robot Playspace) is a game designed for the Deep Space 8K at Ars Electronica Center. It made its debut at the Ars Electronica Festival 2017 in Linz, Austria. The web interface allows visitors to take part in the game by spawning new items for the players.',
    date: '2017-09',
    featured: false,
  },
  {
    title: 'Hacker News with Vue.js and GraphQL',
    url: 'https://github.com/Lorti/v-gql-hn',
    description:
      'Example project for my lectures showing how to use Vue.js core libraries and tooling with GraphQL. A companion project sets up a serverless GraphQL backend via Graphcool.',
    date: '2018-04',
    featured: false,
  },
  {
    title: 'grunt-svg-symbols',
    url: 'https://github.com/Lorti/grunt-svg-symbols',
    description:
      'Grunt plugin to generate an SVG icon system (based on <symbol>) of a specified folder.',
    date: '2016-05',
    featured: false,
  },
  {
    title: 'Web Push Notifications',
    url: 'https://github.com/Lorti/web-push-notifications',
    description:
      'A complete example on how to send push notifications, using Service Workers, Notification API, Push API and Google’s and Mozilla’s push messaging services.',
    date: '2017-04',
    featured: false,
  },
  {
    title: 'resemble-image',
    url: 'https://github.com/Lorti/resemble-image',
    description:
      'Provide color stops for a gradient that loosely resembles the original image. This package only contains the basic algorithms to use in any JavaScript application.',
    date: '2017-01',
    featured: false,
  },
  {
    title: 'postcss-resemble-image',
    url: 'https://github.com/ben-eb/postcss-resemble-image',
    description:
      'Provide color stops for a gradient that loosely resembles the original image.',
    date: '2016-11',
    featured: false,
  },
  {
    title: 'dominant-colors-snippets',
    url: 'https://github.com/Lorti/dominant-colors-snippets',
    description:
      'Snippets showcasing the differences between quantization techniques.',
    date: '2016-05',
    featured: false,
  },
  {
    title: 'Clock Clock 24',
    url: 'https://codepen.io/Lorti/pen/XpQewQ',
    description:
      'A take on the original design by Humans since 1982, where 24 analogue clocks form a digital clock.',
    date: '2017-02',
    featured: false,
  },
  {
    title: 'Liquid Loading',
    url: 'https://codepen.io/Lorti/pen/ozExqp',
    description:
      'A “droplet effect” pull-to-refresh animation using SVG, CSS and JavaScript.',
    date: '2016-10',
    featured: false,
  },
  {
    title: 'WebGL Annotations',
    url: 'https://codepen.io/Lorti/pen/Vbppap',
    description:
      'three.js example showing how to add a comment box or annotation box to a WebGL object as seen on Sketchfab.',
    date: '2017-04',
    featured: false,
  },
  {
    title: 'Clementine',
    url: 'https://github.com/Lorti/clementine',
    description:
      'Radiated Pixel’s Clementine, the skill-based brain-twisting platformer, on iOS, Android or Windows Phone. Can you run further than your friends and beat their high scores?! The microsite lists all-time high scores of players.',
    date: '2014-04',
    featured: false,
  },
];
module.exports = projects.sort((a, b) => new Date(b.date) - new Date(a.date));

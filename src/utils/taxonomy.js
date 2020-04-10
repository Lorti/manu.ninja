const categories = {
  art: 'Digital Art',
  coding: 'Coding',
  games: 'Games',
};

const tags = {
  'functional-programming': 'Functional Programming',
  'image-processing': 'Image Processing',
  'interaction-design': 'Interaction Design',
  'lazy-loading': 'Lazy-Loading',
  'three-js': 'three.js',
  accessibility: 'Accessibility',
  animation: 'Animation',
  apis: 'Web APIs',
  business: 'Business',
  conferences: 'Conferences',
  conversion: 'Conversion',
  electron: 'Electron',
  ffmpeg: 'ffmpeg',
  graphql: 'GraphQL',
  hardware: 'Hardware',
  icons: 'Icons',
  illustrator: 'Illustrator',
  js: 'JavaScript',
  maya: 'Maya',
  meetups: 'Meetups',
  performance: 'Performance',
  pwa: 'Progressive Web Apps',
  rigging: 'Rigging',
  rxjs: 'RxJS',
  shaders: 'Shaders',
  slides: 'Slides',
  svg: 'SVG',
  testing: 'Testing',
  tools: 'Tools',
  unity: 'Unity',
  vue: 'Vue.js',
  webgl: 'WebGL',
  zbrush: 'ZBrush',
};

module.exports = {
  categories,
  tags,
  mapTaxonomy(keyword) {
    return categories[keyword] || tags[keyword];
  },
};

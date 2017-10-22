const categories = {
  art: 'Digital Art',
  coding: 'Coding',
  games: 'Games',
}

const tags = {
  'functional-reactive-programming': 'Functional Reactive Programming',
  'image-processing': 'Image Processing',
  'interaction-design': 'Interaction Design',
  'lazy-loading': 'Lazy-Loading',
  'three-js': 'three.js',
  accessibility: 'Accessibility',
  animation: 'Animation',
  business: 'Business',
  conferences: 'Conferences',
  conversion: 'Conversion',
  electron: 'Electron',
  ffmpeg: 'ffmpeg',
  hardware: 'Hardware',
  icons: 'Icons',
  illustrator: 'Illustrator',
  maya: 'Maya',
  meetups: 'Meetups',
  performance: 'Performance',
  rigging: 'Rigging',
  rxjs: 'RxJS',
  shaders: 'Shaders',
  slides: 'Slides',
  svg: 'SVG',
  tables: 'Tables',
  testing: 'Testing',
  unity: 'Unity',
  zbrush: 'ZBrush',
}

export default function(keyword) {
  return categories[keyword] || tags[keyword]
}

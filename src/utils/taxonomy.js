const categories = {
  art: 'Digital Art',
  coding: 'Coding',
  games: 'Games',
}

const tags = {
  rxjs: 'RxJS',
  threejs: 'three.js',
}

export default function(keyword) {
  return categories[keyword] || tags[keyword]
}

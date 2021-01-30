const { renderSync } = require('sass');

let lastModified = 0;
let cachedStyles = '';

module.exports = function generateCachedStylesheet() {
  if (lastModified < Date.now() - 5000) {
    const { css } = renderSync({
      file: __dirname + '/../styles/index.scss',
      outputStyle: 'compressed',
    });
    lastModified = Date.now();
    cachedStyles = css;
  }
  return cachedStyles;
};

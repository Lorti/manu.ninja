const fs = require('fs');
const glob = require('glob');
const sass = require('node-sass');
const { PurgeCSS } = require('purgecss');

const { css } = sass.renderSync({
  file: __dirname + '/src/styles/index.scss',
  outputStyle: 'compressed',
});

const pattern = /<style>.*?<\/style>/s;

async function purgeInlineCSS(file) {
  const html = fs.readFileSync(file, 'utf-8');
  const [{ css: result }] = await new PurgeCSS().purge({
    content: [{ raw: html.replace(pattern, ''), extension: 'html' }],
    css: [{ raw: css }],
  });
  console.log(file, css.length, result.length);
  fs.writeFileSync(file, html.replace(pattern, `<style>${result}</style>`));
}

purgeInlineCSS('./public/index.html');

glob('./public/**/*.html', (error, files) => {
  Promise.all(files.map(async (file) => purgeInlineCSS(file)));
});

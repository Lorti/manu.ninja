const generateCachedStylesheet = require('./build-styles');
const { PurgeCSS: PurgeStyles } = require('purgecss');

const styles = generateCachedStylesheet();
const pattern = /<style>.*?<\/style>/s;

module.exports = async function purgeStyles(content, path) {
  if (path.endsWith('.html')) {
    const [{ css: result }] = await new PurgeStyles().purge({
      content: [{ raw: content.replace(pattern, ''), extension: 'html' }],
      css: [{ raw: styles }],
    });
    console.log(path, styles.length, result.length);
    return content.replace(pattern, `<style>${result}</style>`);
  }
  return content;
};

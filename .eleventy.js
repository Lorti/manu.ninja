const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-table-of-contents');
const minifier = require('html-minifier');
const collections = require('./src/utils/collections');
const filters = require('./src/utils/filters');
const shortcodes = require('./src/utils/shortcodes');
const purgeStyles = require('./src/utils/purge-styles');
const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(syntaxHighlight);

  Object.entries(collections).map(([key, value]) => {
    eleventyConfig.addCollection(key, value);
  });

  Object.entries(filters).map(([key, value]) => {
    eleventyConfig.addFilter(key, value);
  });

  Object.entries(shortcodes).map(([key, value]) => {
    eleventyConfig.addShortcode(key, value);
  });

  eleventyConfig.addPassthroughCopy({ static: '.' });
  eleventyConfig.addWatchTarget('src/styles/');

  let markdownLibrary = markdownIt({
    html: true,
    typographer: true,
  })
    .disable('code')
    .use(markdownItAnchor, {
      permalink: true,
      permalinkAttrs: () => ({ 'aria-hidden': true }),
      permalinkSymbol:
        '<svg viewBox="0 0 512 512"><path d="M459.7 233.4L369 324c-49.8 50-131 50-181 0-7.8-8-14-16.8-19.3-26l42-42c2-2 4.5-3.2 7-4.5 2.8 10 8 19.3 15.7 27 25 25 65.5 25 90.5 0l90.4-90.4c25-24.8 25-65.4 0-90.4s-65.6-25-90.5 0l-32.3 32.2c-26-10-54.3-13-81.7-9l68.6-68.4c50-50 131-50 181 0s50 131 0 181zM220.3 382.2L188 414.4c-24.8 25-65.4 25-90.4 0s-25-65.6 0-90.5l90.5-90.6c25-25 65.7-25 90.6 0 7.8 7.8 13 17.2 15.8 27 2.4-1.3 4.8-2.4 6.8-4.4l42-42c-5.3-9.2-11.5-18-19.3-26-50-50-131.2-50-181 0l-90.6 90.6c-50 50-50 131 0 181s131 50 181 0l68.6-68.5c-27.4 4-55.6 1.3-81.7-8.8z"/></svg>',
    })
    .use(markdownItTableOfContents, {
      includeLevel: [2],
      listType: 'ol',
    });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addTransform('minify', (content, path) => {
    if (path.endsWith('.html')) {
      return minifier.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }
    return content;
  });

  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('purge-styles', purgeStyles);
  }

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};

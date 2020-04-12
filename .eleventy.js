const cheerio = require('cheerio');
const { DateTime } = require('luxon');
const fs = require('fs');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-table-of-contents');
const minifier = require('html-minifier');
const { PurgeCSS } = require('purgecss');
const rss = require('@11ty/eleventy-plugin-rss');
const sass = require('node-sass');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const length = require('./src/utils/length');
const { categories, tags, mapTaxonomy } = require('./src/utils/taxonomy');

function addCollections(eleventyConfig) {
  eleventyConfig.addCollection('posts', function (collection) {
    const posts = collection.getFilteredByGlob('src/posts/*.md').reverse();
    return posts.map((a) => {
      let related = [];
      posts.forEach((b) => {
        if (a.data.permalink !== b.data.permalink) {
          const alpha = a.data.categories.concat(a.data.tags).sort();
          const beta = b.data.categories.concat(b.data.tags).sort();

          const matches = alpha.filter((keyword) => {
            return beta.includes(keyword);
          });

          const score = matches.length;
          if (score > 1) {
            related.push({
              title: b.data.title,
              url: b.data.external || b.url,
              language: b.data.language,
              isExternal: !!b.data.external,
              categories: b.data.categories,
              score,
            });
          }
        }
      });
      a.data.related = related.sort((a, b) => b.score - a.score).slice(0, 5);
      return a;
    });
  });

  function categoryCollectionFactory(collection, category) {
    return collection
      .getFilteredByGlob('src/posts/*')
      .reverse()
      .filter((post) => post.data.categories.includes(category));
  }

  eleventyConfig.addCollection('art', (collection) =>
    categoryCollectionFactory(collection, 'art')
  );
  eleventyConfig.addCollection('coding', (collection) =>
    categoryCollectionFactory(collection, 'coding')
  );
  eleventyConfig.addCollection('games', (collection) =>
    categoryCollectionFactory(collection, 'games')
  );

  eleventyConfig.addCollection('sitemap', function (collection) {
    const pages = collection.getFilteredByGlob('src/pages/*');
    const posts = collection
      .getFilteredByGlob('src/posts/*')
      .filter((item) => !item.data.external);
    const categoryLists = Object.keys(categories).map((category) => ({
      url: '/categories/' + category,
    }));
    const tagLists = Object.keys(tags).map((tag) => ({ url: '/tags/' + tag }));
    return [...pages, ...posts, ...categoryLists, ...tagLists];
  });
}

function addFilters(eleventyConfig) {
  eleventyConfig.addFilter('excerpt', (html) => {
    const $ = cheerio.load(html);
    return $('p').first().text();
  });

  eleventyConfig.addFilter('length', length);
  eleventyConfig.addFilter('taxonomy', mapTaxonomy);

  eleventyConfig.addFilter('readableDate', (date) => {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLL dd, yyyy');
  });
  eleventyConfig.addFilter('htmlDateString', (date) => {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('canonical', (url) => {
    return 'https://manu.ninja' + url.replace(/(\/|index.html)$/g, '');
  });
  eleventyConfig.addFilter('slug', (url) => {
    return url.replace(/(\/|index.html)/g, '');
  });

  eleventyConfig.addFilter('safeTitleWrap', (title) => {
    const tokens = title.split(' ');
    const end = [tokens.pop(), tokens.pop()];
    return (
      tokens.join(' ') +
      (end[0].length + end[1].length < 10 ? '&nbsp;' : ' ') +
      end[1] +
      '&nbsp;' +
      end[0]
    );
  });
}

function addShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('currentDate', () => new Date().toISOString());
  eleventyConfig.addShortcode('currentYear', () => `${new Date().getFullYear()}`);
}

module.exports = function (eleventyConfig) {
  addCollections(eleventyConfig);
  addFilters(eleventyConfig);
  addShortcodes(eleventyConfig);

  eleventyConfig.addPassthroughCopy({ static: '.' });

  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(syntaxHighlight);

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
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }
    return content;
  });

  eleventyConfig.addTransform('styles', async (content, path) => {
    const { css } = sass.renderSync({
      file: __dirname + '/src/styles/index.scss',
      style: 'compressed',
    })
    fs.writeFileSync(__dirname + '/public/styles.css', css);
    if (path.endsWith('.html')) {
      const purgeCSSResult = await new PurgeCSS().purge({
        content: [path],
        css: ['public/styles.css'],
      });
      return content.replace(
        '<style></style>',
        `<style>${purgeCSSResult[0].css}</style>`
      );
    }
    return content;
  });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};

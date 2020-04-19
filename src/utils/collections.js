const { categories, tags } = require('./taxonomy');

function relatedPost(post) {
  return {
    title: post.data.title,
    url: post.data.external || post.url,
    language: post.data.language,
    isExternal: !!post.data.external,
    categories: post.data.categories,
  };
}

function categoryCollectionFactory(collection, category) {
  return collection
    .getFilteredByGlob('src/posts/*')
    .reverse()
    .filter((post) => post.data.categories.includes(category));
}

module.exports = {
  posts(collection) {
    const posts = collection.getFilteredByGlob('src/posts/*.md').reverse();
    return posts.map((a) => {
      let related = [];
      posts.forEach((b) => {
        if (a.data.permalink !== b.data.permalink) {
          const alpha = [...a.data.categories, ...a.data.tags].sort();
          const beta = [...b.data.categories, ...b.data.tags].sort();

          const matches = alpha.filter((keyword) => {
            return beta.includes(keyword);
          });

          const score = matches.length;
          if (score > 1) {
            related.push(Object.assign(relatedPost(b), { score }));
          }
        }
      });
      a.data.related = related.sort((a, b) => b.score - a.score).slice(0, 5);
      return a;
    });
  },
  art(collection) {
    return categoryCollectionFactory(collection, 'art');
  },
  coding(collection) {
    return categoryCollectionFactory(collection, 'coding');
  },
  games(collection) {
    return categoryCollectionFactory(collection, 'games');
  },
  sitemap(collection) {
    const pages = collection.getFilteredByGlob('src/pages/*');
    const posts = collection
      .getFilteredByGlob('src/posts/*')
      .filter((item) => !item.data.external);
    const categoryLists = Object.keys(categories).map((category) => ({
      url: '/categories/' + category,
    }));
    const tagLists = Object.keys(tags).map((tag) => ({ url: `/tags/${tag}/` }));
    return [...pages, ...posts, ...categoryLists, ...tagLists];
  },
};

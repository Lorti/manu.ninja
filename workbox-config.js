module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{html,woff,woff2,svg}', 'author.jpg'],
  swDest: 'public/sw.js',
  runtimeCaching: [
    {
      urlPattern: /\.(?:gif|jpg|png|mp4)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxAgeSeconds: 3600,
          maxEntries: 24,
        },
      },
    },
  ],
};
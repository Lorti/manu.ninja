---
path: /scaffolding-a-progressive-web-app-using-vue-cli-3
title: Scaffolding a Progressive Web App using Vue CLI 3
htmlTitle: Scaffolding a Progressive Web App using Vue&nbsp;CLI&nbsp;3
date: 2018-12-24
categories: [coding]
tags: [meetups, pwa, slides, tools, vue]
thumbnail: /author.jpg
---

Vue CLI 3 has been released and it’s completely different from its previous version. Discover how it simplifies your toolchain, reduces configuration fatigue and improves your developer experience.

This guide is intended for beginners who've never used Vue as well as veterans who've already used Vue CLI 2 and wish to quickly start building projects with Vue CLI 3.

## Install Vue CLI 3

recommended to globally install Vue CLI 3
remove Vue CLI 2 to be safe
you can use the package manager you prefer

```bash
npm uninstall vue-cli -g
yarn global remove vue-cli
```

```bash
npm install -g @vue/cli
yarn global add @vue/cli
```

## Create a new project

```bash
vue create my-project
```

a few prompts, as Vue CLI 2
select only Babel and Linter (ESLint + Airbnb), and place all config in package.json
4 directories, 10 files

```bash
my-project
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.vue
    ├── assets
    │   └── logo.png
    ├── components
    │   └── HelloWorld.vue
    └── main.js
```

```bash
cd my-project
npm run serve
```

```json
{
  "dependencies": {
   "vue": "^2.5.17"
  },
  "devDependencies": {
   "@vue/cli-plugin-babel": "^3.0.3",
   "@vue/cli-plugin-eslint": "^3.0.3",
   "@vue/cli-service": "^3.0.3",
   "vue-template-compiler": "^2.5.17"
  }
}
```

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build"
  }
}
```

## Add and configure the official Progressive Web App plugin

```bash
vue add @vue/pwa
```

`@vue/cli-plugin-pwa`

`vue.config.js`

```js
module.exports = {
  pwa: {
    name: 'Japanese Phrasebook',
    themeColor: '#f44336',
    msTileColor: '#f44336',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
    workboxOptions: {
      cacheId: 'phrasebook',
      importWorkboxFrom: 'local',
      navigateFallback: 'shell.html',
      navigateFallbackWhitelist: [/^((?!\/404).)*$/],
    },
  },
};
```

## Configure webpack

```js
// vue.config.js
module.exports = {
 configureWebpack: {
   plugins: [
     new MyPlugin()
   ],
 }
};
```

```js
module.exports = {
 configureWebpack: config => {
   if (process.env.NODE_ENV === 'production') {
     // You can mutate the config directly …
   }
   // … or return an object which will be merged.
 }
};
```

```js
module.exports = {
 chainWebpack: config => {
   config
     .plugin('html')
     .tap(args => {
       return [/* … */]
     })
 }
};
```

## Troubleshoot relative file imports

[Documentation](https://cli.vuejs.org/guide/html-and-static-assets.html#building-a-multi-page-app)

> Internally, we use `file-loader` to determine the final file location with version hashes and correct public base paths, and use `url-loader` to conditionally inline assets that are smaller than 4kb, reducing the amount of HTTP requests.

```html
<img src="./assets/logo.svg" alt="Logo">
<!-- becomes -->
<img src="./assets/logo.ec9a16c8.svg" alt="Logo">
```

```bash
vue inspect --rule svg
```

```
{
  test: /\.(svg)(\?.*)?$/,
  use: [{
    loader: 'file-loader',
    options: { name: 'img/[name].[hash:8].[ext]' }
  }]
}
```

`vue.config.js`

```js
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('svg');
    config.module.rule('images')
      .test(/\.(svg|png|jpe?g|gif|webp)(\?.*)?$/);
  }
};
```

```html
<img src="./assets/logo.svg" alt="Logo">
<!-- becomes (after modifying default config) -->
<img src="data:image/svg+xml;base64,..." alt="Logo">
```

## Prerendering pages for SEO

[PrerenderSPAPlugin](https://github.com/chrisvfritz/prerender-spa-plugin)

`vue.config.js`

```js
const path = require('path');
const cheerio = require('cheerio');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      return {};
    }
    return {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: config.output.path,
          routes: ['/', '/404', /* … */],
          renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
            renderAfterDocumentEvent: 'rendered',
          }),
          postProcess(context) {
            if (context.route === '/404') {
              context.outputPath = path.join(config.output.path, '/404.html');
            }
            const $ = cheerio.load(context.html);
            $('[src*="https://www.google-analytics.com/analytics.js"]').remove();
            context.html = $.html();
            return context;
          },
        }),
      ],
    };
  }
};
```

## Full example application

<https://www.japanese-phrasebook.com/> 
[master Branch](https://github.com/Lorti/phrasebook/tree/master)
[vue-cli-2 Branch](https://github.com/Lorti/phrasebook/tree/vue-cli-2)
[vue-cli-3 Branch](https://github.com/Lorti/phrasebook/tree/vue-cli-3)

## Audit with WebPagetest and Lighthouse

![](/images/vue-cli-3-pwa/webpagetest-score.png)

```
Leverage browser caching of static assets: 60/100

FAILED - (15.0 minutes) - https://www.googletagmanager.com/gtag/js?id=UA-122315460-1
FAILED - (45.7 minutes) - https://www.google-analytics.com/analytics.js
```

## Conclusion

## Resources

* [Vue CLI 3 Guide](https://cli.vuejs.org/guide/)
* [Vue CLI 3 Configuration Reference](https://cli.vuejs.org/config/)

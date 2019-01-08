---
path: /scaffolding-a-progressive-web-app-using-vue-cli-3
title: Scaffolding a Progressive Web App using Vue CLI 3
htmlTitle: Scaffolding a Progressive Web App using Vue&nbsp;CLI&nbsp;3
date: 2018-12-24
categories: [coding]
tags: [meetups, pwa, slides, tools, vue]
thumbnail: /images/vue-cli-3-pwa/scaffolding-a-progressive-web-app-using-vue-cli-3.jpg
---

Vue CLI 3 has been released and it's completely different from its previous version. Discover how it simplifies your toolchain, reduces configuration fatigue and improves your developer experience.

This guide is intended for beginners who've never used Vue as well as veterans who've already used Vue CLI 2 and wish to quickly start building projects with Vue CLI 3.

## Table of Contents

1. [Vue? Vue CLI?](#vue-vue-cli)
1. [Install Vue CLI 3](#install-vue-cli-3)
1. [Create a new project](#create-a-new-project)
1. [Add and configure the official Progressive Web App plugin](#add-and-configure-the-official-progressive-web-app-plugin)
1. [Configure webpack](#configure-webpack)
1. [Troubleshoot relative file imports](#troubleshoot-relative-file-imports)
1. [Prerender pages for SEO](#prerender-pages-for-seo)
1. [Audit with WebPagetest and Lighthouse](#audit-with-webpagetest-and-lighthouse)
1. [Conclusion](#conclusion)
1. [Resources](#linksresources)

## Vue? Vue CLI?

> Vue (/vjuː/) is a progressive framework for building user interfaces. 

You may already heard that, if you've stumbled upon this guide. The word "progressive" means, that there's a very quick learning curve as you can start to use just a little of what the framework provides and gradually use and learn more and more concepts. But what is the Vue CLI?

The first and second versions of the Vue CLI have been primarily a tool for scaffolding Vue projects. After the CLI had prepared a project for you you wouldn't need or use the Vue CLI anymore. The Vue CLI 3 is different, in that it is meant as a companion for Vue developers. It's a full system for rapid Vue development that you'll be using constantly while developing your application.

> Vue CLI is a <strike>tool for scaffolding Vue projects</strike> full system for rapid development.

The new CLI is also more in line with Vue's goals of being a progressive framework. Whereas the Vue CLI 2 scaffolded a large project with 500-1000 lines of configuration code in multiple files for you (when using the webpack template), the Vue CLI 3 hides away this complexity and let's you start with a very simple setup, allowing you to fully customize its parts and go deeper as soon as, and only if, you need it.

## Install Vue CLI 3

The first thing to do, obviously, is to install Vue CLI 3. Like with any command-line tool, the Vue.js team recommends to globally install Vue CLI 3. However, before you do that, you should remove Vue CLI 2, to avoid any conflicts caused by remaining files. 

For both removing Vue CLI 2 and installing Vue CLI 3 you can use the package manager you prefer (npm or Yarn) and run the following commands:

```bash
npm uninstall vue-cli -g
npm install -g @vue/cli
```

```bash
yarn global remove vue-cli
yarn global add @vue/cli
```

Take note, that the Vue CLI 3 package is `@vue/cli`, not `vue-cli`. Every npm package that has to do with Vue CLI 3 is prefixed with `@vue`.

## Create a new project

You now have a global `vue` tool which you can use to do various things. Run `vue --help` to get a list of all commands. The first command we'll be using is `vue create`. You call it with the name of the application you want to create:

```bash
vue create my-project
```

The Vue CLI then presents you with a few prompts. These kinds of prompts will show up often when working with the Vue CLI.

It asks you to pick a preset or manually select your application's features. For this example we'll be going the manual route, so that we can start with a simple and minimal application. Select only `Babel` and `Linter` (`ESLint + Airbnb`) and place all config in `package.json`.

![Vue CLI v3.0.3
  ? Please pick a preset: Manually select features
  ? Check the features needed for your project: Babel, Linter
  ? Pick a linter / formatter config: ESLint + Airbnb config
  ? Pick additional lint features: Lint on save
  ? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In p
  ackage.json
  ? Save this as a preset for future projects? No](/images/vue-cli-3-pwa/vue-create.png)

The CLI will then download and resolve the necessary dependencies, install CLI plugins and print progress output. When it's done you can open the created folder and run `npm run serve`, which will fire up a hot-reloading development server at `http://localhost:8080/`.
 
```bash
cd my-project
npm run serve
```

### What's in a project?

Let's now inspect the generated folder and you'll find 4 directories with 10 files:

```txt
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

If you are familiar with Vue CLI 2 you'll notice right away, that these are way fewer files with even fewer lines of code (compared to running [`vue init webpack my-project`](https://github.com/vuejs-templates/webpack/tree/develop/template) back then). That means the projects generated by Vue CLI 3 are easier to understand and demand less time and effort to get an overview of.

The same is true for the project's `package.json` file. Whereas a project created with Vue CLI 2 had dozens of dependencies listed, our application has only a few dependencies (this of course depends on what you've selected in the prompts):

```json
{
  "dependencies": {
    "vue": "^2.5.21"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.2.0",
    "@vue/cli-plugin-eslint": "^3.2.0",
    "@vue/cli-service": "^3.2.0",
    "@vue/eslint-config-airbnb": "^4.0.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^5.8.0",
    "eslint-plugin-vue": "^5.0.0",
    "vue-template-compiler": "^2.5.21"
  }
}
```

We'll get into the details of the `@vue` packages in the next sections. Before that let's head to the `scripts` field.

### Understanding `vue-cli-service`

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  }
}
```

When you've run `npm run serve` you might have already noticed, that npm runs the `vue-cli-service serve` command. The `vue-cli-service` is a binary that was installed when creating the project. It provides a `serve`, `build` and `lint` command which take over tasks that have been previously (in Vue CLI 2) been set up in each project individually.

The `vue-cli-service` is what allows the Vue CLI 3 to scaffold projects without hundreds of lines of webpack configuration. It strips away a lot of configuration while also allowing you to benefit from updates to the `vue-cli-service`, without having to adjust your project's configuration. In Vue CLI 2 updates to a template would go by your project unnoticed, if you did not invest the time to manually apply updates and resolve conflicts.

## Add and configure the official Progressive Web App plugin

We've already talked about the `@vue/cli-service` listed in your project's `devDependencies`. The other two packages, `@vue/cli-plugin-babel` and `@vue/cli-plugin-eslint` are plugins for the Vue CLI 3. 

### Understanding Vue CLI's plugins

The Vue CLI 3 is centered around plugins that can augment either the development or functionality of your application. They can be individually added, removed and updated, in most cases without you having to change anything about your application or configuration. Most plugins also have a sensible default configuration, that means, you don't even have to configure that plugin, only if you want to change its default behaviour. This goes so far as to many plugins not even placing their default configuration in your `package.json` or their separate configuration files.

### `@vue/cli-plugin-babel`

The already installed `@vue/cli-plugin-babel` transforms your ES2015+ code according to the configuration in `babel.config.js`. By default it uses a `@vue/app` preset, making sure your application works on all browsers supported by the Vue framework itself (), and the `browserlist` field in your `package.json`. This field is also used for PostCSS -- you can read the [Browser Compatibility](https://cli.vuejs.org/guide/browser-compatibility.html) section in the Vue CLI 3 documentation for further details.

### `@vue/cli-plugin-eslint`

`@vue/cli-plugin-eslint` checks your code against the `eslintConfig` configuration in your `package.json` files. It does this whenever you make changes to your code (while running the development server via `npm run dev`).

### Adding the Progressive Web App plugin 

Now, if we want to add further plugins we can use the `vue add` command, followed by either the full name of the plugin, or a shorthand version. The following two commands lead to the same result:

```bash
vue add @vue/pwa
vue add @vue/cli-plugin-pwa
```

This will install the [`@vue/cli-plugin-pwa`](https://www.npmjs.com/package/@vue/cli-plugin-pwa) package, which adds a lot of Progressive Web App functionality to your project. After running it will tell you that it has changed (or added) the following files:

```txt
├── package-lock.json
├── package.json
├── public
│   ├── img
│   │   └── icons
│   │       ├── android-chrome-192x192.png
│   │       ├── android-chrome-512x512.png
│   │       ├── ...
│   ├── manifest.json
│   └── robots.txt
└── src
   ├── main.js
   └── registerServiceWorker.js
```

The plugin added itself and the `register-service-worker` package as dependencies to the `package.json` file. It also added a few files to the `public` folder, all of which you can edit to match your application: a `manifest.json`, `robot.txt` and a set of icons for various devices. It also adds a a few lines that initialize a Service Worker (in `main.js` and `registerServiceWorker.js`), via Google's [Workbox](https://developers.google.com/web/tools/workbox/) libray.

We'll talk about how to configure the Service Worker in the next section. If you're unsure what a Service Worker is or what it's used for in a Progressive Web App -- keep in mind that we're only using it for caching network requests, so that your app (or at least parts of your app) are available offline or in unreliable network conditions.

### Testing the Progressive Web App plugin

The Service Worker is disabled in development mode, because local changes may not show up while you develop your application when files are being cached. This means if you want to test your Progressive Web App you'll have to build your Vue application first. This can be done by simply running `npm run build`. 

#### Build (and serve) your application

You will most likely encounter linting errors when trying to run `npm run build`. To fix them automatically just run `npm run lint --fix` and it will auto-fix `main.js` and `registerServiceWorker.js` to match your ESLint settings.

Now that you've build you application open the `dist` folder that was created and serve your application. You can do this with `npx http-server` or any other HTTP server that can serve files from a folder.

#### Clear site data

It's also a good idea to clear Service Workers and Cache Storage for <http://localhost:8080/>, if you have previously served another (Vue) project at this URL. If you don't want to do this you can also just use the browser's incognito mode.

![Chrome Dev Tools > Application > Clear storage > Clear site data](/images/vue-cli-3-pwa/clear-site-data.png)

#### Inspect cache and test offline functionality

When you visit your application in the browser the Service Worker automatically caches all HTML, JavaScript, CSS and image files. You can inspect the cache storage in your browser's development tools.

![Cache Storage](/images/vue-cli-3-pwa/cache-storage.png)

Next, you should test if the Service Worker correctly proxies network requests when you're offline, and returns the cached results. You can unplug your Ethernet cable, disconnect from your Wi-Fi, or use a network filter in your browser's development tools. If you do so you should still be able to visit your site, as (almost) all assets are provided by the Service Worker.

![Network ✔️ Offline (from ServiceWorker)](/images/vue-cli-3-pwa/from-service-worker.png)

### Configuring the Progressive Web App plugin

You have already seen where many libraries (Babel, PostCSS, ESLint …) can be configured: In dedicated config files or in `package.json` fields. For many plugins, especially official Vue CLI plugins in the `@vue` namespace there's another place for configuration: `vue.config.js`. 

The `vue.config.js` does not exist when you initially create a project with  Vue CLI 3. You have to create it youself if you want to change the default configuration of your Vue CLI plugins.

Here's an example configuration for my [Japanese Phrasebook](https://japanese-phrasebook.com/) Progressive Web App built with Vue CLI 3:

```js
module.exports = {
  // … other Vue CLI plugin options …
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
      // … other Workbox options …
    },
  },
};
```

 All configuration options are listed in [@vue/cli-plugin-pwa's README.md](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa#configuration). You don't have to change any of the default options, if you don't want to, but I suggest that you set the `name`, `themeColor` and `msTileColor` correctly.

TODO 
You can even debug your app's manifest.json in your browser's developer tools.

## Configure webpack

At some point in your project's life you'll want to edit the webpack configuration. You probably want to add another webpack plugin or edit an existing webpack loader (we'll be doing both these tasks in the following sections). Vue CLI 3 allows you to edit the webpack configuration inside your `vue.config.js` file in three different ways.

### Option 1: Provide an object to the `configureWebpack` property

If you simply pass an object to the `configreWebpack` property it will be merged with the existing webpack config. This way you can easily add new plugins and loaders.

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

### Option 2: Provide a function to the `configureWebpack` property

If you want to have more fine-grined control you can assign a function to the `configureWebpack` property. It receives a `config` argument which you can mutate directly. This allows you to have different configurations for development and production builds.

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

### Option 3: Use the (advanced) chaining API

If you want full control, edit existing plugins and loaders or prefer a chaining API you can pass a function to the `chainWebpack` property (not `configureWebpack`). It allows you to make configuration changes using the chaining API provided by [webpack-chain](https://github.com/neutrinojs/webpack-chain). With it you can easily tap into an existing plugin or loader and modify its settings.

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

We'll be using the chaining API for a simple example in the next section, which should make things clear.

## Troubleshoot relative file imports

The Vue CLI 3 [documentation](https://cli.vuejs.org/guide/html-and-static-assets.html#building-a-multi-page-app) states that static assets are inlined when they are referenced using a relative path and smaller than 4KB:

> Internally, we use `file-loader` to determine the final file location with version hashes and correct public base paths, and use `url-loader` to conditionally inline assets that are smaller than 4kb, reducing the amount of HTTP requests.

Although, when you reference an SVG file it won't get inlined. The file only gets a version hash for cache busting when building your application:

```html
<img src="./assets/logo.svg" alt="Logo">
<!-- becomes -->
<img src="./assets/logo.ec9a16c8.svg" alt="Logo">
```

### Inspecting your webpack configuration

To "debug" the webpack configuration and find out why the SVG doesn't get inlined the Vue CLI 3 provides an `inspect` command. If you run it without any arguments it will output the complete webpack configuration it uses when building your application.

To narrow your search down you can use the `--rules` or `--plugins` options. When you know the exact name of your rule you can also just output a single webpack rule:

```bash
vue inspect --rule images
```

```js
{
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 4096,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      }
    }
  ]
}
```

As you can see, images are loaded with the URL loader when they are smaller than the 4096 bytes limit. If they are larger, the file loader is used as a fallback. 

But what's that? The `test` regular expression only lists PNGs, JPGs, GIFs and WebPs as images. What about SVGs? SVGs have their own default rule:

```bash
vue inspect --rule svg
```

```js
{
  test: /\.(svg)(\?.*)?$/,
  use: [{
    loader: 'file-loader',
    options: { name: 'img/[name].[hash:8].[ext]' }
  }]
}
```

### Use the chaining API to edit the `images` rule

I personally want SVGs to be handled exactly as any other image type. To accomplish this you can edit the webpack configruation in `vue.config.js`.

We'll use the chaining API to delete the `svg` rule and edit the `test` regular expression of the `images` rule:

```js
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('svg');
    config.module.rule('images')
      .test(/\.(svg|png|jpe?g|gif|webp)(\?.*)?$/);
  }
};
```

With these changes the `logo.svg` gets inlined (using the data URI scheme) as long as it's smaller than 4096 bytes:

```html
<img src="./assets/logo.svg" alt="Logo">
<!-- becomes (after modifying default config) -->
<img src="data:image/svg+xml;base64,..." alt="Logo">
```

## Prerender pages for SEO

Your Progressive Web App is already up and running. This section explains an optional step you can take for search engine optimization (SEO): Configuring the [Prerender SPA Plugin](https://github.com/chrisvfritz/prerender-spa-plugin) webpack plugin to prerender certain pages (or routes) of your application. This gives bots the ability to crawl your public-facing pages without having to execute JavaScript.

First run `npm install prerender-spa-plugin`, then edit your `vue.config.js`:

```js
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  // … other Vue CLI options …
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      return {};
    }
    return {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: config.output.path,
          routes: ['/', '/about', /* … */],
          renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
            renderAfterDocumentEvent: 'rendered',
          }),
            // … other Prerender SPA Plugin options …
        }),
      ],
    };
  }
};
```

The plugin listens for a `rendered` custom event to take its snapshot, so you have to emit it when your app has finished rendering. You can do so from your root Vue instance, for example:

```js
new Vue({
  /* … */
  mounted() {
    document.dispatchEvent(new Event('rendered'));
  },
});
```

You might also want to add the `data-server-rendered` custom attribute to your application's `public/index.html` file, so that Vue correctly takes over the static HTML sent by the server (a process called "client side hydration"):

```html
<body>
  <div id="app" data-server-rendered="true"></div>
</body>
```

When you run a production build the plugin will now add an `index.html`, `about/index.html` and any other route you have configured to your `dist` directory.

Please have a look at the [Prerender SPA Plugin](https://github.com/chrisvfritz/prerender-spa-plugin) documentation for all its options, as elaborating on the plugin would go beyond the scope of this guide. You can find a more advanced example in the `vue.config.js` file of my [full example application](#full-example-application) in the links/resources section.

## Audit with WebPagetest and Lighthouse

If you follow this guide you should be able to achieve an optimal [Lighthouse](https://developers.google.com/web/tools/lighthouse/) score with the help of Vue CLI 3, as well as straight A’s in [WebPagetest](https://www.webpagetest.org/).

![100 Lighthouse PWA Score
A First Byte Time
A Keep-alive Enabled
A Compress Transfer
A Compress Images
D Cache static content
✔ Effective use of CDN](/images/vue-cli-3-pwa/webpagetest-score.png)

Did I say straight A’s? The above results are actually for <https://www.japanese-phrasebook.com/>, the [full example application](#full-example-application) in the links/resources section. It uses Google Analytics, which does not send caching headers, so their scripts are always up to date:

```
Leverage browser caching of static assets: 60/100

FAILED - (15.0 minutes) - https://www.googletagmanager.com/gtag/js?id=UA-122315460-1
FAILED - (45.7 minutes) - https://www.google-analytics.com/analytics.js
```

## Conclusion

We did talk about

* using the Vue CLI 3 to create a project
* adding and configuring Vue CLI plugins,
* configuring the Progressive Web App plugin,
* configuring webpack,
* prerendering pages for SEO
* and building your application.

We did not tap on

* UI
* Presets (for bypassing the prompts when creating a project)
* Instant Prototyping
* Build Targets (including the `--modern` flag)
* Plugin Development

which I may highlight in further articles, if you're interested.

If you want to see a complete Progresive Web App build with Vue CLI 3 have a look at the [full example application](#full-example-application) in the links/resources section. I have kept the Vue CLI 2 and Vue CLI 3 snapshots in separate branches, if you're interested in the exact differences when upgrading/migrating to Vue CLI 3.

I want this guide to be as helpful as possible, especially for beginners. If you have questions, suggestions or any feedback please leave them in the comments or contact me on Twitter.

## Links/Resources

* [Vue CLI 3 Guide](https://cli.vuejs.org/guide/)
* [Vue CLI 3 Configuration Reference](https://cli.vuejs.org/config/)
* [Service Workers (Introduction)](https://developers.google.com/web/fundamentals/primers/service-workers/)

### Official Plugins

* [@vue/cli-plugin-babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)
* [@vue/cli-plugin-typescript](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript)
* [@vue/cli-plugin-eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint)
* [@vue/cli-plugin-pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)
* [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest)
* [@vue/cli-plugin-unit-mocha](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha)
* [@vue/cli-plugin-e2e-cypress](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-cypress)
* [@vue/cli-plugin-e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch)

### Full example application

* <https://www.japanese-phrasebook.com/> 
* [master Branch](https://github.com/Lorti/phrasebook/tree/master)
* [vue-cli-2 Branch](https://github.com/Lorti/phrasebook/tree/vue-cli-2)
* [vue-cli-3 Branch](https://github.com/Lorti/phrasebook/tree/vue-cli-3)

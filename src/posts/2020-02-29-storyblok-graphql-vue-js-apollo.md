---
layout: layouts/post.njk
permalink: /headless-cms-storyblok-graphql-vue-js-apollo/
external: https://www.storyblok.com/tp/headless-cms-storyblok-graphql-vue-js-apollo
title: How to use Storyblok’s GraphQL endpoint with Vue.js and Apollo
description: Learn how to use Storyblok’s GraphQL API with Vue.js and Apollo. The full examples in this article let you combine the Headless CMS with Vue.js in just a few minutes.
date: 2020-02-29
categories: [coding]
tags: [graphql, tools, vue]
thumbnail: /author.jpg
---

Learn how to use Storyblok’s GraphQL API with Vue.js and Apollo. The full examples in this article let you combine the Headless CMS with Vue.js in just a few minutes.

<!--

In this tutorial, you will learn how to use Storyblok's GraphQL API with Vue.js and Apollo.

## Setup

If you haven't already please install the latest Vue CLI globally.

```
npm install -g @vue/cli
```

Let’s start with setting up the project using Vue CLI.

```
vue create storyblok-graphql-vue-apollo
cd storyblok-graphql-vue-apollo
npm run serve
```

Next we'll install the GraphQL client and Vue.js bindings.

```
npm install --save vue-apollo graphql apollo-boost
```

## Initialize the GraphQL client

Open the file `src/main.js` and initialize the Apollo client with Storyblok's GraphQL endpoint `https://gapi.storyblok.com/v1/api`.

Grab the “preview” token from your Storyblok space and set it as header for every request.

```js
import Vue from 'vue';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import App from './App.vue';

const apolloClient = new ApolloClient({
  uri: 'https://gapi.storyblok.com/v1/api',
  headers: {
    token: 'YOUR_TOKEN',
    version: 'draft',
  },
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);

new Vue({
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
```

## Make your first GraphQL query

Storyblok's GraphQL schema is generated from your content types.

For every content type Storyblok generates two fields.

* One for receiving a single item: [Humanized Name]Item
* And one for receiving a multiple items: [Humanized Name]Items

So if you have created a content type with the name `page` you will have the fields `PageItem` and `PageItems` in GraphQL.

To get the documented schema definition of your content type you can use the GraphQL playground. Exchange `YOUR_TOKEN` with your “preview” token and open the link `http://gapi-browser.storyblok.com/?token=YOUR_TOKEN`.

In the following example we query the `home` content item and output the page name in `src/App.vue`.

```html
<template>
  <div id="app">
    <ApolloQuery
      :query="gql => gql`
        query PageItemQuery($id: ID!) {
          PageItem(id: $id) {
            name
          }
        }
      `"
      :variables="{ id: 'home' }">
      <template v-slot="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Loading...</div>
        <div v-else-if="error" class="error apollo">An error occurred</div>
        <div v-else-if="data" class="result apollo">{{data.PageItem.name}}</div>
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>
```

You need to configure your project to transpile the `gql` string template tag in `vue.config.js`.

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.transpileOptions = {
          transforms: {
            dangerousTaggedTemplateString: true,
          },
        };
        return options;
      });
  },
};
```

## How to render nested components

Storyblok has components as first class citizens on board. This means that you can easily create advanced layouts and nest components inside each other. In the next step we will create a few more Vue.js components to render the demo content that you get when you create a new Storyblok space.

First change `App.vue` to render dynamic components. After that we'll create the missing components.

```html
<template>
  <div id="app">
    <ApolloQuery
      :query="gql => gql`
        query PageItemQuery($id: ID!) {
          PageItem(id: $id) {
            id
            slug
            content {
              _uid
              component
              body
            }
          }
        }
      `"
      :variables="{ id: 'home' }">
      <template v-slot="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Loading...</div>
        <div v-else-if="error" class="error apollo">An error occurred</div>
        <div v-else-if="data" class="result apollo">
          <component :blok="data.PageItem.content" :is="data.PageItem.content.component"/>
        </div>
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>
```

### Create src/components/Page.vue

```html
<template>
  <div>
    <template v-for="item in blok.body">
      <component :key="item._uid" :blok="item" :is="item.component"></component>
    </template>
  </div>
</template>

<script>
export default {
  props: ['blok'],
};
</script>
```

## Create src/components/Grid.vue

```html
<template>
  <div class="grid">
    <template v-for="item in blok.columns">
      <component :key="item._uid" :blok="item" :is="item.component"></component>
    </template>
  </div>
</template>

<script>
export default {
  props: ['blok'],
};
</script>
```

### Create src/components/Feature.vue

```html
<template>
  <div class="column feature">
    {{blok.name}}
  </div>
</template>

<script>
export default {
  props: ['blok'],
};
</script>
```

### Create src/components/Teaser.vue

```html
<template>
  <div class="teaser">
    {{blok.headline}}
  </div>
</template>

<script>
export default {
  props: ['blok'],
};
</script>
```

Now you register all components in `src/main.js`.

```js
import Vue from 'vue';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import Page from '@/components/Page.vue';
import Grid from '@/components/Grid.vue';
import Feature from '@/components/Feature.vue';
import Teaser from '@/components/Teaser.vue';
import App from './App.vue';

const apolloClient = new ApolloClient({
  uri: 'https://gapi.storyblok.com/v1/api',
  headers: {
    token: 'YOUR_TOKEN',
    version: 'draft',
  },
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);

Vue.component('page', Page);
Vue.component('grid', Grid);
Vue.component('feature', Feature);
Vue.component('teaser', Teaser);

new Vue({
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
```

At the end (with some CSS added) you should have the following result when opening your app in the browser:

![](storyblok-rendering.png)

## How to add Storyblok’s Visual Editor

Adding Storyblok’s visual editing capability just requires a few more steps. In the end, your content editors will thank you for going on that extra mile.

First add the Javascript bridge to the file `public/index.html` and replace `YOUR_TOKEN` with your “preview” token.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="//app.storyblok.com/f/storyblok-latest.js?t=YOUR_TOKEN"></script>
    <!-- built files will be auto injected -->
  </body>
</html>
```

Next, install the Storyblok binding for Vue.js to make elements clickable by the user.

```
npm install storyblok-vue --save
```

All that needs to be done is to add `v-editable="blok"` to your components and pass the current component object to it.

Here's an example of how to do that in the file `src/components/Teaser.vue`:

```html
<template>
  <div class="teaser" v-editable="blok">
    {{blok.headline}}
  </div>
</template>
```

After you changed all of the components you can use the event listener `window.storyblok.on` to reload the app after content has been changed in the editor. You can do this in the `created` hook of the `App.vue` component.

```html
<script>
export default {
  created() {
    window.storyblok.on(['change', 'published'], () => {
      this.$apollo.queries.query.options.fetchPolicy = 'network-only';
      this.$apollo.queries.query.refresh();
    });
  },
};
</script>
```

The last step is to configure the preview URL in Storyblok and check if it is working. In the end, you should have a clickable teaser element that will update the content on the click of the “Save” button.

-->

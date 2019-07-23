---
path: /url-shortener-with-graphcms-vue-js-and-netlify-functions
title: URL Shortener with GraphCMS, Vue.js and Netlify Functions
htmlTitle: URL&nbsp;Shortener with GraphCMS, Vue.js and Netlify&nbsp;Functions
date: 2019-02-02
categories: [coding]
tags: [graphql, vue, netlify]
thumbnail: /author.png
sharing: true
---

After IaaS, PaaS, BaaS and SaaS, FaaS – Function as a Service – is the latest trend in cloud computing, which is also often called serverless computing.

![XaaS](/images/graphcms-vue-netlify-functions/xaas.png)

There are the large providers, such as AWS Lambda, Google Functions, Microsoft Azure Functions and IBM Cloud Functions, but we’re going to have a look at Netlify Functions. Netlify has a great free plan and you can host your site and functions on the same domain.

![Serverless](/images/graphcms-vue-netlify-functions/serverless.png)

Vue CLI 3, `default`

```bash
vue create url-shortener
```

```bash
cd url-shortener
npm install --save apollo-boost graphql vue-apollo vue-router
```

```js
// src/main.js
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router';

import ApolloClient from 'apollo-boost';

import App from './App.vue';
import Form from './components/Form';
import Redirector from './components/Redirector';

Vue.use(VueApollo);
Vue.use(VueRouter);

const apolloClient = new ApolloClient({
  uri: 'YOUR_GRAPHCMS_ENDPOINT',
  headers: {
    Authorization: 'Bearer YOUR_PERMANENT_AUTH_TOKEN'
  }
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

const router = new VueRouter({
  routes: [
    { path: '/', component: Form },
    { path: '/:url', component: Redirector, props: true }
  ]
});

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app');
```

```js
// src/graphql.js
import gql from 'graphql-tag';

export const URL_QUERY = gql`{
  urls: uRLs {
    id
    originalUrl
    shortUrl
  }
}`;

export const URL_MUTATION = gql`
  mutation ($originalUrl: String!, $shortUrl: String!) {
    createURL(data: {
      originalUrl: $originalUrl
      shortUrl: $shortUrl
    }) {
      id
      originalUrl
      shortUrl
    }
  }
`;
```

```html
// src/App.vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>URL Shortener</h1>
    <router-view></router-view>
  </div>
</template>
```

```
npm install --save nanoid
```

```html
// src/components/Form.vue
<template>
  <form @submit.prevent="createUrl">
    <label>
      URL <input type="text" v-model="urlInput">
    </label>
    <button type="submit">Submit</button>
    <p v-for="url in urls" :key="url.id">
      <router-link :to="`/${url.shortUrl}`">{{ url.shortUrl }}</router-link>
      → {{ url.originalUrl }}
    </p>
  </form>
</template>

<script>
import { URL_QUERY, URL_MUTATION } from '../graphql';
import nanoid from 'nanoid';

export default {
  data() {
    return {
      urlInput: '',
      urls: []
    };
  },
  apollo: {
    urls: {
      query: URL_QUERY
    },
  },
  methods: {
    async createUrl() {
      await this.$apollo.mutate({
        mutation: URL_MUTATION,
        variables: {
          originalUrl: this.urlInput,
          shortUrl: nanoid()
        },
        update: (store, { data: { createURL } }) => {
          const data = store.readQuery({ query: URL_QUERY });
          data.urls.push(createURL);
          store.writeQuery({ query: URL_QUERY, data });
        },
      });
      this.urlInput = '';
    }
  }
};
</script>
```

```html
// src/components/Redirector.vue
<template>
  <div>Redirecting to {{ originalUrl }} …</div>
</template>

<script>
import { URL_QUERY } from '../graphql';

export default {
  name: 'redirector',
  props: ['url'],
  data() {
    return {
      urls: [],
      originalUrl: ''
    };
  },
  apollo: {
    myUrls: {
      query: URL_QUERY,
      result({ data: { urls } }) {
        const url = urls.find(x => x.shortUrl === this.url);
        if (url) {
          let originalUrl = url.originalUrl;
          if (url.originalUrl.indexOf('https') !== 0) {
            originalUrl = `https://${url.originalUrl}`;
          }
          this.originalUrl = originalUrl;
          window.location = originalUrl;
        } else {
          this.$router.push('/');
        }
      }
    },
  },
};
</script>
```

<https://graphcms.com/>

![GraphCMS Schema](/images/graphcms-vue-netlify-functions/schema.png)

![GraphCMS API Explorer](/images/graphcms-vue-netlify-functions/explorer.png)

![GraphCMS Settings](/images/graphcms-vue-netlify-functions/settings.png)

![GraphCMS Content](/images/graphcms-vue-netlify-functions/content.png)

```json
{
  "name": "create-short-url",
  "version": "1.0.0",
  "scripts": {
    "serve": "netlify-lambda serve src/functions",
    "build": "netlify-lambda build src/functions"
  },
  "dependencies": {
    "graphql": "^14.1.1",
    "graphql-request": "^1.8.2",
    "nanoid": "^2.0.1",
    "validate.js": "^0.12.0"
  },
  "devDependencies": {
    "netlify-lambda": "^1.2.0"
  }
}
```

```toml
# netlify.toml
[build]
  functions = "./functions"
```

```js
// src/functions/create-short-url.js
import { GraphQLClient } from 'graphql-request'
import validate from 'validate.js';
import nanoid from 'nanoid';

const endpoint = 'YOUR_GRAPHCMS_ENDPOINT';
const authorization = 'Bearer YOUR_PERMANENT_AUTH_TOKEN';

exports.handler = function(event, context, callback) {
    const data = JSON.parse(event.body);
    const errors = validate(
        data,
        { url: { url: true } }
    );
    if (errors) {
        callback('Required parameter `url` missing or invalid.');
        return;
    }

    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            authorization
        },
    });

    const query = `
    mutation($originalUrl: String!, $shortUrl: String!) {
      createURL(data: {
        status: PUBLISHED,
        originalUrl: $originalUrl,
        shortUrl: $shortUrl
      }) {
        id
      }
    }
    `;

    const variables = {
        originalUrl: data.url,
        shortUrl: nanoid()
    };

    graphQLClient.request(query, variables)
        .then(result => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(result, undefined, 2)
            });
        })
        .catch(error => {
            callback(error);
        });
};
```

<https://www.npmjs.com/package/@workpop/graphql-proxy>

![Netlify](/images/graphcms-vue-netlify-functions/netlify.png)

```bash
curl -X POST \
  https://YOUR_NETLIFY_SUBDOMAIN.netlify.com/.netlify/functions/create-short-url \
  -H 'Content-Type: application/javascript' \
  -d '{ "url": "https://manu.ninja" }'
```

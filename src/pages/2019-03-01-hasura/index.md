---
path: /hasura
title: URL Shortener with Hasura (GraphQL), Heroku, Auth0 and Vue.js
date: 2019-03-01
categories: [coding]
tags: [vue]
thumbnail: /author.jpg
sharing: true
---

## Components

* Back-end
  * [Hasura](https://hasura.io/): Instant realtime GraphQL APIs on any Postgres application, existing or new.
  * [Heroku](https://www.heroku.com/home): Platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
  * [Auth0](https://auth0.com/): A universal authentication & authorization platform for web, mobile and legacy applications.
* Front-end
  * [Vue](https://vuejs.org/): The progressive framework for building user interfaces.
  * [Apollo Client](https://www.apollographql.com/docs/react/): A client that simplifies fetching data with GraphQL, can be used with any JavaScript front-end. 
  * [Vue Apollo](https://vue-apollo.netlify.com/): This library integrates Apollo/GraphQL in your Vue components with declarative queries.

## Overview

1. https://docs.hasura.io/1.0/graphql/manual/getting-started/index.html --> `https://<YOUR_HEROKU_APP>.herokuapp.com`
2. https://hasura-hagenberg.herokuapp.com/console/data/schema/public/table/add --> URLs
3. https://hasura-hagenberg.herokuapp.com/console/api-explorer --> GraphQL
4. https://docs.hasura.io/1.0/graphql/manual/deployment/heroku/securing-graphql-endpoint.html --> `HASURA_GRAPHQL_ACCESS_KEY`
5. https://docs.hasura.io/1.0/graphql/manual/guides/integrations/auth0-jwt.html --> `HASURA_GRAPHQL_JWT_SECRET`
6. https://auth0.com/docs/quickstart/spa/vuejs --> JWT
7. https://vue-apollo.netlify.com/guide/installation.html --> `apollo`, `$apollo`
8. https://vue-apollo.netlify.com/guide/apollo/queries.html
9. https://vue-apollo.netlify.com/guide/apollo/mutations.html
10. https://vue-apollo.netlify.com/guide/apollo/subscriptions.html


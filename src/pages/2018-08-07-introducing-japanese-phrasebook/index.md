---
path: /introducing-japanese-phrasebook
title: Introducing “Japanese Phrasebook”
date: 2018-08-07
categories: [coding]
tags: [interaction-design, pwa, performance, vue]
thumbnail: /images/japanese-phrasebook-screens.png
---

For the last few weeks I have built an open-source [Japanese Phrasebook](https://www.japanese-phrasebook.com) app optimized for travel and offline usage. The app's content is nearly 700 phrases from Wikitravel, transformed to a structured data model. This blog post explains my motivation and outlines what I am trying to achieve with this project.

[![](/images/japanese-phrasebook-screens.png)](https://www.japanese-phrasebook.com)

The app is free for everyone to use at [https://www.japanese-phrasebook.com](https://www.japanese-phrasebook.com). You can add it to your mobile device's home screen and use it while traveling Japan, even when you have no internet connection. 

If you are interested in contributing or learning from the app's source code, open the [GitHub](https://github.com/Lorti/phrasebook) repository.

## Motivation

Why did I build yet another phrasebook app?

I have visited Japan in spring with my fiancée. We traveled for three weeks from March to April, enjoying the full cherry blossom bloom. I had learned a fair amount of basic Japanese before our trip, like reading Hiragana and Katakana, and a few dozen Kanji. Still I wanted to have a phrasebook for the vocabulary I frequently forget. 

Printed phrasebooks are fun to read before my trips but I never use them when I am abroad. My phone is immediately ready, as it is in my pocket, so I tested a few phrasebook apps before going to Japan. None of them convinced me, as I rarely found the phrases I was looking for. In the end I used the phrasebook at [Wikitravel](https://wikitravel.org/en/Japanese_phrasebook) because it had the best content. 

Their are a few problems with Wikitravel, though. Everything is on a single page and there's no table of contents, making it hard to find what you are looking for when you are in a hurry. The browser isn't helping when it forgets your scroll position or wants to refresh the page because you have been offline for a long enough period of time.

What I was wishing for was an easy-to-use app with Wikitravel's content. When we returned to Tokyo after two weeks of traveling Japan by train, I knew I wanted to build that app.

## Design Considerations

There are a few core features I knew my phrasebook app needed to have:

* __Web Application__: I can't think of a reason why the phrasebook should be an iPhone/Android app, other than marketing opportunities in the App Store/Play Store. Following the [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) guidelines the phrasebook app can feel like a native app and have the same user experience, and you can still add it to the home screen--without the hassle of an app store.

* __Offline Support__: I want the app to be connectivity-independent, which means it works on low-quality networks and when there's no connection at all. Even with a Pocket WiFi you are going to have periods with no internet access in Japan, and that often broke the Wikitravel experience for me.

* __Easy Access__: The phrasebook is 100% free and open-source, so anyone can enjoy it. Thanks to the [Web App Manifest](https://www.w3.org/TR/appmanifest/) search engines can discover the phrasebook as an application. The URL [https://www.japanese-phrasebook.com](https://www.japanese-phrasebook.com) is easy to remember and to share with anyone--no accounts, no friction, no installation.

* __Extensibility__: I want the app to be easy to extend. This is why all of the data is fetched as a large JSON object. It allows me to build an editor in the future, where users can add and edit their own phrases and sets. The JSON object could then be exported and shared with friends, who then import the custom additions to their phrasebook.<br>Also the code can be forked and adapted for any language with just a few changes. This could allow for several languages to be used at once, when visiting different countries in one trip, eliminating the need for multiple apps to be installed.

* __Personalization__: I want to mark phrases as my favorites. When I view phrases regarding a certain topic I want a filter that only shows my favorites. This allows for quicker access to what is important. The already mentioned editor and the [community features](#future-plans) I refer to at the end of this blog post are also forms of personalization.

## Implementation Details

The Japanese Phrasebook is a single-page web application with a few characteristics:

* __Vue.js__: The app uses Vue.js and its ecosystem, that means [Vue](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Vuex](https://vuex.vuejs.org/) and Vue Material. I like Vue's design decisions and its excellent documentation, allowing for rapid development.

* __Vue Material__: [Vue Material](https://vuematerial.io/) is a set of Vue.js components built after Google's [Material Design](https://material.io/) guidelines. I like its attention to detail in following the guidelines, the documentation and how it helps speed up prototyping. It does however add a significant overhead to the app, as almost every single element is now a Vue component. I do get a 95-100 Lighthouse score and all A's in WebPagetest, but there is noticeable scroll jank and delayed drawing of list elements.

* __Offline Support__: I use [localForage](https://localforage.github.io/localForage/) to save the complete data structure--phrases, sets and user settings--in [IndexedDB](https://www.w3.org/TR/IndexedDB-2/). The [Service Worker Precache](https://github.com/GoogleChromeLabs/sw-precache) plugin builds a service worker during the webpack build. It caches all static assets so you can use the app offline.

* __SEO__: To make the app more discoverable, all sets are prerendering with the [Prerender SPA Plugin](https://github.com/chrisvfritz/prerender-spa-plugin) and listed in the `sitemap.xml` file. Components set the page title and meta description via [custom directives](https://vuejs.org/v2/guide/custom-directive.html), allowing for reactive properties.

  ```js
  function setTitle(title) {
    if (title) {
      document.title = `${title} | Japanese Phrasebook`;
    } else {
      document.title = 'Japanese Phrasebook';
    }
  }
  
  Vue.directive('document-title', {
    inserted(el, binding) { setTitle(binding.value); },
    update(el, binding) { setTitle(binding.value); },
  });
  ```
  
  ```html
  <template>
    <div v-document-title="documentTitleComputedProperty" 
         v-meta-description="metaDescriptionComputedProperty">
      <!-- ... -->
    </div>
  </template>
  ```

* __Wikitext Transformation__: About half of the time spent on the app was needed for migrating Wikitravel's [Wikitext](https://en.wikipedia.org/wiki/Wiki#Editing) phrase list to a structured data model. Thanks to the thorough Wikitravel contributors and the standardized markup I can split all phrases into their Japanese, English and Romaji parts using three regular expressions.<br>After converting the phrases I manually added the sets and subsets, and gathered additional information from Wikitravel, which you might need to understand certain phrases. I also shortened or simplified a few phrases so they work better in the app's list view.

  ```js
  const defaultRegex = /;(.*?):(.*?)\(?''(.*?)''/gm;
  const signsRegex = /;(.*?):(.*?)$/gm;
  const expressionsRegex = /;(.*?)\s*?''(.*?)''\s*?:\s*?(.*?)$/gm;
  ```
  
  ```text
  ; Good afternoon. : こんにちは。 ''Konnichiwa.'' (''Kohn-nee-chee-wah'')
  ; 出口 : Exit
  ; ええぇ〜 ''Eee~'' : "Reallyyyyyyy~?"
  ```
  
  ```json
  {
    "phrases": {
      ...
      "aa3ea769-e37c-4ca1-9a44-1c0b84a12ba8": {
        "id": "d8186e78-0f66-47c0-bd42-421e286a80e0",
        "english": "Good afternoon.",
        "japanese": "こんにちは。",
        "romaji": "Konnichiwa.",
        "sets": [
          "5bbcdb75-3bbf-4e5d-83ce-65425be830fc"
        ]
      },
      ...
    },
    "sets": {
      ...
      "80cf758a-5bbc-4ced-9e5c-845be86b2b32": {
        "id": "80cf758a-5bbc-4ced-9e5c-845be86b2b32",
        "name": "Family",
        "slug": "family",
        "notes": "<h4>Family</h4><p>In Japanese, it's always important to use less respectful terms for your own family and more respectful terms for another's family. Note also that the words for older/younger brother/sister are different.</p>",
        "subsets": [
          "461b586d-f0aa-4aa5-983c-9e6800648168",
          "f25c5b32-8dd3-45e4-9f37-32776a4d4b57"
        ]
      },
      ...
    }
  }
  ```

## Future Plans

I want to implement the editor, which allows for editing and creation of one's own phrases and sets, and the import/export functionality as soon as possible. 

After that I would like to focus on accessibility, and replace Vue Material while doing so with a more lightweight self-implementation, also giving me the opportunity to consider visual design tweaks.

A further step could be community features, like sharing your own phrases and sets. The [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) can help with pronunciation--or users record their own voice, attach it to a phrase and upload it to a shared library. I have already made a [dictaphone](https://github.com/Lorti/vue-dictaphone) component for that. These community features would of course require a Backend as a Service and the user's consent regarding GDPR.

## Contributing

My girlfriend's brother is currently in Japan with his friends. They are testing the phrasebook and giving me feedback--sort of a field test for the app.

If you are interested in contributing, please head to the [GitHub](https://github.com/Lorti/phrasebook) repository. If you don't know how to code and want to support the project, submit new phrases or give feedback at [feedback@japanese-phrasebook.com](mailto:feedback@japanese-phrasebook.com), make a small donation via [PayPal](https://www.paypal.me/manuninja), or tell your friends and family about the phrasebook (you can use the sharing buttons in the app's footer), when they are about to visit Japan.

I'd also like to thank the people who have already shown their support for the [Japanese Phrasebook](https://www.japanese-phrasebook.com) app--[Ksenia](https://steemit.com/@happyksu) for the logo and [Daisy](https://www.instagram.com/daisimerollin/) for the Kinkaku-ji picture!

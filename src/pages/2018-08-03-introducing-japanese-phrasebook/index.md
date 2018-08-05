---
path: /introducing-japanese-phrasebook
title: Introducing “Japanese Phrasebook”
date: 2018-08-03
categories: [coding]
tags: [business]
thumbnail: /images/japanese-phrasebook-screens.png
---

For the last few weeks I have build an open-source [Japanese Phrasebook](https://www.japanese-phrasebook.com) app optimized for travel and offline usage. The app's content are 690+ phrases I have taken from Wikitravel and transformed to a structured data model. This blog post explains my motivation and outlines what I am trying to achieve with this project.

[![](/images/japanese-phrasebook-screens.png)](https://www.japanese-phrasebook.com)

The app is free for everyone to use at [https://www.japanese-phrasebook.com](https://www.japanese-phrasebook.com). You can add it to your mobile device's home screen and use it while traveling Japan, even when you have no internet connection. 

If you are interested in contributing or learning from the app's source code, open the [GitHub](https://github.com/Lorti/phrasebook) repository.

## Motivation

Why did I build yet another phrasebook app?

I have visited Japan in the spring with my girlfriend. We traveled for three weeks from March to April, enjoying the full cherry blossom bloom. I had learned a fair amount of basic Japanese before our trip, to get around, like reading Katakana and Hiragana, and a few dozen basic Kanji. Still I wanted to have a phrasebook for the vocabulary I tend to forget. 

Printed phrasebooks are fun to read before my trips but I never actually used them when I am abroad. My phone is quicker to access, as it is in my pocket, so I tested a few phrasebook apps before going to Japan. None of them convinced me, mostly because I never found the phrases I looked for. In the end I used the phrasebook at [Wikitravel](https://wikitravel.org/en/Japanese_phrasebook) because, to me, it had the best content. 

The problem with Wikitravel is, that it is a single page. Without a table of contents and the possibility to mark my favorite phrases it is hard to find anything when you are in a hurry. The browser is not helping when it forgets your scroll position or wants to refresh the page, as you have been offline for a long enough period of time.

Basically what I was wishing for, was an easy to use app with Wikitravel's content. When we returned to Tokyo after two weeks of going around by train, I knew that I wanted to build that app.

## Design Considerations

There are a few core features I knew my phrasebook app needed to have:

* __Web Application__: I personally can't think of a reason why the phrasebook should be an Android/iPhone app, other than marketing possibilities in the App Store/Play Store. Following the Progressive Web App guidelines the phrasebook can feel like a native app, have the same user experience and can still be added to the home screen without the hassle of an app store.

* __Offline Support__: I want the app to be fully connectivity-independent, meaning it works offline or on low-quality networks. Even with a Pocket WiFi you will have periods with no internet connection, and that often broke the Wikitravel experience for me.

* __Easy Access__: The phrasebook is 100% free and open source, so anyone can benefit from it. Thanks to the Web App Manifest search engines can discover the phrasebook as an app. The URL [https://www.japanese-phrasebook.com](https://www.japanese-phrasebook.com) is easy to remember and can be shared with anyone--no friction, no installation necessary. 

* __Extensibility__: I want the phrasebook to be easy to extend. This is why all of the data is fetched as a large JSON object. It allows me to build an editor in the future, where users can add and edit their own phrases and sets. The JSON object could then be exported and shared with friends, who import the custom additions to their phrasebook.<br>Also the code can be forked and with a few simple changes used for another language.

* __Personalization__: 

## Implementation Details

The Japanese Phrasebook is a single-page web application with a few particular characteristics:

* __Vue.js__: The app uses Vue.js and its ecosystem, that means Vue Router, Vuex and Vue Material. I like Vue's design decision and its excellent documentation, allowing for rapid development.

* __Offline Support__: I have used localForage to save the complete data structure (phrases, sets and user settings) in IndexedDB. The Service Worker Precache plugin builds a service worker during the webpack build, which caches all static assets, so the app can be used offline.

* __SEO__: To make the app more discoverable, all sets are prerendering with the Prerender SPA Plugin and listed in the sitemap. The page title and meta description can be set via custom directives in each component, allowing for reactive properties.

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

* __Wikitext Transformation__: About half of the time spent on the app was needed for migrating Wikitravel's [Wikitext](https://en.wikipedia.org/wiki/Wiki#Editing) phrase list to a structured data model. Luckily due to the thorough Wikitravel contributors and the standardized markup all phrases can be split into their Japanese, English and Romaji parts with only three regular expressions.<br>After covnerting the phrases I manually added the sets, their subsets and added information from Wikitravel as notes. I did also simplify or rewrite a few phrases so they work better in the app's list view. 

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
      "aa3ea769-e37c-4ca1-9a44-1c0b84a12ba8": {
        "id": "d8186e78-0f66-47c0-bd42-421e286a80e0",
        "english": "Good afternoon.",
        "japanese": "こんにちは。",
        "romaji": "Konnichiwa.",
        "sets": [
          "5bbcdb75-3bbf-4e5d-83ce-65425be830fc"
        ]
      }
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
      }
      ...
    }
  }
  ```

## Future Plans

I want to implement the editor, which allows for editing and creation of one's own phrases and sets, and the import/export functionality as soon as possible. 

After that I would like to focus on accessiblity, and replacing Vue Material in doing so with a more lightweight self-implementation, also allowing for a few visual design tweaks.

The next step could be some community features, like sharing your own phrases and sets. The Web Speech API could be used to help with pronunciation, or users record their own voice (I have already made a [Vue.js component](https://github.com/Lorti/vue-dictaphone) for that), attach it to a phrase and add it to a shared library. These community features would of course require a Backend as a Service and the user's consent regarding GDPR.

## Contributing

My girlfriend's brother is currently in Japan with his friends. They are testing the phrasebook and giving me feedback--sort of a field test for the app.

If you are interested in contributing, head to the [GitHub](https://github.com/Lorti/phrasebook) repository. If you don't know how to code and want to support the project, submit new phrases or give feedback at [feedback@japanese-phrasebook.com](mailto:feedback@japanese-phrasebook.com), make a small donation via [PayPal](https://www.paypal.me/manuninja), or tell your friends and family about the phrasebook (you can use the sharing buttons in the app's footer), when they are about to visit Japan. 

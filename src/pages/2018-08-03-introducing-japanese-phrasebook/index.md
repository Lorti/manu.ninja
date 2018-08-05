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

## Technical Challenges

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, aspernatur autem corporis cum perferendis porro possimus sed? Eius, est natus.

## Outlook

My girlfriend's brother is currently in Japan with his friends. They are testing the phrasebook and giving me feedback--sort of a field test for the app.

If you are interested in contributing, head to the [GitHub](https://github.com/Lorti/phrasebook) repository. If you don't know how to code and want to support the project, submit new phrases or give feedback at [feedback@japanese-phrasebook.com](mailto:feedback@japanese-phrasebook.com), make a small donation via [PayPal](https://www.paypal.me/manuninja), or tell your friends and family about the phrasebook, when they are about to visit Japan. 

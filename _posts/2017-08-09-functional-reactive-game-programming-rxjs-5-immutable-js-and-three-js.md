---
layout: post
title:  Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js
date:   2017-08-09
categories: [art, coding, games]
sharing: true
---

<!--
TODO Thumbnail
TODO Video?
TODO Marketing 
-->

Last year I took a look at RxJS to expand my horizon and learn about functional reactive programming in JavaScript. I had written a [Breakout][Breakout Blog Post] ([CodePen][Breakout CodePen]/[GitHub][Breakout GitHub]) clone to test and apply what I've learned. The [blog post][Breakout Blog Post] I've written had great feedback and people suggested a lot of improvements in the comments and in person. 

The release of RxJS 5 gave me the idea to expand on that knowledge and try to create a game with RxJS 5, Immutable.js and WebGL/three.js. This allowed me to combine a lot of previous knowledge and create a few 3D models, which I don't do as often as I'd like anymore.

The game I am trying to recreate is [Telegram's Corsairs][Telegram], which is available through their Bot Platform. I already do have a very advanced version of my [Corsair on GitHub][Corsair GitHub][<sup>1</sup>](#1), which I have presented on a recent [Stahlstadt.js] meetup in Linz, Austria. I didn't find the chance to write about it until now and it is still missing a few things I want to implement. 

<!-- TODO -->
![](https://raw.githubusercontent.com/Lorti/corsair/master/screenshot.jpg)

The project is already quite a bit of code, though, which is why I have decided to start my first ever blog post series titled "[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js][TODO]". I plan on doing a three-part series, but I might turn it into a five-part series, when I'm done writing about the existing code segments. 

* [Game Loop with RxJS 5/Immutable.js][TODO]
* Game State with RxJS 5/Immutable.js _(scheduled for September)_
* Game Graphics with WebGL/three.js and Lazy-Loading of 3D Models _(scheduled for October)_
* three.js The Wind Waker's Cartoon Water Shader _(to be decided)_
* three.js Explosion with Particles/Sprites _(to be decided)_

Keep in mind, that I am also constantly learning and if you see any area that might be improved or spot any errors please don't hesitate to comment below a blog post or talk to me on [Twitter]. The series is intended to help fellow developers who try to achieve similar things and I hope it is of help to some people.

## Footnotes

1. <a name="1"></a>Yes, I have dropped the **s** by accident.

[TODO]: #
[Breakout CodePen]: https://codepen.io/Lorti/pen/JXpgBb
[Breakout GitHub]: https://github.com/Lorti/rxjs-breakout
[Breakout Blog Post]: https://manu.ninja/functional-reactive-game-programming-rxjs-breakout
[Corsair GitHub]: https://github.com/Lorti/corsair 
[Telegram]: https://telegram.org/blog/games
[Stahlstadt.js]: https://www.meetup.com/de-DE/stahlstadt-js/
[Twitter]: https://twitter.com/manuelwieser

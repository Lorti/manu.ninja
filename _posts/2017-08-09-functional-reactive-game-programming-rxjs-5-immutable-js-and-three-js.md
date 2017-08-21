---
layout: post
title:  Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js
date:   2017-08-09
categories: [art, coding, games]
thumbnail: /images/corsair.jpg
summary: This series of blog posts will guide you through creating a computer game using RxJS 5, Immutable.js and WebGL/three.js, following the functional reactive programming paradigm in JavaScript. You can find the full source code on GitHub, which you can fork and adapt for your own projects.
---

Last year I played with RxJS to expand my programming horizon and learn about functional reactive programming in JavaScript. I had recreated [Breakout] using streams and written about my experience as a beginner to RxJS. The release of RxJS 5 encouraged me to build on that knowledge and recreate yet another game, this time using RxJS 5, Immutable.js and WebGL/three.js. The game is a clone of [Telegram's Corsairs][Telegram], which is available through their Bot Platform.

In this series of blog posts I will explain the most interesting parts of this project and share solutions to the problems I have encountered. Please revisit my blog in the following months if you are interested in using RxJS alongside three.js for games. You will find the full source code on [GitHub][Corsair], which you can fork and adapt or take as an inspiration for your own projects.

<video width="720" height="480" autoplay preload="auto" loop>
    <source src="/images/corsair.mp4" type="video/mp4">
</video>
<!-- ffmpeg -i corsair.mov -codec:v libx264 -preset slower -filter:v "crop=850:567:0:0" corsair.mp4 -->

I have presented the current progress of this project at the [Stahlstadt.js] meetup on June 7. Then this year's great summer prevented me from writing about it. [The game already has about 500 lines of code at this stage][Corsair], which is why I have decided to start my first three-part blog post series:
 
 * Game Loop with RxJS 5/Immutable.js _(scheduled for September)_
 * Game State with RxJS 5/Immutable.js _(scheduled for October)_
 * Game Graphics with WebGL/three.js and Lazy-Loading of 3D Models _(scheduled for November)_
 
The game is missing a few things I want to implement. As soon as I am done writing about the existing code it might therefore turn into a five-part series:

* three.js The Wind Waker's Cartoon Water Shader _(to be decided)_
* three.js Explosion with Particles/Sprites _(to be decided)_

The series is intended to help fellow developers who try to achieve similar goals. Keep in mind, that I am also constantly learning. If you have improvement suggestions or spot an error please don't hesitate to mention it in the comment section or on [Twitter].

[Breakout]: https://manu.ninja/functional-reactive-game-programming-rxjs-breakout
[Telegram]: https://telegram.org/blog/games
[Corsair]: https://github.com/Lorti/corsair
[Stahlstadt.js]: https://www.meetup.com/de-DE/stahlstadt-js/
[Twitter]: https://twitter.com/manuelwieser

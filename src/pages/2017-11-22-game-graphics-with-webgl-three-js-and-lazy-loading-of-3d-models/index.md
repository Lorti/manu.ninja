---
path: /game-graphics-with-webgl-three-js-and-lazy-loading-of-3d-models
title: Game Graphics with WebGL/three.js and Lazy-Loading of 3D Models
date: 2017-11-22
categories: [art, coding, games]
tags: [rxjs, functional-reactive-programming, three-js, lazy-loading]
thumbnail: /images/corsair.jpg
---

This is the second part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into describing the game state with RxJS 5 observables and Immutable.js. The goal of this part is to have a stream of objects, where each object is an Immutable.js collection that represents the whole game state at a particular point in time.

The full [Corsair] game, which we're going to develop in this series, is available on GitHub. You can clone it, play it and read the full source code while reading this article, if you want. All parts of the series will be listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js].



## References

* [Corsair]
* [RxJS 5](http://reactivex.io/rxjs/)
* [Immutable.js](https://facebook.github.io/immutable-js/)
* [three.js](https://threejs.org/docs/)



[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game Loop with RxJS 5/Immutable.js]: game-loop-with-rxjs-5-immutable-js
[Game State with RxJS 5/Immutable.js]: game-state-with-rxjs-5-immutable-js

---
layout: post
title:  Game Loop with RxJS 5/Immutable.js
date:   2017-09-15
categories: [coding, games]
thumbnail: /images/corsair.jpg
---

This is the first part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into how to create a basic game loop, which serves as a starting point for further development of the game project.

You can play with the game loop on [CodePen], or have a look at the full [Corsair] game, which we're going to develop in this series. All parts of the series are listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js](functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js), if you want to read them. Now let's dive right into it, by creating the first stream.

## Creating an observable for the game's clock

Load RxJS and Immutable.js from a CDN, as in my CodePen examples, or install and import their npm packages.

```js
npm install immutable rxjs --save
```

```js
const state = {
  time: performance.now(),
  delta: 0,
}

const clock = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame)
  .scan((previous) => {
      const time = performance.now();
      return {
          time,
          delta: time - previous.time,
      };
  }, state);

clock.subscribe((state) => {
  document.body.innerHTML = `${Math.round(state.delta * 1000)}μs`;
});
```

<iframe height='320' scrolling='no' title='RxJS 5 Clock' src='//codepen.io/Lorti/embed/pWoeBN/?height=320&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/pWoeBN/'>RxJS 5 Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

```js
const state = Immutable.fromJS({
  time: performance.now(),
  delta: 0,
});

const clock = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame)
  .scan((previous) => {
      const time = performance.now();
      return state.merge({
          time,
          delta: time - previous.get('time'),
      });
  }, state);

clock.subscribe((state) => {
  document.body.innerHTML = `${Math.round(state.get('delta') * 1000)}μs`;
});
```

<iframe height='320' scrolling='no' title='RxJS 5/Immutable.js Clock' src='//codepen.io/Lorti/embed/rGNyvm/?height=320&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/rGNyvm/'>RxJS 5/Immutable.js Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Creating observables for events

```js
const increaseButton = document.querySelector("#increase");
const increase = Rx.Observable
    .fromEvent(increaseButton, "click")
    .map(() => state => state.set("count", state.get("count") + 1));

const decreaseButton = document.querySelector("#decrease");
const decrease = Rx.Observable
    .fromEvent(decreaseButton, "click")
    .map(() => state => state.set("count", state.get("count") - 1));

const inputElement = document.querySelector("#input");
const input = Rx.Observable
    .fromEvent(inputElement, "input")
    .map(event => state => state.set("inputValue", event.target.value));
```

## Update a single state store with multiple observables

```js
const state = Rx.Observable
    .merge(increase, decrease, input)
    .scan((state, changeFn) => changeFn(state), initialState);
```

<iframe height='320' scrolling='no' title='RxJS 5 Event Observables' src='//codepen.io/Lorti/embed/oGbebN/?height=320&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/oGbebN/'>RxJS 5 Event Observables</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Lock update intervals to our clock's interval

```js
const loop = clock.withLatestFrom(state, (clock, state) => ({ clock, state }));

loop.subscribe(({ clock, state }) => {
    document.querySelector("#count").innerHTML = state.get("count");
    document.querySelector("#hello").innerHTML = `Hello ${state.get("inputValue")}`;
});
```

<iframe height='320' scrolling='no' title='Game Loop / Game State | RxJS 5 + Immutable.js' src='//codepen.io/Lorti/embed/VbMavj/?height=320&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/VbMavj/'>Game Loop / Game State | RxJS 5 + Immutable.js</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [performance.now() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

[CodePen]: https://codepen.io/Lorti/pen/VbMavj
[Corsair]: https://github.com/Lorti/corsair

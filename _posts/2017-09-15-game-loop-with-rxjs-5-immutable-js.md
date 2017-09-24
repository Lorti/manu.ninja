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

We'll first concentrate on RxJS itself, without using Immutable.js. The clock for our game should be a stream that constantly emits values, to keep the game running. To achieve this we use the `Observable.interval()` method, which returns an observable that emits an infinite sequence of numbers. 

The method accepts a Scheduler, which we can use to emit a value on each animation frame. This equals to 60 fps, except for when computation is slow, for example on low battery or other processes that slow down your computer.

```js
const clock = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame);
```

We can therefore not be sure, that exactly 16.667 ms have passed since the last value of our stream. This is where our clock's `delta` value comes in, telling us how much time has passed. This can then be used to adapt animations or interpolations in our game.
 
The `scan()` operator is a perfect fit for our `delta` value. It applies an accumulator function to the stream and works similar to `reduce()` in plain JavaScript. To get an accurate value we use `performance.now()`. Unlike `Date.now()` the timestamps returned by `performance.now()` are not limited to one-millisecond resolution. Instead, they are accurate to five thousandths of a millisecond.

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
```

The clock stream is now a stream of objects containing the previous tick's `performance.now()` and a delta time in milliseconds as a floating-point number. We can now subscribe to our stream and print the delta time in microseconds.

```js
clock.subscribe((state) => {
  document.body.innerHTML = `${Math.round(state.delta * 1000)}μs`;
});
```

<iframe height='360' scrolling='no' title='RxJS 5 Clock' src='//codepen.io/Lorti/embed/pWoeBN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/pWoeBN/'>RxJS 5 Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

We can now introduce Immutable.js to the game's clock. Each value of this stream will be in an immutable collection, allowing us to optimize rendering by doing shallow checks on changed values. This will have a larger effect in the next part of this series, where we'll look at the game's whole state, which will also be an immutable collection. To use Immutable.js in the game's clock three changes have to be made to the code. 

First the initial state has to be an immutable collection, which can be created from a raw JavaScript object with `Immutable.fromJS()`. Second we have to return an immutable collection as our accumulation. This could also be done via `Immutable.fromJS()`, but I have decided to use the `merge()` function, demonstrating an Immutable.js operator. Third we have to use `get('time')` to get our immutable map's value at the specified key.

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

<iframe height='360' scrolling='no' title='RxJS 5/Immutable.js Clock' src='//codepen.io/Lorti/embed/rGNyvm/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/rGNyvm/'>RxJS 5/Immutable.js Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Creating observables for events

Apart from the clock our game will have more than one stream of events. We will take a thorough look on a stream representing the game's state in the next part of this series. For now we will create three more streams to illustrate the concept of updating a single state store with multiple observables.

Each of the streams sends values when an event happens. This can be the click on a button or the user entering text in an input field. To create these streams all you have to do is call `Observable.fromEvent()` and pass the event target and event name.

```js
const increaseButton = document.querySelector("#increase");
const increase = Rx.Observable
    .fromEvent(increaseButton, "click");

const decreaseButton = document.querySelector("#decrease");
const decrease = Rx.Observable
    .fromEvent(decreaseButton, "click");

const inputElement = document.querySelector("#input");
const input = Rx.Observable
    .fromEvent(inputElement, "input");
```

## Update a single state store with multiple observables



```js
const increase = Rx.Observable
    .fromEvent(increaseButton, "click")
    .map(() => state => state.set("count", state.get("count") + 1));

const decrease = Rx.Observable
    .fromEvent(decreaseButton, "click")
    .map(() => state => state.set("count", state.get("count") - 1));

const input = Rx.Observable
    .fromEvent(inputElement, "input")
    .map(event => state => state.set("inputValue", event.target.value));
```

```js
const state = Rx.Observable
    .merge(increase, decrease, input)
    .scan((state, changeFn) => changeFn(state), initialState);
```

<iframe height='360' scrolling='no' title='RxJS 5 Event Observables' src='//codepen.io/Lorti/embed/oGbebN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/oGbebN/'>RxJS 5 Event Observables</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Lock update intervals to our clock's interval

```js
const loop = clock.withLatestFrom(state, (clock, state) => ({ clock, state }));

loop.subscribe(({ clock, state }) => {
    document.querySelector("#count").innerHTML = state.get("count");
    document.querySelector("#hello").innerHTML = `Hello ${state.get("inputValue")}`;
});
```

<iframe height='360' scrolling='no' title='Game Loop / Game State | RxJS 5 + Immutable.js' src='//codepen.io/Lorti/embed/VbMavj/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/VbMavj/'>Game Loop / Game State | RxJS 5 + Immutable.js</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)
* [performance.now() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

[CodePen]: https://codepen.io/Lorti/pen/VbMavj
[Corsair]: https://github.com/Lorti/corsair

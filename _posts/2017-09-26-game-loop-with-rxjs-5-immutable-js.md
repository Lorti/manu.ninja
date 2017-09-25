---
layout: post
title:  Game Loop with RxJS 5/Immutable.js
date:   2017-09-26
categories: [coding, games]
thumbnail: /images/corsair.jpg
---

This is the first part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into how to create a basic game loop, which serves as a starting point for further development of the game project.

You can play with the game loop on [CodePen], or have a look at the full [Corsair] game, which we're going to develop in this series. All parts of the series are listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js], if you want to read them. Now let's dive right into it, by creating the first stream.

## Creating an observable for the game's clock

Load RxJS and Immutable.js from a CDN, as in my CodePen examples, or install and import their npm packages.

```js
npm install immutable rxjs --save
```

We'll first concentrate on RxJS itself, without using Immutable.js. The clock for our game should be a stream that constantly emits values, to keep the game running. To achieve this we use the `Observable.interval()`{:.js} method, which returns an observable that emits an infinite sequence of numbers. 

The method accepts a Scheduler, which we can use to emit a value on each animation frame. This equals to 60 fps, except for when computation is slow, for example on low battery or other processes that slow down your computer.

```js
const clock = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame);
```

We can therefore not be sure, that exactly 16.667 ms have passed since the last value of our stream. This is where our clock's `delta`{:.js} value comes in, telling us how much time has passed. This can then be used to adapt animations or interpolations in our game.
 
The `scan()`{:.js} operator is a perfect fit for our `delta`{:.js} value. It applies an accumulator function to the stream and works similar to `reduce()`{:.js} in plain JavaScript. To get an accurate value we use `performance.now()`{:.js}. Unlike `Date.now()`{:.js} the timestamps returned by `performance.now()`{:.js} are not limited to one-millisecond resolution. Instead, they are accurate to five thousandths of a millisecond.

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

The clock stream is now a stream of objects containing the previous tick's `performance.now()`{:.js} and a delta time in milliseconds as a floating-point number. We can now subscribe to our stream and print the delta time in microseconds.

```js
clock.subscribe((state) => {
  document.body.innerHTML = `${Math.round(state.delta * 1000)}μs`;
});
```

<iframe height='360' scrolling='no' title='RxJS 5 Clock' src='//codepen.io/Lorti/embed/pWoeBN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/pWoeBN/'>RxJS 5 Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

We can now introduce Immutable.js to the game's clock. Each value of this stream will be in an immutable collection, allowing us to optimize rendering by doing shallow checks on changed values. This will have a larger effect in the next part of this series, where we'll look at the game's whole state, which will also be an immutable collection. To use Immutable.js in the game's clock three changes have to be made to the code. 

First the initial state has to be an immutable collection, which can be created from a raw JavaScript object with `Immutable.fromJS()`{:.js}. Second we have to return an immutable collection as our accumulation. This could also be done via `Immutable.fromJS()`{:.js}, but I have decided to use the `merge()`{:.js} function, demonstrating an Immutable.js operator. Third we have to use `get('time')`{:.js} to get our immutable map's value at the specified key.

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

Each of the streams sends values when an event happens. This can be the click on a button or the user entering text in an input field. To create these streams all you have to do is call `Observable.fromEvent()`{:.js} and pass the event target and event name.

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

We want our game to have a single state store. That means we have to write reducer functions that operate on that state. This can be achieved by mapping the values of the three streams to state-changing functions. They modify the state they are given and return an updated state. To change values in an Immutable.js collection we can use the methods `set()`{:.js} and `update()`{:.js} on our state.

```js
const increase = Rx.Observable
    .fromEvent(increaseButton, "click")
    .map(() => state => state.update("count", count => count + 1));

const decrease = Rx.Observable
    .fromEvent(decreaseButton, "click")
    .map(() => state => state.update("count", count => count - 1));

const input = Rx.Observable
    .fromEvent(inputElement, "input")
    .map(event => state => state.set("inputValue", event.target.value));
```

To get a single state from our three streams we can use the `Observable.merge()`{:.js} operator. It creates a stream that emits all values from the given input observables blended together. In our case the new observable is a stream of reducer functions. We can use the `Observable.scan()`{:.js} operator to call each reducer function on the current state. When a new reducer function arrives we call it and return the new state. This happens on every click or input event. We will further explore this concept in the next part of this series.

```js
const state = Rx.Observable
    .merge(increase, decrease, input)
    .scan((state, changeFn) => changeFn(state), initialState);
```

<iframe height='360' scrolling='no' title='RxJS 5 Event Observables' src='//codepen.io/Lorti/embed/oGbebN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/oGbebN/'>RxJS 5 Event Observables</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Lock update intervals to our clock's interval

The last thing we have to do is lock the game to our clock. The state stream we have created will output a value on each event. That event can be a click or an input. You might wnat to merge the game's clock as well. This means, however, that the state can change more often than 60 times per second. If you click the button twice the stream will emit about 62 values per second. Another problem is that now each emitted value is either an event or a clock tick.

To limit the state changes to each animation frame, as we did with the scheduler for the clock, you can use the `Observable.withLatestFrom()`{:.js} combination operator. This will give you a stream of `{ clock, state }`{:.js} objects on each clock tick.

```js
const loop = clock.withLatestFrom(state, (clock, state) => ({ clock, state }));

loop.subscribe(({ clock, state }) => {
    document.querySelector("#count").innerHTML = state.get("count");
    document.querySelector("#hello").innerHTML = `Hello ${state.get("inputValue")}`;
});
```

<iframe height='360' scrolling='no' title='Game Loop / Game State | RxJS 5 + Immutable.js' src='//codepen.io/Lorti/embed/VbMavj/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/VbMavj/'>Game Loop / Game State | RxJS 5 + Immutable.js</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

This now constitutes our game loop. We can subscribe to it and show the current state to the player, that is rendering the game or in the small counter example showing the current count.

If you've liked this article please return for the next part in the [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js] series. We will further explore the concept of using a single state store to represent the game's state.

## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)
* [performance.now() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

[CodePen]: https://codepen.io/Lorti/pen/VbMavj
[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js

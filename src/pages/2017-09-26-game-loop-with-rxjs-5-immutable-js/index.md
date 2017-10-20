---
path: /game-loop-with-rxjs-5-immutable-js
title: Game Loop with RxJS 5/Immutable.js
date: 2017-09-26
categories: [coding, games]
thumbnail: /images/corsair.jpg
---

This is the first part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into how to create a basic game loop, which serves as a starting point for further development of the game project.

You can test the game loop on [CodePen], or take a look at the full [Corsair] game, which we're going to develop in this series. All parts of the series will be listed in my [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js], if you want to read them.

Let's dive right into it by creating the first stream. We'll first concentrate on RxJS and afterwards add Immutable.js.

## Create an RxJS observable for the game's clock

Load RxJS and Immutable.js from a CDN, as in the CodePen examples, or install and import their npm packages.

```js
npm install immutable rxjs --save
```

The clock for our game should be a stream that constantly emits values, keeping the game running. To achieve this we use the `Observable.interval()` creation operator, which returns an observable that emits an infinite sequence of numbers.

The method accepts a scheduler. We can pass `Scheduler.animationFrame` so that the stream emits a value on each animation frame. This equals to 60 fps, except for when computation is slow. That can be the case when your device is running on low battery or other processes slow down your computer.

```js
const clock = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame);
```

Therefore we can't be sure that exactly 16.667 ms have passed since the last value of our stream. This is where our clock's `delta` value comes in, telling us exactly how much time has passed. This can then be used to slow down or speed up animations and adapt interpolations in our game.

The `scan()` transformation operator is a perfect fit for our `delta` value. It applies an accumulator function to the stream and works similar to `reduce()` in plain JavaScript. To get an accurate measurement we have to use `performance.now()`. Unlike `Date.now()` the timestamps returned by `performance.now()` are not limited to one-millisecond resolution. Instead, they are accurate to five thousandths of a millisecond.

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

The clock observable is now a stream of objects containing the previous tick's `performance.now()` and a delta time in milliseconds as a floating-point number. If we subscribe to our stream we can print the delta time in microseconds.

```js
clock.subscribe((state) => {
  document.body.innerHTML = `${Math.round(state.delta * 1000)}μs`;
});
```

<iframe height='360' scrolling='no' title='RxJS 5 Clock' src='//codepen.io/Lorti/embed/pWoeBN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/pWoeBN/'>RxJS 5 Clock</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Use Immutable.js for the clock's values

We can now introduce Immutable.js to the game's clock. Each value of the stream will be an immutable collection, allowing us to optimize rendering by doing shallow checks on changed values. This will have a larger effect in the next part of this series, where we'll look at the game's whole state, which will also be an immutable collection.

To use Immutable.js in the game's clock three changes have to be made to the code. First, the initial state has to be an immutable collection, which can be created from a raw JavaScript object with `Immutable.fromJS()`. Second, we have to return an immutable collection as our accumulation. This could also be done via `Immutable.fromJS()`, but I have decided to use the `merge()` function, demonstrating an Immutable.js operator. Finally, we have to use `get('time')` to get our immutable map's value at the specified key.

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

## Create observables for events

Apart from the clock our game will have one or more additional streams for player input. We'll take a thorough look on a stream representing the game's state in the next part of this series. For now we'll create three more RxJS observables to illustrate the concept of updating a single state store via multiple observables.

Each of the event streams emits values when an event happens. This can be the click of a button or the user entering text into an input field. To create these streams all you have to do is call `Observable.fromEvent()` and pass the event target and event name.

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

We want our game to have a single state store. That means we have to write reducer functions that operate on that state. This can be achieved by mapping the values of the three event streams to state-changing functions. They modify the state they are given and return an updated state. To change values in an Immutable.js collection we can use the methods `set()` and `update()` on our state object.

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

The `Observable.merge()` combination operator can be used to blend the streams together. It creates an observable that emits all values from all given input observables.

In our case the new observable is a stream of reducer functions. We can use the `Observable.scan()` operator to call each reducer function on the game's current state. Each time a new reducer function arrives we return an updated Immutable.js collection. This happens on every click or input event. We'll further explore this concept in the next part of this series, but you can already test it in the CodePen.

```js
const state = Rx.Observable
    .merge(increase, decrease, input)
    .scan((state, changeFn) => changeFn(state), initialState);
```

<iframe height='360' scrolling='no' title='RxJS 5 Event Observables' src='//codepen.io/Lorti/embed/oGbebN/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/oGbebN/'>RxJS 5 Event Observables</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Lock the update interval to the clock's interval

The last thing we should do is to lock the game to our clock. The state stream we've created outputs a value on each event. You might be inclined to merge the game's clock via `Observable.merge()` as well. However, doing so means the state can change more often than 60 times per second. If you click some buttons the stream will often emit 61+ values per second.

Another problem is that each emitted value would either be a reducer function or a clock object, depending on the input stream that has most recently emitted a value.

To limit the state changes to each animation frame, as we did with the scheduler for the clock, you can use the `Observable.withLatestFrom()` combination operator. This will give you a stream of `{ clock, state }` objects on each tick.

```js
const loop = clock.withLatestFrom(state, (clock, state) => ({ clock, state }));

loop.subscribe(({ clock, state }) => {
    document.querySelector("#count").innerHTML = state.get("count");
    document.querySelector("#hello").innerHTML = `Hello ${state.get("inputValue")}`;
});
```

<iframe height='360' scrolling='no' title='Game Loop / Game State | RxJS 5 + Immutable.js' src='//codepen.io/Lorti/embed/VbMavj/?height=360&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/VbMavj/'>Game Loop / Game State | RxJS 5 + Immutable.js</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

This finishes our game loop. You can also choose to merge the `(clock, state)` arguments into a single value in the project function of `Observable.withLatestFrom()`. Subscribing to the game loop now let's us show the current state to the player. That means rendering the game or simply showing the current count.

If you've liked this article please return for the next part of the [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js] series. We'll further explore the concept of using a single state store to represent the game's state by looking at everything [Corsair]'s state contains.

## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)
* [performance.now() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

[CodePen]: https://codepen.io/Lorti/pen/VbMavj
[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js

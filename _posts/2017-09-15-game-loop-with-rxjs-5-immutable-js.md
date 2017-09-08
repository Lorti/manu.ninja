---
layout: post
title:  Game Loop with RxJS 5/Immutable.js
date:   2017-09-15
categories: [coding, games]
thumbnail: /images/corsair.jpg
---

``` js
const clock = Rx.Observable
    .interval(0, Rx.Scheduler.animationFrame)
    .map(() => ({
        time: performance.now(),
        delta: 1
    }))
    .scan((previous, current) => ({
        time: current.time,
        delta: current.time - previous.time
    }));
```

---

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

const clock = Rx.Observable
    .interval(0, Rx.Scheduler.animationFrame)
    .map(() => ({
        time: performance.now(),
        delta: 1
    }))
    .scan((previous, current) => ({
        time: current.time,
        delta: current.time - previous.time
    }));

const initialState = Immutable.fromJS({
    count: 0,
    inputValue: ""
});

const state = Rx.Observable
    .merge(increase, decrease, input)
    .scan((state, changeFn) => changeFn(state), initialState);

const loop = clock.withLatestFrom(state, (clock, state) => ({ clock, state }));

loop.subscribe(({ clock, state }) => {
    document.querySelector("#count").innerHTML = state.get("count");
    document.querySelector("#hello").innerHTML = `Hello ${state.get("inputValue")}`;
});

loop.sampleTime(250, Rx.Scheduler.animationFrame).subscribe(({ clock }) => {
    document.querySelector("#clock").innerHTML = `${Math.round(clock.delta * 1000)}μs`;
});
```

[CodePen]: https://codepen.io/Lorti/pen/VbMavj
[Corsair]: https://github.com/Lorti/corsair

---
path: /game-state-with-rxjs-5-immutable-js
title: Game State with RxJS 5/Immutable.js
date: 2017-10-31
categories: [coding, games]
tags: [rxjs, functional-reactive-programming]
thumbnail: /images/corsair.jpg
---

This is the second part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into describing the game's state with RxJS 5 observables and Immutable.js. The goal of this part is to have a stream of objects, where each object represents the whole game's state at the particular point in time.

You can take a look at the full [Corsair] game and its source code, which we're going to develop in this series. All parts of the series will be listed in my [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js], if you want to read them.

``` js
Immutable.fromJS({
    player: {
        angle: Math.PI * 0.5,
        radius: RADIUS,
        direction: -1,
        size: 6,
    },
    speed: {
        player: calculatePlayerSpeed(stage),
        cannon: calculateCannonSpeed(stage),
        cannonball: calculateCannonballSpeed(stage),
    },
    coins: coinFactory(),
    cannonballs: [],
    score,
    lootCollected: false,
    shipDestroyed: false,
    lingering: 60,
});
```

``` js
function coinFactory() {
    const coins = [];
    const n = COINS;
    for (let i = 0; i < n; i++) {
        const coin = {
            angle: ((Math.PI * 2) / n) * i,
            radius: RADIUS,
            size: 1,
            collected: false,
        };
        if (coin.angle !== Math.PI / 2) {
            coins.push(coin);
        }
    }
    return coins;
}
```

``` js
const initialState = [...];

const clock = clockStream();
const input = inputStream();

const events = clock.withLatestFrom(input);

const player = [...];

const coins = [...];

const cannonballs = [...];

const cannon = [...];

const finish = [...];

const state = Rx.Observable
    .merge(player, coins, cannon, cannonballs, finish)
    .startWith(initialState)
    .scan((state, reducer) => reducer(state));

return clock
    .withLatestFrom(state, (clock, state) => state)
    .takeWhile(state => state.get('lingering') >= 0);
```
    
## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)

[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js

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

## Creating the game's state object

~~~js
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
~~~

The functions `calculatePlayerSpeed()`, `calculateCannonSpeed()` and `calculateCannonballSpeed()` each take an argument for setting the game's difficulty.

~~~js
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
~~~

~~~js
{
  "player": {
    "angle": 1.5707963267948966,
    "radius": 50,
    "direction": -1,
    "size": 6
  },
  "speed": {
    "player": 0.0014000000000000002,
    "cannon": 661.7647058823529,
    "cannonball": 0.0355
  },
  "coins": [
    {
      "angle": 0,
      "radius": 50,
      "size": 1,
      "collected": false
    },
    {
      "angle": 0.19634954084936207,
      "radius": 50,
      "size": 1,
      "collected": false
    },
    {...}
  ],
  "cannonballs": [],
  "score": 0,
  "lootCollected": false,
  "shipDestroyed": false,
  "lingering": 60
}
~~~

## Updating the game's state object

~~~js
function gameFactory(stage, score) {
  const initialState = {...};
  
  const clock = clockStream();
  const input = inputStream();
  
  const events = clock.withLatestFrom(input);
  
  const player = {...};
  const coins = {...};
  const cannonballs = {...};
  const cannon = {...};
  const finish = {...};
  
  const state = Rx.Observable
      .merge(player, coins, cannon, cannonballs, finish)
      .startWith(initialState)
      .scan((state, reducer) => reducer(state));
  
  return clock
      .withLatestFrom(state, (clock, state) => state)
      .takeWhile(state => state.get('lingering') >= 0);
}
~~~

The `clockStream()` factory returns a clock as described in the first part of the series, [Game Loop with RxJS 5/Immutable.js](/game-loop-with-rxjs-5-immutable-js). The `inputStream()` factory returns a stream of objects, each containing a single property `direction`, which is either positive or negative, telling us whether the ship is sailing clockwise or counterclockwise. These two streams are then combined into a single events stream.

~~~js
import Rx from 'rxjs/Rx';
import Immutable from 'immutable';

export default () => {
    const state = Immutable.fromJS({
        direction: 1,
    });

    return Rx.Observable
        .fromEvent(document, 'keypress')
        .scan((previous, event) => {
            if (event.keyCode === 32) {
                return previous.update('direction', direction => direction * -1);
            }
            return previous;
        }, state)
        .distinctUntilChanged();
};
~~~

~~~js
events.take(1).subscribe(([clock, input]) => {
    console.log(clock.toJS(), input.toJS());
});
~~~

~~~json
{
  "time": 2507.19,
  "delta": 17.715000000000146
}
~~~

~~~json
{
  "direction": -1
}
~~~



## Using the game's state object

~~~js
gameFactory(stage, score)
    .take(1)
    .subscribe((state) => {
        console.log(state.toJS());
    });
~~~

## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)

[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game Loop with RxJS 5/Immutable.js]: game-loop-with-rxjs-5-immutable-js

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

## Defining the game's state object

The game state is represented by an Immutable.js collection. It contains 

* the player's polar coordinates, movement direction and radius for collision detection, 
* the speed of all moving objects,
* the position of coins, and whether they've already been collected, 
* the position of cannonballs, 
* the player's score and a few flags for determining losing and winning. 

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
});
~~~

The functions `calculatePlayerSpeed()`, `calculateCannonSpeed()` and `calculateCannonballSpeed()` each take an argument for setting the game's difficulty. 

The coins are created by a `coinFactory()` function, which spreads `n` coins around a circle. The `collected` property tells us, if the coin's already been hit by the player's ship.

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

The actual object at the start of the game looks like the following JSON. None of the game's state resists outside of this collection, making debugging relatively easy.

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
}
~~~

## Creating the game's state stream

The `gameFactory()` function returns an RxJS observable, respecting the current difficulty and the player's score from last round. Let's dissect it line by line.

~~~js
function gameFactory(stage, score) {
  const initialState = {...};
  
  const clock = clockStream();
  const input = inputStream();
  
  const events = clock
      .withLatestFrom(input);
  
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
      .withLatestFrom(state, (clock, state) => state);
}
~~~



### Initial state

The inital state is the Immutable.js collection from the previous section.

~~~js
const initialState = {...};
~~~

### Events stream

The `clockStream()` factory ([clock.js]) returns a clock as described in the first part of the series, [Game Loop with RxJS 5/Immutable.js]. 

The `inputStream()` factory ([input.js]) returns a stream of objects, each containing a single property `direction`, which is either positive or negative, telling us whether the ship is sailing clockwise or counterclockwise. These two streams are then combined into a single events stream. 

~~~js
return Rx.Observable
    .fromEvent(document, 'keypress')
    .scan((previous, event) => {
        if (event.keyCode === 32) {
            return previous.update('direction', direction => direction * -1);
        }
        return previous;
    }, Immutable.fromJS({
        direction: 1,
    }))
    .distinctUntilChanged();
~~~

The values from this events stream is what drives changes to the game. It is the the only entity that's initiating a state change. 

~~~js
const clock = clockStream();
const input = inputStream();

const events = clock.withLatestFrom(input);
~~~

~~~js
events.take(1).subscribe(value => { console.log(value); });
~~~

~~~json
[
    { "time": 2507.19, "delta": 17.715000000000146 }, 
    { "direction": -1 }
]
~~~

### Reducer streams

~~~js
const state = Rx.Observable
    .merge(player, coins, cannon, cannonballs, finish)
    .startWith(initialState)
    .scan((state, reducer) => reducer(state));
~~~

We'll look at reducer streams in detail in the section [Updating the game's state objects](#updating-the-games-state-objects) of this article.

### Locking updates to the clock

~~~js
return clock.withLatestFrom(state, (clock, state) => state);
~~~



## Updating the game's state objects

### Handling ship movement

~~~js
const player = events.map(([clock, input]) => (state) => {
    if (state.get('lootCollected') || state.get('shipDestroyed')) {
        return state;
    }

    const position = state.getIn(['player', 'angle']) +
        clock.get('delta') * input.get('direction') * state.getIn(['speed', 'player']);
    const normalized = (position + Math.PI * 2) % (Math.PI * 2);

    return state.mergeDeep({
        player: {
            angle: normalized,
            direction: input.get('direction'),
        },
    });
});
~~~

### Handling the coins collision detection

~~~js
const coins = events.map(([clock]) => (state) => {
    let collected = 0;

    const playerAngle = state.getIn(['player', 'angle']);
    const playerSpeed = clock.get('delta') * state.getIn(['player', 'direction']) * state.getIn(['speed', 'player']);
    const playerSize = state.getIn(['player', 'size']) * Math.PI / 180;

    function updateCoin(coin) {
        if (coin.get('collected')) {
            return coin;
        }

        const coinAngle = coin.get('angle');
        const coinSpeed = 0;
        const coinSize = coin.get('size') * Math.PI / 180;

        const collision = detectCollision(
            new Vector2(playerAngle, 0), new Vector2(playerSpeed, 0), playerSize,
            new Vector2(coinAngle, 0), new Vector2(coinSpeed, 0), coinSize,
            4);

        if (collision) {
            collected++;
        }

        return coin.set('collected', collision);
    }

    return state
        .update('coins', coins => coins.map(updateCoin))
        .update('score', score => score + collected);
});
~~~

~~~js
function detectCollision(playerPosition, playerDirection, playerRadius,
                           objectPosition, objectDirection, objectRadius,
                           resolution = 1) {
    const circleCollision = (aPos, bPos, aRad, bRad) => aPos.distanceTo(bPos) <= aRad + bRad;
    for (let i = 0; i < resolution; i++) {
        const intermediateFrame = (1 / resolution) * i;
        const aPos = playerPosition.add(playerDirection.multiplyScalar(intermediateFrame));
        const bPos = objectPosition.add(objectDirection.multiplyScalar(intermediateFrame));
        if (circleCollision(aPos, bPos, playerRadius, objectRadius)) {
            return true;
        }
    }
    return false;
}
~~~

### Handling the cannonballs movement and collision detection

~~~js
const cannonballs = events.map(([clock]) => (state) => {
    const playerAngle = state.getIn(['player', 'angle']);
    const playerRadius = state.getIn(['player', 'radius']);
    const playerDirection = playerAngle + (Math.PI / 2) * state.getIn(['player', 'direction']);
    const playerSpeed = clock.get('delta') * state.getIn(['player', 'direction']) * state.getIn(['speed', 'cannonball']);
    const playerSize = state.getIn(['player', 'size']);

    function updateCannonball(cannonball) {
        const cannonballAngle = cannonball.get('angle');
        const cannonBallRadius = cannonball.get('radius');
        const cannonballSpeed = clock.get('delta') * calculateCannonballSpeed(stage);
        const cannonBallSize = cannonball.get('size');

        let next = cannonball;
        const collision = detectCollision(
            polarToCartesian(playerAngle, playerRadius),
            polarToCartesian(playerDirection, playerSpeed),
            playerSize,
            polarToCartesian(cannonballAngle, cannonBallRadius),
            polarToCartesian(cannonballAngle, cannonballSpeed),
            cannonBallSize,
            4);

        if (collision) {
            next = next.set('collision', true);
        }

        return next.set('radius', cannonBallRadius + cannonballSpeed);
    }

    return state.update('cannonballs', cannonballs => cannonballs.map(updateCannonball));
});
~~~

~~~js
function polarToCartesian(angle, radius) {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return new Vector2(x, y);
}
~~~

### Handling the cannon and spawning of cannonballs

~~~js
const cannon = events
    .throttleTime(initialState.getIn(['speed', 'cannon']))
    .map(() => (state) => {
        if (state.get('lootCollected') || state.get('shipDestroyed')) {
            return state;
        }
        const angle = state.get('cannonballs').size ? state.get('cannonballs').last().get('angle') : 0;
        const cannonball = Immutable.fromJS(cannonballFactory(angle));
        return state.update('cannonballs', cannonballs => cannonballs.push(cannonball));
    });
~~~

### Handling the game's end conditions

~~~js
const finish = events.map(() => (state) => {
    const lootCollected = state.get('coins').every(coin => coin.get('collected'));
    const shipDestroyed = !lootCollected && state.get('cannonballs').find(cannonball => cannonball.get('collision'));
    if (lootCollected || shipDestroyed) {
        return state
            .set('lootCollected', lootCollected)
            .set('shipDestroyed', shipDestroyed)
    }
    return state;
});
~~~



## Reading the game's state stream

~~~js
gameFactory(stage, score)
    .take(1)
    .subscribe((state) => {
        console.log(state.toJS());
    });
~~~



## Starting the game and testing for end conditions

~~~js
function start(stage, score) {
    const progress = { stage, score };
    game(stage, score).subscribe({
        next: (state) => {
            render(state);
            if (state.get('lootCollected')) {
                progress.stage = stage + 1;
                progress.score = state.get('score');
            }
            if (state.get('shipDestroyed')) {
                progress.stage = 1;
                progress.score = 0;
            }
        },
        error: error => console.error(error),
        complete: () => start(progress.stage, progress.score),
    });
}
~~~

`start(1, 0)`



## Further reading

* [(Official) RxJS Tutorial](http://reactivex.io/rxjs/manual/tutorial.html)
* [Immutable.js](https://facebook.github.io/immutable-js/)



[Corsair]: https://github.com/Lorti/corsair
[clock.js]: https://github.com/Lorti/corsair/blob/master/src/clock.js
[input.js]: https://github.com/Lorti/corsair/blob/master/src/input.js
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game Loop with RxJS 5/Immutable.js]: game-loop-with-rxjs-5-immutable-js

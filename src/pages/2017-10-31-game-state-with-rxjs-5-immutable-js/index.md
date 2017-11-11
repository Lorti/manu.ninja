---
path: /game-state-with-rxjs-5-immutable-js
title: Game State with RxJS 5/Immutable.js
date: 2017-11-11
categories: [coding, games]
tags: [rxjs, functional-reactive-programming]
thumbnail: /images/corsair.jpg
---

This is the second part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into describing the game's state with RxJS 5 observables and Immutable.js. The goal of this part is to have a stream of objects, where each object is an Immutable.js collection that represents the whole game's state at the particular point in time.

The full [Corsair] game, which we're going to develop in this series, is available on GitHub. You can clone it, play it and read the full source code while reading this article, if you want. All parts of the series will be listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js].



## Defining the game's state collection

The game state is represented by a single Immutable.js collection. It contains 

* the player's polar coordinates, movement direction and radius for collision detection, 
* the speed of all moving objects,
* the position of coins, and whether they've already been collected, 
* the position and direction of cannonballs, 
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

The functions `calculatePlayerSpeed()`, `calculateCannonSpeed()` and `calculateCannonballSpeed()` each take an argument for setting the game's difficulty, that means increasing the speed per round.

The coins are created by a `coinFactory()` function, which spreads _n_ coins evenly around a circle. The `collected` property tells us, if the coin's already been collected by the player's ship.

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

You have to call `toJS()` on the Immutable.js collection, if you want to log the actual object. At the start of the game it looks like the following JSON. None of the game's state resists outside of this collection, making debugging very pleasant.

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

The `gameFactory()` function returns an RxJS observable, respecting the current difficulty and the player's score from last round. It's the heart of the game and called at the beginning of each round, spawning a new stream of Immutable.js collections. Let's dissect the `gameFactory()` line by line.

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

The initial state is simply the Immutable.js collection from the [Defining the game's state collection](#defining-the-games-state-collection) section.

~~~js
const initialState = {...};
~~~



### Events stream

The `clockStream()` factory returns a clock as described in the first part of the series, [Game Loop with RxJS 5/Immutable.js]. The `inputStream()` factory returns a stream of collection, each containing a single `direction` key, which contains either a positive or negative value. It tells us whether the ship is sailing clockwise or counterclockwise.

Let's take a quick detour and inspect the input stream. It creates a simple observable from `keypress` events. As soon as the player hits the space bar it updates the direction and emits an Immutable.js collection. What makes RxJS and this stream so powerful is that it produces values using pure functions. The `distinctUntilChanged()` filtering operator prevents the stream from emitting the same value twice in a row.

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

The two clock and input streams are then combined into a single events stream. The values from this events stream is what drives changes to the game. It is the only entity that's initiating a state change. 

~~~js
const clock = clockStream();
const input = inputStream();

const events = clock.withLatestFrom(input);
~~~

The `withLatestFrom()` combination operator ensures that a new events value is only pushed down the stream when the clock's value changes. The stream has to be locked to the game's ticker, otherwise it may return a value inbetween ticks, depending on when the player's input is happening.

We can now take a look at what's inside the events stream by subscribing to the observable. The two arrays are Immutable.js collection, which we'll have to transform to plain objects using `toJS()`. The `take(1)` filtering operator takes only the first value from the observable, which is enough for debugging.

~~~js
events.take(1).subscribe(([clock, input]) => {
    console.log([clock.toJS(), input.toJS()]);
});
~~~

~~~json
[
    { "time": 2507.19, "delta": 17.715000000000146 }, 
    { "direction": -1 }
]
~~~



### Reducer streams

The goal of this second part of the series is to have a single immutable state collection, emitted by an observable. To do this we'll apply a bunch of reducer functions to the state, each time an event happens. The reducer functions themselves are emitted by observables. 

The powerful `merge` operator forwards any given stream to the output. The `scan` operator therefore receives five streams of reducers, which it can apply to the state collection.

~~~js
const state = Rx.Observable
    .merge(player, coins, cannon, cannonballs, finish)
    .startWith(initialState)
    .scan((state, reducer) => reducer(state));
~~~

We'll look at reducer streams in detail in the section [Updating the game's state objects](#updating-the-games-state-objects) of this article.



### Locking updates to the clock

The last line in our `gameFactory` is similar to the [events stream](#events-stream). We want the game loop to update at exactly 60 cycles per second, as described in [Game Loop with RxJS 5/Immutable.js].

~~~js
return clock.withLatestFrom(state, (clock, state) => state);
~~~



## Updating the game's state objects

In the last section we've created our stream of state collections. In this section we'll create the streams of reducer functions that modify the state collections.



### Handling ship movement

The first stream returns a reducer function that updates the player's position. In other words each value the player stream emits is a function that receives the current state collection and returns an updated state collection. To do this we map the emitted values of the events stream to `(state) => { return state.doSomething(); }`. 

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

This example shows a few Immutable.js methods. `get` and `getIn` both let you read values from the collection. `getIn` can take a variable amount of layers and return nested values. The `mergeDeep` function let's you merge a nested object into the immutable collection.

The player itself is moved along the circle surrounding the island, which is why the angle is the only value needed to specify the player's position. The direction is taken from the events stream and copied into the player's state, so that we don't need the events for representing the game's state.

The clock is needed to calculate the player's new position, as it tells us how much time has passed since the last frame, resulting in smooth animation.



### Handling the coins collision detection

Updating the coins is a matter of running a collision detection of each coin against the player. We set the `collected` flag of the coins to true, to hide them when rendering. 

Why don't we remove the coins from the collection altogether? They'll be used in [Handling the game's end conditions](#handling-the-games-end-conditions) for checking whether the player's won. 

The coins reducer is also the one that's updating the player's score when a coin gets collected.

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

The collision detection helper function is testing for simple two-dimensional circle collision. The algorithm takes the center of two circles and compares the distance between the centers to the two radii added togeter. 

Two things can be noted here: The first is that the high speed of the game, especially in higher stages, makes it mandatory to test the collision "between frames". Otherwise the player might "jump over" a coin and the collision detection fails. This is what the loop and `resolution` argument are for. For this to work we also need the players speed, which tells us where the player will be in the next frame. This look ahead makes sure, that we don't miss a collision.

The other thing is that we could write different collision algorithm for the player against the coins and the player against the cannonballs. Why? The coins and the player move on a circle, making it possible to test against one-dimensional circle collision. This can be seen in passing `new Vector2(playerAngle, 0)` and `new Vector2(playerSpeed, 0)` arguments in the `updateCoin()` function, where the _y_ value is set to zero. That optimization won't likely speed up the calculation by a significant factor, so we won't go into that. 

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



### Handling the cannon and spawning of cannonballs

The cannon uses RxJS 5 and Immutable.js operators we've not seen in the previous sections. The `throttleTime` operator lets a value pass through the stream, then ignores values for the duration set by `calculateCannonSpeed()` in the initial state collection.

The `size` property in `state.get('cannonballs').size` returns the length of an immutable list. The `last()` method in `state.get('cannonballs').last()` returns the last element of an immutable list. This helps us prevent shooting cannonballs in the same direction twice in a row.

The newly spawned cannonball has to be transformed to an immutable collection with `fromJS()` first, before being pushed into the state collection.

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



### Handling the cannonballs movement and collision detection

The cannonballs reducer function is similar to the coins reducer function. It moves the cannonballs further along their path leaving the island and tests against player collisions.

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

In this function the collision detection really is a two-dimensional algorithm, for which we'll have to transform the polar coordinates saved in the state collection to cartesian coordinates to get the circle's center position.

~~~js
function polarToCartesian(angle, radius) {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return new Vector2(x, y);
}
~~~



### Handling the game's end conditions

All that is left is testing for whether the player's lost or won this round of the game. The `every()` function returns `true` if all entries in a list pass a given test. This makes it a reducer in a reducer in a stream, complicated?

The `some()` function is the brother of `every()` and returns `true` if any entry in a list passes a given test. It is similar to `find()`, but `find()` will return the value that passed the test, whereas `some()` returns a boolean.

If any of the two conditions are met we'll update the game's state. Note that all of the previous reducer functions test for `state.get('lootCollected')` or `state.get('shipDestroyed')`, bringing the game to a halt when the flags are set.

~~~js
const finish = events.map(() => (state) => {
    const lootCollected = state.get('coins').every(coin => coin.get('collected'));
    const shipDestroyed = !lootCollected && state.get('cannonballs').some(cannonball => cannonball.get('collision'));
    if (lootCollected || shipDestroyed) {
        return state
            .set('lootCollected', lootCollected)
            .set('shipDestroyed', shipDestroyed)
    }
    return state;
});
~~~



## Reading the game's state stream

The `gameFactory()` is finished. It returns an RxJS observable that emits Immutable.js collections as its values. The values are our state collections, which describe the game's state at any given point. 

We can subscribe to it, to see if it works. The `take(7)` tells our game to run for seven iterations, which is enough for it to throw any bugs and let's us debug any errors.

~~~js
gameFactory(1, 0)
    .take(7)
    .subscribe((state) => {
        console.log(state.toJS());
    });
~~~



## Starting the game and testing for end conditions

The game loop will run forever, if we don't test for the end conditions. The `subscribe()` accepts more than a single function, you can also pass an object containing `next`, `error` and `complete` callbacks. We can use them to end the game and start another round, when the players collected all of the coins.

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

The whole process gets started by calling `start(1, 0)`. `start()` is a recursive function that starts a new round with increased difficulty, until the player gets hit by a cannonball.

If you've liked this article please return for the next part of the [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js] series. We'll discuss the `render()` function, in which we'll render [Corsair]'s graphics using three.js/WebGL.


## Further reading

* [RxJS 5](http://reactivex.io/rxjs/)
* [Immutable.js](https://facebook.github.io/immutable-js/)



[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game Loop with RxJS 5/Immutable.js]: game-loop-with-rxjs-5-immutable-js

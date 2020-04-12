---
layout: layouts/post.njk
permalink: /game-state-with-rxjs-5-immutable-js/index.html
title: Game State with RxJS 5/Immutable.js
date: 2017-11-11
categories: [coding, games]
tags: [rxjs, functional-programming]
thumbnail: /images/corsair.jpg
---

This is the second part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look into describing the game state with RxJS 5 observables and Immutable.js. The goal of this part is to have a stream of objects, where each object is an Immutable.js collection that represents the whole game state at a particular point in time.

The full [Corsair] game, which we're going to develop in this series, is available on GitHub. You can clone it, play it and read the full source code while reading this article, if you want. All parts of the series will be listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js].



## Defining the game state collection

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

You have to call `toJS()` on the Immutable.js collection, if you want to log the actual object. At the start of the game it looks like the following JSON. None of the game's state exists outside of this collection, making debugging very pleasant.

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



## Creating the game state stream

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
      .withLatestFrom(state, (clock, state) => state)
      .takeWhile(state => !state.get('lootCollected') && !state.get('shipDestroyed'));
}
~~~



### Initial state

The initial state is simply the Immutable.js collection from the [Defining the game state collection](#defining-the-game-state-collection) section.

~~~js
const initialState = {...};
~~~



### Events stream

The `clockStream()` factory returns a clock as described in the first part of the series, [Game Loop with RxJS 5/Immutable.js]. The `inputStream()` factory returns a stream of collection, each containing a single `direction` key, which contains either a positive or negative value. It tells us whether the ship is sailing clockwise or counterclockwise.

Let's take a quick detour and inspect the `input` stream. It creates a simple observable from `keypress` events. As soon as the player hits the space bar, it updates the direction and emits an Immutable.js collection. What makes RxJS and this stream so powerful is that it produces values using pure functions. The `distinctUntilChanged()` filtering operator prevents the stream from emitting the same value twice in a row.

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

The `clock` and `input` streams are then combined into a single `events` stream. The values from this stream is what drives changes to the game. It is the only entity that's initiating a state change.

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

The goal of this second part of the series is to have a stream of Immutable.js state collections. At any given time only a single state collection must exist. To do this we'll apply a set of reducer functions to the state collection each time an event happens.

The reducer functions themselves are emitted by observables. They are combined together by the powerful `merge` operator, which simply forwards any given stream to its output. The `scan` operator then receives the five reducer streams and applies them to the state collection, one after another.

~~~js
const state = Rx.Observable
    .merge(player, coins, cannon, cannonballs, finish)
    .startWith(initialState)
    .scan((state, reducer) => reducer(state));
~~~

We'll look at each reducer stream in detail in the section [Updating the game state collection](#updating-the-game-state-collection).



### Locking updates to the clock

The last line in our `gameFactory()` is similar to what we already did with the events stream. We want the game loop to update at exactly 60 fps or cycles per second, as described in [Game Loop with RxJS 5/Immutable.js]. We'll also drop the clock by passing a projection function to the optional second argument of `withLatestFrom()`. This way the `gameFactory()` returns a clean stream of Immutable.js state collections.

~~~js
  return clock
      .withLatestFrom(state, (clock, state) => state)
      .takeWhile(state => !state.get('lootCollected') && !state.get('shipDestroyed'));
~~~

The `takeWhile()` operator is explained in the [Starting the game and testing for end conditions](#starting-the-game-and-testing-for-end-conditions) section.



## Updating the game state collection

In the previous section we've created our stream of state collections. In this section we'll look at the streams of reducer functions that modify the state collection. There are five of them -- `player`, `coins`, `cannon`, `cannonballs`, and `finish` -- each stream handling different parts of the state collection.



### Handling the ship's movement

The `player` stream returns a reducer function that updates the ship's position. That means each value the player stream emits is a function. That function receives the current state collection and returns an updated state collection.

To do this we first map the values of the events stream to `(state) => { return state.doSomething(); }`.

The reducer then uses a few Immutable.js methods. `get` and `getIn` both let us read values from the collection. `getIn` can take a variable amount of layers and return nested values. The `mergeDeep` function lets us merge a nested object into the Immutable.js collection.

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

The ship itself is moved along the circle surrounding the island. This is why an angle is the only necessary key for specifying the player's position. The direction is directly taken from the events stream and merged into the player's state, so that we don't need the events for representing the game state.

The clock is needed to calculate the player's new position, telling us how much time has passed since the last frame, as described in [Game Loop with RxJS 5/Immutable.js].



### Handling the coins' collision detection

Updating the coins means running a collision detection on each coin against the player's ship. If collisions occur we set the `collected` flag of the coins, to hide them when rendering. Why don't we remove the coins from the collection altogether? They'll be used in [Handling the game's end conditions](#handling-the-games-end-conditions) for checking whether the player has won this round.

The coins' reducer is also the function that's updating the player's score when a coin gets collected.

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

The collision detection helper function is testing for two-dimensional circle collision. The algorithm takes the center of two circles and compares the distance between the centers to the two radii added together.

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

You might have noticed two characteristics in the `detectCollision()` and `updateCoin()` functions. The first is that the high speed of the game, especially in later rounds, makes it mandatory to account for the ship's positions between frames. Otherwise the ship might jump over a coin and the collision detection fails.

This is what the `playerDirection`, `objectDirection` and `resolution` argument are needed for. The player's speed tells us where the ship will be in the next frame. The repeated lookahead in the loop ensures that we don't miss a collision.

The second detail is that we could write different collision algorithms for the player against the coins and the player against the cannonballs. Why? The player and the coins reside on a circle, allowing a one-dimensional test. This gets highlighted by the `(playerAngle, 0)` and `(playerSpeed, 0)` vectors passed to the `updateCoin()` function -- both have their _y_ value set to `0`. That optimization won't likely speed up the calculation by a significant factor, so we won't go into that.



### Handling the cannon and spawning of cannonballs

The cannon uses an RxJS 5 operator and Immutable.js methods we've not previously used. The `throttleTime()` operator lets a value pass through the stream, then ignores values for the duration set by `calculateCannonSpeed()` in the initial state collection.

The `size` property in `state.get('cannonballs').size` returns the length of an Immutable.js list. The `last()` method in `state.get('cannonballs').last()` returns the last element of an Immutable.js list. This helps us prevent shooting cannonballs in the same direction twice in a row.

The newly spawned cannonball has to be transformed to an Immutable.js collection with `fromJS()` first, before being pushed into the state collection.

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



### Handling the cannonballs' movement and collision detection

The cannonballs stream is very similar to the coins stream. It's reducer function moves the cannonballs further along their path, leaving the island, and tests against player collisions.

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

In this function the collision detection really is a two-dimensional test. That is why we'll have to transform the polar coordinates saved in the state collection to cartesian coordinates, to get the circles' center position.

~~~js
function polarToCartesian(angle, radius) {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return new Vector2(x, y);
}
~~~



### Handling the game's end conditions

All that's left is testing for whether the player's lost or won this round of the game. These two events are represented by the `lootCollected` and `shipDestroyed` flags.

If any of the two conditions is met we'll update the game state. Note that all of the previous reducer functions test for `state.get('lootCollected')` or `state.get('shipDestroyed')`, bringing the game to a halt when the flags are set.

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

 The `every()` function returns `true` if all entries in a list pass a given test. The `some()` function is the brother of `every()` and returns `true` if any entry in a list passes a given test.



## Reading the game state collection stream

The `gameFactory()` is finished. It returns an RxJS 5 observable that emits Immutable.js collections as its values. The values are our state collections, which describe the game state at any given point.

To see if the stream works we'll subscribe to it and log its values. The `take(7)` tells the game to run for seven iterations. This should be enough for checking that it doesn't throw any errors.

~~~js
gameFactory(1, 0)
    .take(7)
    .subscribe((state) => {
        console.log(state.toJS());
    });
~~~



## Starting the game and testing for end conditions

The game loop will run forever if we don't test for the end conditions. The only detail we've not discussed in the [Creating the game state stream](#creating-the-game-state-stream) section is the `takeWhile()` operator. This filter lets values pass as long as the `lootCollected` and `shipDestroyed` flags aren't set. The observable completes when the player collects all of the coins or the ship gets destroyed.

~~~js
return clock
    .withLatestFrom(state, (clock, state) => state)
    .takeWhile(state => !state.get('lootCollected') && !state.get('shipDestroyed'));
~~~

The `subscribe()` function accepts a single function, but you can also pass an object containing `next`, `error` and `complete` callbacks. This way we can discard the game loop and start the next round when the observable completes.

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

The whole process gets started by calling `start(1, 0)`. `start()` is a recursive function that always starts another round with increased difficulty. That is, until the ship gets hit by a cannonball.

---

If you've liked this article, please return for the next part of the [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js] series. We'll discuss the `render()` function, lazy-loading of game objects and rendering [Corsair]'s graphics using three.js/WebGL.



## References

* [Corsair]
* [RxJS 5](http://reactivex.io/rxjs/)
* [Immutable.js](https://facebook.github.io/immutable-js/)



[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game Loop with RxJS 5/Immutable.js]: game-loop-with-rxjs-5-immutable-js

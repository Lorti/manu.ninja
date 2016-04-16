---
layout: post
title:  Functional Reactive Game Programming – RxJS Breakout
date:   2016-04-14
categories: [coding, games]
---

Functional Reactive Programming is currently one of the hottest paradigms in the JavaScript community. Therefore I played with RxJS over the last couple of weeks and decided that there is no better way to dive into applications with no global state then with a game. Games usually store a lot of state somewhere, so my challenge was to model everything as streams and solely use pure functions.

This post shows my solutions as a complete beginner to RxJS so if you notice something odd please leave a message in the comments. If you want to use code snippets in your own game feel free to copy and paste, but please link your solution so I can maybe see a different approach to some problems.

The code is available on <https://github.com/Lorti/rxjs-breakout> and you can play the game below. First focus the iFrame and then use your arrow keys. Yup, doesn't work on mobile, but so did the original Cab! There is sound as well, so be wary not to shock your colleagues.

<p data-height="480" data-theme-id="0" data-slug-hash="JXpgBb" data-default-tab="result" data-user="Lorti" class='codepen'></p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Everything is a stream

You may have seen Andre Staltz's tutorial gist [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). So to follow his mantra I tried to model everything in the game as a stream. I assume that you are familiar with the classic [Atari Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)) game. All the player can do is move his paddle. So how do we represent the player input as a stream?

## Input Stream

We are not only interested in the keypresses themselves but also in how long the key is hold to down. If the player holds the left key pressed the paddle moves to the left and vice versa.

First we create an observable that returns all keyboard presses as a stream. Than in the next step we filter the events so that the stream only returns the `keyup`{:.js} and `keydown`{:.js} events of the left and right arrow keys. We then scan this stream and return a one-dimensional direction vector, which sounds sophisticated but is really just a value of `-1`{:.js}, `0`{:.js} or `1`{:.js}, indicating where the paddle should be heading.

The last thing we have to take care of is that the initial Observable returns a `keydown`{:.js} event every few milliseconds while you're holding the key. The `distinctUntilChanged()`{:.js} operator only pushes a new element down the stream if the element is different than before.

~~~ js
const input$ = Rx.Observable
    .merge(
        Rx.Observable.fromEvent(document, 'keydown'),
        Rx.Observable.fromEvent(document, 'keyup')
    )
    .filter(event => event.keyCode === PADDLE_KEYS.left || event.keyCode === PADDLE_KEYS.right)
    .scan((direction, event) => {
        if (event.type === 'keyup') return 0;
        if (event.keyCode === PADDLE_KEYS.left) return -1;
        if (event.keyCode === PADDLE_KEYS.right) return 1;
    }, 0)
    .distinctUntilChanged();
~~~

## Paddle Stream

~~~ js
const paddle$ = ticker$
    .withLatestFrom(input$)
    .scan((position, [ticker, direction]) => {

        let next = position + direction * ticker.deltaTime * PADDLE_SPEED;
        return Math.max(Math.min(next, canvas.width - PADDLE_WIDTH / 2), PADDLE_WIDTH / 2);

    }, canvas.width / 2)
    .distinctUntilChanged();
~~~

## Ticker Stream

~~~ js
const ticker$ = Rx.Observable
    .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame)
    .map(() => ({
        time: Date.now(),
        deltaTime: null
    }))
    .scan(
        (previous, current) => ({
            time: current.time,
            deltaTime: (current.time - previous.time) / 1000
        })
    );
~~~

## Game Stream

~~~ js
Rx.Observable
    .combineLatest(ticker$, paddle$, objects$)
    .sample(TICKER_INTERVAL)
    .takeWhile((actors) => {
        return !over(actors);
    })
    .subscribe(update);
~~~

## Objects Stream

~~~ js
const INITIAL_OBJECTS = {
    ball: {
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        direction: {
            x: 2,
            y: 2
        }
    },
    bricks: factory(),
    score: 0
};
~~~

~~~ js
const objects$ = ticker$
    .withLatestFrom(paddle$)
    .scan(({ball, bricks, collisions, score}, [ticker, paddle]) => {

        let survivors = [];
        collisions = {
            paddle: false,
            floor: false,
            wall: false,
            ceiling: false,
            brick: false
        };

        ball.position.x = ball.position.x + ball.direction.x * ticker.deltaTime * BALL_SPEED;
        ball.position.y = ball.position.y + ball.direction.y * ticker.deltaTime * BALL_SPEED;

        bricks.forEach((brick) => {
            if (!collision(brick, ball)) {
                survivors.push(brick);
            } else {
                collisions.brick = true;
                score = score + 10;
            }
        });

        collisions.paddle = hit(paddle, ball);

        if (ball.position.x < BALL_RADIUS || ball.position.x > canvas.width - BALL_RADIUS) {
            ball.direction.x = -ball.direction.x;
            collisions.wall = true;
        }

        collisions.ceiling = ball.position.y < BALL_RADIUS;

        if (collisions.brick || collisions.paddle || collisions.ceiling ) {
            ball.direction.y = -ball.direction.y;
        }

        return {
            ball: ball,
            bricks: survivors,
            collisions: collisions,
            score: score
        };

    }, INITIAL_OBJECTS);
~~~

## Make your browser beep with the Web Audio API

~~~ js
const audio = new (window.AudioContext || window.webkitAudioContext)();
const beeper = new Rx.Subject();
const beep$ = beeper.sample(100).subscribe((key) => {

    let oscillator = audio.createOscillator();
    oscillator.connect(audio.destination);
    oscillator.type = 'square';

    oscillator.frequency.value = Math.pow(2, (key - 49) / 12) * 440;

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.100);

});
~~~

The formula is taken right from [Wikipedia](https://en.wikipedia.org/wiki/Piano_key_frequencies). It converts piano key numbers to frequencies. This way I can think about tones in a familiar way. Key 40 is Middle C and I can go up and down from there.

## Passing you the ball

Improvements
Pull Requests
Misunderstanding on my part?

I have yet to try out [Cycle.js](http://cycle.js.org/), maybe as soon as there is a [Canvas Driver](https://github.com/cyclejs/core/issues/157). I've been told it is an interesting alternative to React and built on top of RxJS.

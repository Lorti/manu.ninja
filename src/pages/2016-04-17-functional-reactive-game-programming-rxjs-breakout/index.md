---
path: /functional-reactive-game-programming-rxjs-breakout
title: Functional Reactive Game Programming – RxJS Breakout
date: 2016-04-17
categories: [coding, games]
tags: [rxjs]
thumbnail: /images/rxjs-breakout.png
sharing: true
---

Functional Reactive Programming is currently one of the hottest paradigms in the JavaScript community. I played with RxJS over the last couple of weeks and decided that there is no better way to dive into it than recreating a classic game. Computer games infamously store a lot of external state and my goal was to model everything as streams without relying on a single external state variable.

This post shares with you my approach as a complete beginner to RxJS so if you notice something odd please leave a message in the comments. If you want to use the code snippets in your own game feel free to copy and paste, but please link to your solution so I myself might benefit from looking at a different approach to a specific problem.

The code is available on [GitHub](https://github.com/Lorti/rxjs-breakout) and you can play the game in the [CodePen](http://codepen.io/Lorti/pen/JXpgBb) below. Focus the iFrame and then use your arrow keys. Yup, doesn't work on mobile, but so did the original Cab! There is sound as well, so be wary not to shock your colleagues.

<iframe height='480' scrolling='no' title='RxJS Breakout' src='//codepen.io/Lorti/embed/JXpgBb/?height=480&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/JXpgBb/'>RxJS Breakout</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Everything is a stream

You may have seen Andre Staltz's tutorial gist [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). To follow his mantra I've tried to model everything in the game as a stream. I assume that you are familiar with the classic [Atari Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)) game. All the player can do is to move his paddle. So how do we represent the player input as a stream?

## Input Stream

We are not only interested in the keys themselves but in how long the key is being hold down. If the player holds the left key pressed the paddle has to move to the left and vice versa.

<del>In the first step we create an observable that returns all keyboard events as a stream. Then in the next step we filter the events so that the stream only returns the `keyup` and `keydown` events of the left and right arrow keys. We then scan the stream and return a one-dimensional direction vector -- which sounds sophisticated but is really just a value of `-1`, `0` or `1`, indicating where the paddle should be heading.</del>

<ins>In the first step we create an observable that transform all `keydown` events to a one-dimensional direction vector -- which sounds sophisticated but is really just a value of `-1`, `0` or `1`, indicating where the paddle should be heading. We then merge the first observable with a second observable that listens to all `keyup` events and resets the vector to `0` as soon as the player lifts his finger.

<ins>(Thanks to [John Lindquist](https://twitter.com/johnlindquist) for pointing out this simpler approach in the comments!)</ins>

The last thing we have to take care of is that the initial Observable returns a `keydown` event every few milliseconds while you're holding the key. The `distinctUntilChanged()` operator enables us to push a new element down the stream only if the element is different than the one before.

~~~ js
const input$ = Rx.Observable
    .merge(
        Rx.Observable.fromEvent(document, 'keydown', event => {
            switch (event.keyCode) {
                case PADDLE_KEYS.left:
                    return -1;
                case PADDLE_KEYS.right:
                    return 1;
                default:
                    return 0;
            }
        }),
        Rx.Observable.fromEvent(document, 'keyup', event => 0)
    )
    .distinctUntilChanged();
~~~

## Paddle Stream

Equipped with the input stream from the previous snippet we can now create a stream that returns the position of the paddle according to the player's actions. We combine the ticker with the input stream and recalculate the position on each tick. The ticker itself is shown in the next section.

The pure function in the scan operator first moves the paddle based on the elapsed time since the last frame (`ticker.deltaTime`) and then clamps the value to the boundaries of our canvas.

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

The ticker is a simple stream that seeks to give us roughly 60 ticks per second. Each tick is mapped to the current time so that we can recalculate and return the delta time, which we use throughout the example to smoothly update positions.

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

This is one of the most straightforward streams in our implementation. It combines all of the games state and the observer then feeds it to the update function. The `sample` operator is used to clamp our game at 60 fps. If we wouldn't do this, the game would speed up as soon as the player moves the paddle. It's a weird behaviour, you should definitely try it out and see what happens. <del>Lastly, the `takeWhile` operator checks if the player lost or won the game and completes the observable.</del> <ins>If the player has destroyed all the bricks or the ball hit the floor the update function calls `dispose` on our subscription and ends the game.</ins>

~~~ js
const game = Rx.Observable
    .combineLatest(ticker$, paddle$, objects$)
    .sample(TICKER_INTERVAL)
    .subscribe(update);
~~~

## Objects Stream

It is called _objects_ stream but it also holds the game's score, because the score depends on the number of bricks left. The stream returns a new object containing the ball's and the bricks' properties in each update cycle. The initial object holds a centered ball heading to the bottom right, a lot of bricks and a score of `0`.

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

The more interesting part is the function that calculates our game's new state. It moves the ball according to its previous velocity vector and then checks for any collisions that might have happened, whether it be with a brick, the paddle, a wall or the floor. We change the direction of the ball if it hits something and store the collisions to play the correct sound and check whether the ball hit the floor, as this tells us that the player has lost.

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

Have you ever used the Web Audio API? I haven't up until now and it is great fun. The frequency formula in the observer is taken right from [Wikipedia](https://en.wikipedia.org/wiki/Piano_key_frequencies). It converts piano key numbers to frequencies. This way we can think about tones in a familiar way. Key 40 is Middle C and we can go up and down from there.

A sound is played each time the ball hits the paddle, a wall or a brick. The higher up the brick the higher the pitch. My browser seemed to complain about playing too many sounds when I hit multiple bricks at once so I just sampled the observable to the beep's length.

~~~ js
const audio = new (window.AudioContext || window.webkitAudioContext)();
const beeper = new Rx.Subject();
beeper.sample(100).subscribe((key) => {

    let oscillator = audio.createOscillator();
    oscillator.connect(audio.destination);
    oscillator.type = 'square';

    oscillator.frequency.value = Math.pow(2, (key - 49) / 12) * 440;

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.100);

});
~~~

## Passing you the ball

This concludes the explanation of my RxJS Breakout implementation. Do you have suggestions for improving it? Have you noticed a misunderstanding of RxJS on my part? If so please comment below or open a pull request on [GitHub](https://github.com/Lorti/rxjs-breakout).

This game has been an interesting learning experience for me. To get into Functional Reactive Programming you have to let go of certain paradigms wired into your brain. I have yet to try out [Cycle.js](http://cycle.js.org/), maybe as soon as there is a [Canvas Driver](https://github.com/cyclejs/core/issues/157). I've been told it is an interesting alternative to React and built on top of RxJS.

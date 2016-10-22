---
layout: post
title:  Using Web&nbsp;Technologies for a “Pull&nbsp;to&nbsp;Refresh” Animation 
date:   2016-10-23
categories: coding
sharing: true
thumbnail: /images/pull-to-refresh.png
---

Pull-to-refresh is a touchscreen gesture used in many mobile applications. This article shows a way of creating a simple pull-to-refresh animation using web technologies. The animation has seven different parts implemented with SVG, CSS and JavaScript.

![](/images/pull-to-refresh.gif)

Pull-to-refresh first appeared in the Tweetie app in 2008, which was later aquired by Twitter. The company now owns a [patent](https://www.google.com/patents/US20100199180) regarding the design pattern. This hasn't stopped developers from using it ubiquitously, as Twitter agreed to "only use his patent defensively".

The motion design for this animation isn't mine, but the link I've saved returns a 404 page. If you know the motion designer or have stumbled across my original inspiration please tell me so in the comments.

The following sections explain the different parts of the animation. You can try the [final pull-to-refresh animation](codepen-of-the-pull-to-refresh-animation) in a live CodePen at the end of the article.

![](/images/pull-to-refresh.png)

## Interaction

The interaction part begins with adding event listeners for the start, drag and end of the pull-to-refresh gesture. The drag listener lets the user pull until a certain threshold via listening to `e.clientY || e.changedTouches[0].clientY`{:.js}. If the user releases her finger before that the card returns to its initial position. If the users pulls further than the threshold the bending of the card starts. This continues to a second threshold which starts rest of the animation. While the animation is playing we remove the event listeners, so no weird things are happening.

## Bending the card

The card is initally a simple rectangle. Bending of the card is done via replacing the SVG path with a quadratic Bézier curve.

``` html
<path id="card" d="M0,0 H360 V480 H0"/>
```

The helper function takes two arguments for defining the quadratic Bézier curve. After the `Q` in the path description you define the control point and the end point of the curve. The start and end point are on the same position, which is the threshold defined in the first event listener. Changing the control point bends the card.

``` js
const setCardPath = (y1, y2) => {
    var d = "M360,480 H0 V" + y1 + " Q180," + y2 + " 360," + y1;
    $card.setAttribute('d', d);
};
```


## Animation via JavaScript

After bending the card the animation continues without the user's influence. Some parts are animated via `requestAnimationFrame()` in JavaScript, all of which follow the recursive structure in the code snippet below. 

``` js
let start;
const duration = 1250;

const animation = timestamp => {
    if (!start) {
        start = timestamp;
    }

    const progress = timestamp - start;
    
    /* Animation... */

    if (progress < duration) {
        requestAnimationFrame(animation);
    }
};

requestAnimationFrame(animation);
```

## Oscillating the card

Oscillating the card is done using the two concepts from the previous sections. The `setCardPath`{:.js} helper is used in a recursion function for animating a simple harmonic motion.

``` js
const amplitude = 100 - easing.easeOutCubic(progress / duration) * 100;
const time = 3 * (progress / duration);
const y = amplitude * Math.cos(6.283185 * time);
```

The phase _φ_ is 0 and the frequency _f_ is 1. This sets the angular motion _ω_ to _2π_, making the equation even simpler. Damping of the harmonic motion is achieved with a cubic easing equation.

![](/images/simple-harmonic-motion.svg)
 
## Water droplet with gooey effect

The water droplet is a circle that is fused with the card. This is achieved with the help of an SVG filter that we need to apply to the card and circle. 

``` html
<g filter="url(#goo)">
    <use xlink:href="#card"/>
    <circle id="circle" cx="180" cy="50" r="20"/>  
</g>
```

The circle itself is hidden in front of the card and translated, as soon as we add the `animated` class via JavaScript.

``` css
#circle {
    transform: translate(0, 100px);
    transition: none;
    &.animated {
        transform: translate(0, 0);
        transition: all .25s .05s ease-out;
    }
}
```

The gooey effect is well explained in the article [The Gooey Effect](https://css-tricks.com/gooey-effect/). The basic concept is blurring two graphical elements and then sharpening the edge by increasing the contrast of the alpha channel.

``` html
<filter id="goo" filterUnits="userSpaceOnUse" x="130" y="0" width="100" height="100">
    <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur"/>
    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -7" result="contrast"/>
    <feComposite in="SourceGraphic" in2="contrast" operator="atop"/>
</filter>
```

After blurring the elements a `feColorMatrix` filter let's us specify a transformation matrix for changing pixel colors. In this example we multiply all alpha values by _19_ and then subtract _7 * 255_. This means that all alpha values greater _94_ stay visible, while all alpha values smaller _94_ become fully transparent. 

## Animating the circular progress indicator

The progress indicator is an SVG arc, that is set to correct position with the help of a group. This way we can specify the path from its local coordinates of _(0, 0)_.

``` html
<g transform="translate(180, 50) scale(1, 1) rotate(90)">
    <path id="progress"/>
</g>
```

We have a fixed starting point at _(25, 0)_, which is to the right of the center. The radii of our arc are _(25, 25)_. We then move a point in a circular motion around the center, which are our `x` and `y` values. The `largeArcFlag` determines if the arc should be greater than or less than _180_ degrees.

``` js
const setProgressPath = percent => {
    const x = 25 * Math.cos(percent * 6.283185);
    const y = 25 * Math.sin(percent * 6.283185);
    const largeArcFlag = percent <= 0.5 ? 0 : 1;
    const d = "M25,0 A25,25 0 " + largeArcFlag + " 1 " + x + "," + y;
    $progress.setAttribute('d', d);
};
```
The end of the loading process is signaled by a "bubble burst" of the progress indicator. This is done in CSS and animating the opacity, stroke width and size.

``` css
#progress {
    opacity: 1;
    stroke-width: 3px;
    transform: scale(1, 1);
    transition: none;
    &.animated {
        opacity: 0;
        stroke-width: 0px;
        transform: scale(1.5, 1.5);
        transition: all .35s ease-in;
    }
}
```

## Closing animation

The closing animation is used at the end of the animation or if the drag is released before triggering the animation.

``` js
const progress = timestamp - start;
const y = position - easing.easeInOutCubic(progress / duration) * position;
setCardPath(y, y);
$content.style.top = `${y}px`;
$content.style.opacity = 1 - (y / 100);
```

`position` is either the arbirary 100 pixels from the end of the animation or wherever the drag is released if the animation is not triggered. Add the end of the closing animation all flags are reset and we add all the event listeners again.

## CodePen of the pull-to-refresh animation

<p data-height="640" data-theme-id="light" data-slug-hash="ozExqp" data-default-tab="result" data-user="Lorti" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/Lorti/pen/ozExqp/">Liquid Loading II</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

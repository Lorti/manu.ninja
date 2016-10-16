---
layout: post
title:  Using Web&nbsp;Technologies for a “Pull&nbsp;to&nbsp;Refresh” Animation 
date:   2016-10-15
categories: coding
sharing: true
thumbnail: /images/pull-to-refresh.png
---

pull to refresh design pattern on Android implemented with SVG elements, SVG filters, CSS animation and JavaScript animation

![](/images/pull-to-refresh.gif)

The motion design for this animation is not mine, but the Behance link I had saved now returns a 404 page. If you know the motion designer or have stumbled accross my original inspiration please tell me so in the comments.

analysing the different parts, on the bottom of the page is a live CodePen for trying the pull to refresh animation 

![](/images/pull-to-refresh.png)

## Interaction

`e.clientY || e.changedTouches[0].clientY`{:.js}

set event listeners
let the user pull until a treshold
let the user bend until a threshold
start the rest of the animation and remove event listeners

## Bending the card

``` html
<path id="card" d="M0,0 H360 V480 H0"/>
```

``` js
const setCardPath = (y1, y2) => {
    var d = "M360,480 H0 V" + y1 + " Q180," + y2 + " 360," + y1;
    $card.setAttribute('d', d);
};
```

quadratic Bézier curve
after the `Q` you define the control point and the end point of the curve

## Animation via JavaScript

``` js
let start;
const duration = 1250;

const animation = timestamp => {
    if (!start) {
        start = timestamp;
    }

    const progress = timestamp - start;
    /* Animation */

    if (progress < duration) {
        requestAnimationFrame(animation);
    }
};

requestAnimationFrame(animation);
```

## Oscillating the card

``` js
const amplitude = 100 - easing.easeOutCubic(progress / duration) * 100;
const time = 3 * (progress / duration);
const y = amplitude * Math.cos(6.283185 * time);
```

`setCardPath` function from earlier

![](/images/simple-harmonic-motion.svg)
 
## Water droplet with gooey effect

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

``` html
<filter id="goo" filterUnits="userSpaceOnUse" x="130" y="0" width="100" height="100">
    <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur"/>
    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -7" result="contrast"/>
    <feComposite in="SourceGraphic" in2="contrast" operator="atop"/>
</filter>
```

blurring two graphical elements and then sharpening the edge by increasing the contrast of the alpha channel
multiply all alpha values by 19 and then subtract 7 * 255
all alpha values greater 94 stay visibla, all alpha values smaller 94 become fully transparent

[The Gooey Effect](https://css-tricks.com/gooey-effect/)

``` html
<g filter="url(#goo)">
    <use xlink:href="#card"/>
    <circle id="circle" cx="180" cy="50" r="20"/>  
</g>
```

## Animating the circular progress indicator

``` html
<g transform="translate(180, 50) scale(1, 1) rotate(90)">
    <path id="progress"/>
</g>
```

``` js
const setProgressPath = percent => {
    const x = 25 * Math.cos(percent * 6.283185);
    const y = 25 * Math.sin(percent * 6.283185);
    const largeArcFlag = percent <= 0.5 ? 0 : 1;
    const d = "M25,0 A25,25 0 " + largeArcFlag + " 1 " + x + "," + y;
    $progress.setAttribute('d', d);
};
```

we have a fixed starting point at `25,0`
the center of the arc is set to `25,25`
we then move a point in a circular motion around the center, which are our x and y values
The `largeArcFlag` determines if the arc should be greater than or less than 180 degrees

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

``` js
const progress = timestamp - start;
const y = position - easing.easeInOutCubic(progress / duration) * position;
setCardPath(y, y);
$content.style.top = `${y}px`;
$content.style.opacity = 1 - (y / 100);
```

`position` is either the 100 pixel from the end of the animation or wherever the drag is released if the animation is not triggered
the add all the event listeners again

## Final result

<p data-height="640" data-theme-id="light" data-slug-hash="ozExqp" data-default-tab="result" data-user="Lorti" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/Lorti/pen/ozExqp/">Liquid Loading II</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

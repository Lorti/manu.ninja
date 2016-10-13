---
layout: post
title:  Using Web&nbsp;Technologies for a “Pull&nbsp;to&nbsp;Refresh” Animation 
date:   2016-10-15
categories: coding
sharing: true
thumbnail: /images/pull-to-refresh.png
---

## Interaction

`e.clientY || e.changedTouches[0].clientY`{:.js}

set event listeners
let the user pull until a treshold
let the user bend until a threshold
start the rest of the animation and remove event listeners

## Bending the card

``` js
const setCardPath = (y1, y2) => {
  var d = "M360,480 H0 V" + y1 + " Q180," + y2 + " 360," + y1;
  $card.setAttribute('d', d);
};
```
quadratic Bézier curve
after the `Q` you define the control point and the end point of the curve

## Oscillating the card

``` js
const amplitude = 100 - easing.easeOutCubic(progress / duration) * 100;
const time = 3 * (progress / duration);
const y = amplitude * Math.cos(6.283185 * time);
```

![](/images/simple-harmonic-motion.svg)
 
![](/images/pull-to-refresh.png)

![](/images/pull-to-refresh.gif)

<p data-height="640" data-theme-id="light" data-slug-hash="ozExqp" data-default-tab="result" data-user="Lorti" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/Lorti/pen/ozExqp/">Liquid Loading II</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

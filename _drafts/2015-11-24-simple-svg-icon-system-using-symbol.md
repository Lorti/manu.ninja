---
layout: post
title:  Simple SVG Icon System Using &lt;symbol&gt;
date:   2015-11-24
categories: coding
---

I won't go into detail why an SVG icon system based on symbols is a good choice for your icons, because there are plenty of [great](https://css-tricks.com/svg-symbol-good-choice-icons/) [articles](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/) out there. I will just give you an overview of our solution at _karriere.at_ and present a tiny [grunt plugin](https://www.npmjs.com/package/grunt-svg-symbols) called `grunt-svg-symbols`, which creates a bunch of SVG icon systems from as many folders full of icons as you like.

[`currentColor`](http://caniuse.com/#feat=currentcolor)

~~~ html
<svg width="0" height="0">
  <symbol id="mail" viewBox="0 0 80 80">
    <path d="M77.766 17.152..."/>
  </symbol>
  <symbol id="lock" viewBox="0 0 80 80">
      <path d="M61.05 35.833..."/>
  </symbol>
</svg>
~~~~

~~~~ html
<svg>
    <use xlink:href="#mail"></use>
</svg>
~~~~

If you would like to give me your feedback you can do so on the [GitHub](https://github.com/Lorti/grunt-svg-symbols) repository page of the `grunt-svg-symbols` plugin. And just install it via
[npm](https://www.npmjs.com/package/grunt-svg-symbols), if you want to use it.

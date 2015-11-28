---
layout: post
title:  Simple SVG Icon System Using &lt;symbol&gt;
date:   2015-12-01
categories: coding
---

I won't go into detail why an SVG icon system based on symbols is a good choice for your icons, because there are plenty of [great](https://css-tricks.com/svg-symbol-good-choice-icons/) [articles](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/) out there. I will just give you an overview of our solution at *karriere.at* and show you a tiny [Grunt plugin](https://www.npmjs.com/package/grunt-svg-symbols) called `grunt-svg-symbols`, which creates a bunch of SVG icon systems from as many folders full of icons as you like.

The SVG icons we receive from our designers come from both Illustrator and Sketch. The only specification I want to give them is to center the icons in a rectangle and to make sure that the icons have the same visual weight when shown side by side. I then usually set all `fill` and `stroke` attributes to [`currentColor`](http://caniuse.com/#feat=currentcolor), as the icons are almost always monochrome. This way the SVG icon system behaves in much the same way as the icon font our developers are used to.

The Grunt configuration is really simple and allows us to specify lots of smaller icon sets, which can be inlined on landing pages for improved performance.

~~~ js
grunt.initConfig({
    svg_symbols: {
        options: {
            precision: 1,
            className: 'u-hidden',
            width: 24,
            height: 24
        },
        files: {
            'icons/auth.svg': ['svg/auth/*.svg'],
            'icons/benefits.svg': ['svg/benefits/*.svg']
        }
    },
});
~~~

The `precision` options tells [SVGO](https://github.com/svg/svgo) to round to a given number of places after the decimal separator. SVGO also strips all the unessential extra markup from Sketch and Illustrator, resulting in an SVG icon system that is clean, optimized and lightweight.

~~~ html
<svg class="u-hidden">
    <symbol id="mail" viewBox="0 0 24 24">
        <path d="M77.766 17.152..."/>
    </symbol>
    <symbol id="lock" viewBox="0 0 24 24">
        <path d="M61.05 35.833..."/>
    </symbol>
</svg>
~~~

Symbols can then be referenced by using the `xlink:href` attribute, which works with inlined as well referenced files.

~~~ html
<svg>
    <use xlink:href="#mail"></use>
</svg>
~~~

~~~ html
<svg>
    <use xlink:href="icons/auth.svg#lock"></use>
</svg>
~~~

If you would like to give me your feedback you can do so on the [GitHub](https://github.com/Lorti/grunt-svg-symbols) repository page of the `grunt-svg-symbols` plugin. And just install it via
[npm](https://www.npmjs.com/package/grunt-svg-symbols), if you want to use it.

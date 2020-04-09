---
layout: layouts/post.njk
permalink: /current-color-for-fills-and-strokes-with-grunt-svg-symbols/index.html
title: Current Color for Fills and Strokes
date: 2015-12-22
categories: [coding]
tags: [svg, icons, tools]
summary: Several people have given me feedback on my <code>grunt-svg-symbols</code> plugin. They especially liked the idea of changing color values to <code>currentColor</code>, so that the icons inherit the text color. Therefore the updated plugin has an option to automatically replace the values of all <code>fill</code> and <code>stroke</code> attributes for you.
---

Several people have given me feedback on my `grunt-svg-symbols` plugin. They especially liked the idea of changing color values to `currentColor`, so that the icons inherit the text color. Therefore the updated [plugin](https://www.npmjs.com/package/grunt-svg-symbols) has an option to automatically replace the values of all `fill` and `stroke` attributes for you.

~~~ js
grunt.initConfig({
    svg_symbols: {
        options: {
            currentColor: true
        },
        files: {
            'icons/user.svg': ['svg/user/*.svg']
        }
    },
});
~~~

The only prerequisite is of course, that your source SVG files contain some `fill` or `stroke` attributes. These can also be defined on groups or parent elements as the optimizer does a great job in merging them down to single paths.

~~~ html
<svg class="u-hidden">
    <symbol id="mail" viewBox="0 0 24 24">
        <path fill="currentColor" d="M77.766 17.152..."/>
    </symbol>
</svg>
~~~

If you encounter any bugs or have a feature request please let me know. You can also report issues directly to the [GitHub](https://github.com/Lorti/grunt-svg-symbols) repository of the `grunt-svg-symbols` plugin.

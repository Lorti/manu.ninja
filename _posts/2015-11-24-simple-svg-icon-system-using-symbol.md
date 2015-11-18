---
layout: post
title:  Simple SVG Icon System Using &lt;symbol&gt;
date:   2015-11-24
categories:
  - coding
---

[Chris Coyier](https://css-tricks.com/svg-symbol-good-choice-icons/)

[npmjs.com/package/grunt-svg-symbols](https://www.npmjs.com/package/grunt-svg-symbols)

```html
<svg width="0" height="0">
  <symbol id="mail" viewBox="0 0 80 80">
    <path d="M77.766 17.152..."/>
  </symbol>
  <symbol id="lock" viewBox="0 0 80 80">
      <path d="M61.05 35.833..."/>
  </symbol>
</svg>
```

```html
<svg>
    <use xlink:href="#mail"></use>
</svg>
```

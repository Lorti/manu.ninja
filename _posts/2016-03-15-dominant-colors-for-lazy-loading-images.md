---
layout: post
title:  Dominant Colors for Lazy-Loading Images
date:   2016-03-15
categories: coding
---

![](/images/pinterest-placeholders.gif)

Pinterest sets the style of the wrapper to `background: #1e1f20;`.

~~~ html
<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
     data-src="https://s-media-cache-ak0.pinimg.com/474x/50/1b/74/501b74902935b063816ea8e14f460ca0.jpg"
     alt="Ghost In The Shell">
~~~

You can also use a different Base64-encoded placeholder for each image.

Blank GIF, which is 43 bytes:

~~~
data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==
47 49 46 38 39 61 // Header
01 00 01 00 80 00 00 // Logical Screen Descriptor
FF FF FF 00 00 00 // Global Color Table
21 F9 04 00 00 00 00 00 // Graphics Control Extension
2C 00 00 00 00 01 00 01 00 00 // Image Descriptor
02 02 44 01 00 // Image Data
3B // Trailer
~~~

Tiny GIF, which is only 34 bytes:

~~~
data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBAA==
47 49 46 38 39 61 // Header
01 00 01 00 80 01 00 // Logical Screen Descriptor
FF FF FF 00 00 00 // Global Color Table
2C 00 00 00 00 01 00 01 00 00 // Image Descriptor
02 02 44 01 00 // Image Data
~~~

## Reference

[The Tiniest GIF Ever](http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever)

[What’s In A GIF][http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp]

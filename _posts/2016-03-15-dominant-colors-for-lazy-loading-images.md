---
layout: post
title:  Dominant Colors for Lazy-Loading Images
date:   2016-03-15
categories: coding
---

Pinterest, Google Images and lots of image-heavy sites lazy-load their content. They also calculate the dominant color of each image to use as a placeholder. This post presents a few methods to do the same.

![](/images/pinterest-placeholders.gif)

<!-- https://jmperezperez.com/medium-image-progressive-loading-placeholder/ -->

The basic concept is to use a tiny `blank.gif`{:.html} as `src` attribute and replace it with the correct image after the page has fully loaded. The `blank.gif`{:.html} can also be set as a Base64-encoded Data URI to save a request.

~~~ html
<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
     data-src="https://s-media-cache-ak0.pinimg.com/474x/50/1b/74/501b74902935b063816ea8e14f460ca0.jpg"
     alt="Ghost In The Shell">
~~~

Pinterest then sets the style of the wrapper to `background: #1e1f20;`{:.css} and shows the image with `opacity: 1;`{:.css} when it has loaded. They could therefore easily animate the transition, but right now they don't.

## Finding the Dominant Color of an Image

Finding the dominant colors of an image is a science in itself and you can indulge in clustering algorithms and for example write your own [k-means clustering](http://charlesleifer.com/blog/using-python-and-k-means-to-find-the-dominant-colors-in-images/). If you want a simpler solution the [quantization](http://www.graphicsmagick.org/quantize.html) of GraphicsMagick or ImageMagick is usually sufficient.

~~~ bash
brew install graphicsmagick
npm install gm
~~~

~~~ js
var gm = require('gm');

gm('test.jpg')
    .resize(100, 100)
    .colors(1)
    .toBuffer('RGB', function (error, buffer) {
        console.log(buffer.slice(0, 3));
    });
~~~

~~~ php
<?php

$image = new Imagick('test.jpg'));
$image->resizeImage(100, 100, Imagick::FILTER_GAUSSIAN, 1);
$image->quantizeImage(1, Imagick::COLORSPACE_LAB, 0, false, false);
$image->setFormat('RGB');
echo substr(bin2hex($image), 0, 6);
~~~

## Deep Dive into GIFs and Base64 Data URIs

You can also use a different Base64-encoded placeholder for each image.

Blank GIF, which is 43 bytes:

~~~
47 49 46 38 39 61             // Header
01 00 01 00 80 00 00          // Logical Screen Descriptor
FF FF FF 00 00 00             // Global Color Table
21 F9 04 00 00 00 00 00       // Graphics Control Extension
2C 00 00 00 00 01 00 01 00 00 // Image Descriptor
02 02 44 01 00                // Image Data
3B                            // Trailer
data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==
~~~

Tiny GIF, which is only 34 bytes:

~~~
47 49 46 38 39 61             // Header
01 00 01 00 80 01 00          // Logical Screen Descriptor
FF FF FF 00 00 00             // Global Color Table
2C 00 00 00 00 01 00 01 00 00 // Image Descriptor
02 02 44 01 00                // Image Data
data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBAA==
~~~

How did Pinterest get a GIF with only 26 bytes? Turns out that you can remove the global color table and the LZW-encoded image data as well. Browsers then just assume a color, which is usually black.

~~~
data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=
~~~

Pinterest does not remove the trailer. On the one hand Photoshop, GIMP and possible some browsers report an _Unexpected End of File_ error if there is no trailer present. On the other hand adding it back in does not increase the size of the Base64 string. Why? A Base64 string's length is always a multiple of 4 bytes. The equals symbol is used as a padding at the end of the string. So if you remove the trailer the Base64 string will end in `AA==` but still have 26 bytes.

~~~
data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACAA==
~~~

## Node.js Snippets

~~~ js
var gm = require('gm');

var header = new Buffer('474946383961', 'hex');
var logicalScreenDescriptor = new Buffer('01000100800100', 'hex');
var imageDescriptor = new Buffer('2c000000000100010000', 'hex');
var imageData = new Buffer('0202440100', 'hex');

gm('test.jpg')
    .resize(100, 100)
    .colors(1)
    .toBuffer('RGB', function (error, buffer) {
        var gif = [
            header,
            logicalScreenDescriptor,
            buffer.slice(0, 3),
            new Buffer([0, 0, 0]),
            imageDescriptor,
            imageData
        ];
        console.log('data:image/gif;base64,' + Buffer.concat(gif).toString('base64'));
    });
~~~

~~~ html
data:image/gif;base64,R0lGODlhAQABAIABAEdJRgAAACwAAAAAAQABAAACAkQBAA==
~~~

~~~ js
var gm = require('gm');

gm('test.jpg')
    .resize(3, 3)
    .toBuffer('GIF', function (error, buffer) {
        console.log('data:image/gif;base64,' + buffer.toString('base64'));
    });
~~~

~~~ html
data:image/gif;base64,R0lGODlhAwACAPIFAD1KI0JSIWp2WXOIj4WVlYicngAAAAAAACH5BAAAAAAALAAAAAADAAIAAAMESDUSkAA7
~~~

## References

[What’s In A GIF](http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp)

[The Tiniest GIF Ever](http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever)

[GIF File Format Summary](http://www.fileformat.info/format/gif/egff.htm)

[GraphicsMagick for node.js](http://aheckmann.github.io/gm/)

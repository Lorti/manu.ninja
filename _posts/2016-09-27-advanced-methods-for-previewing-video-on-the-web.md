---
layout: post
title:  Boost User Engagement with Animated Video Previews
date:   2016-09-27
categories: coding
sharing: true
thumbnail: /files/big_buck_bunny_720p_h264_thumbnail.jpg
---

If you are building a video portal, an artist's portfolio or any other showcase of films you usually look for representative thumbnails. Though you don't have to stop there and can enhance your video previews by showing more than a single still image of each video.

This article shows two approaches, both using the [FFmpeg](https://ffmpeg.org/) library. You can install the command-line tool via [ffmpeg.org](https://ffmpeg.org/download.html) or your package manager, for example
`brew install ffmpeg`{:.bash} on macOS. The video being used in the examples is [Big Buck Bunny](https://peach.blender.org/) by the Blender Foundation.



## Showing _n_ seconds of the original video

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eius ex id magnam mollitia quis sit tempore ut! At aut beatae consequatur, delectus est fugiat harum maiores necessitatibus pariatur voluptates!

~~~ bash
ffmpeg -i video.mp4 \
       -vf "trim='start=4\:31:duration=4',scale=320:-1,setpts=PTS-STARTPTS" -t 4 -sws_flags gauss \
       -vcodec libx264 -preset medium -crf 31  \
       -an -y preview.mp4
~~~

<video width="320" height="180" autoplay controls preload="auto" loop>
    <source src="/files/big_buck_bunny_720p_h264_preview.mp4" type="video/mp4">
</video>

* `-vf`{:.bash} sets the filtergraph, which in this case consists of three operations, separated by commas.

    * `trim='start=4\:31:duration=4'`{:.bash} trims the video starting at 00:04:31 and ending at 00:04:35. The colon has to be escaped because colons separate parameters in the [filtergraph syntax](https://ffmpeg.org/ffmpeg-all.html#Filtergraph-syntax-1).
    
    * `scale=320:-1`{:.bash} scales the video proportionally to a width of 320 pixels.
    
    * `setpts=PTS-STARTPTS`{:.bash} changes the presentation timestamp of all frames, so that the trimmed video starts at 00:04:31 of the original.
    
* `-t 4`{:.bash} tells FFmpeg to stop writing to the output after its duration reaches the specified value.

* `-sws_flags gauss`{:.bash} sets the [scaling algorithm](https://ffmpeg.org/ffmpeg-all.html#Scaler-Options).

* `-vcodec libx264 -preset medium -crf 31`{:.bash} tells FFmpeg to use the x264 encoder with medium [encoding speed](https://trac.ffmpeg.org/wiki/Encode/H.264#a2.Chooseapreset) and a [constant quality](https://trac.ffmpeg.org/wiki/Encode/H.264#a1.ChooseaCRFvalue) of 31. This is relatively low, resulting in a tiny file of 51.1 KB.

* `-an`{:.bash} disables audio and `-y`{:.bash} overwrites the output file without asking.

### Usage example

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eius ex id magnam mollitia quis sit tempore ut! At aut beatae consequatur, delectus est fugiat harum maiores necessitatibus pariatur voluptates! 

<p data-height="340" data-theme-id="light" data-slug-hash="RGABNa" data-default-tab="result" data-user="Lorti" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/RGABNa/">Video Thumbnails</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

~~~ html
<a href="https://manu.ninja/">
    <img width="320" height="180" src="preview.jpg">
    <video width="320" height="180" preload="auto" loop="loop">
        <source src="preview.mp4" type="video/mp4">
    </video>
</a>
~~~

~~~ js
const videos = document.querySelectorAll('video');
[].forEach.call(videos, vid => {
    vid.addEventListener('mouseenter', () => vid.play());
    vid.addEventListener('mouseout', () => vid.pause());
});
~~~

### Further thoughts

* play them always as a "cover", on hover or on focus
* difficult to choose times
* you might want to write an editor or let users add timecodes in your cms
* It's worth noting that this type of work is a current topic of research so again, it may produce imperfect results.
* will not play on some mobile devices
* lazy-loading


## Showing _n_ frames of the original video

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eius ex id magnam mollitia quis sit tempore ut! At aut beatae consequatur, delectus est fugiat harum maiores necessitatibus pariatur voluptates!

~~~ bash
ffmpeg -i video.mp4 \
        -vf "select=gt(scene\,0.75),scale=320:-1,tile=4x1" -vframes 1 slides.png \
&& convert slides.png -quality 75% slides.jpg \
&& rm slides.png
~~~

![](/files/big_buck_bunny_720p_h264_slides.jpg)

* `-vf`{:.bash} sets the filtergraph, which in this case consists of three operations, separated by commas.

    * `select=gt(scene\,0.75)`{:.bash} selects frames to pass to the output. The condition in this case is that current frame introduces a new scene with a probability of 75%.
    
    * `scale=320:-1`{:.bash} scales the video proportionally to a width of 320 pixels.
    
    * `tile=4x1`{:.bash} layouts several successive frames in a grid.
    
* `convert slides.png -quality 75% slides.jpg`{:.bash} uses ImageMagick to properly convert the slides to a JPEG with 40.8 KB.

### Usage example

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eius ex id magnam mollitia quis sit tempore ut! At aut beatae consequatur, delectus est fugiat harum maiores necessitatibus pariatur voluptates!

<p data-height="240" data-theme-id="light" data-slug-hash="bwqmVo" data-default-tab="result" data-user="Lorti" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/Lorti/pen/bwqmVo/">Video Thumbnails II</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

~~~ html
<a href="https://manu.ninja/">
    <img class="thumbnail" width="320" height="180" src="preview.jpg">
    <img class="slides" width="1280" height="180" src="slides.jpg">
</a>
~~~

~~~ css
a {
  float: left;
  position: relative;
  overflow: hidden;
}
a:hover .slides {
  display: block;
  animation: slides 5s steps(5) infinite;
}
.slides {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
@keyframes slides {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-320px * 5);
  }
}
~~~

### Further thoughts

* uses css instead of videos
* scene detection is not perfect
* will work on mobile
* very flexible, you can show as many or as few as you like



## Why?

http://bombbomb.com/blog/video-play-rate-animated-preview-feature/

https://blog.embed.ly/create-striking-video-previews-with-animated-covers-abd8995c127a

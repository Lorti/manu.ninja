---
layout: post
title:  Boost User Engagement with Animated Video Previews
date:   2016-09-30
categories: coding
sharing: true
thumbnail: /files/big_buck_bunny_720p_h264_thumbnail.jpg
---

If you are building a video portal, an artist's portfolio or any other showcase of films, from smartphone footage to news coverage to sports clips, you typically look for engaging thumbnails. Though you don't have to stop there and can boost your video previews and click-through rate by showing more than a single still image of each video. This article highlights two approaches to grab your viewers' attention.

The examples both use the [FFmpeg](https://ffmpeg.org/) library. You can install the command-line tool either via [ffmpeg.org](https://ffmpeg.org/download.html) or your package manager, for example
`brew install ffmpeg`{:.bash} on macOS. The video being used is the open-source [Big Buck Bunny](https://peach.blender.org/) by the Blender Foundation.



## Showing _n_ seconds of the original video

If you want to trim your source file to a video snippet of a few seconds you have to modify the following FFmpeg command. It enables you to show your most appealing scene on hover, as soon as the video enters the viewport or in an endless loop. The one-liner is split into multiple lines to make explaining the different parts easy.

~~~ bash
ffmpeg -i video.mp4 \
       -vf "trim='start=4\:31:duration=4',scale=320:-1,setpts=PTS-STARTPTS" -sws_flags gauss \
       -vcodec libx264 -preset medium -crf 31  \
       -movflags +faststart \
       -an -y preview.mp4
~~~

<video width="320" height="180" autoplay controls preload="auto" loop>
    <source src="/files/big_buck_bunny_720p_h264_preview.mp4" type="video/mp4">
</video>

* `-vf`{:.bash} sets the filtergraph, which in this case consists of three operations, separated by commas.

    * `trim='start=4\:31:duration=4'`{:.bash} trims the video starting at 00:04:31 and ending at 00:04:35. The colon has to be escaped because colons separate parameters in the [filtergraph syntax](https://ffmpeg.org/ffmpeg-all.html#Filtergraph-syntax-1).
    
    * `scale=320:-1`{:.bash} scales the video proportionally to a width of 320 pixels.
    
    * `setpts=PTS-STARTPTS`{:.bash} changes the presentation timestamp of all frames, so that the trimmed video starts at 00:04:31 of the original.
    
* `-sws_flags gauss`{:.bash} sets the [scaling algorithm](https://ffmpeg.org/ffmpeg-all.html#Scaler-Options) to Gaussian.

* `-vcodec libx264 -preset medium -crf 31`{:.bash} tells FFmpeg to use the x264 encoder with medium [encoding speed](https://trac.ffmpeg.org/wiki/Encode/H.264#a2.Chooseapreset) and a [constant quality](https://trac.ffmpeg.org/wiki/Encode/H.264#a1.ChooseaCRFvalue) of 31. This is relatively low, resulting in a tiny file of 51.1 KB.

* `-movflags +faststart`{:.bash} moves all metadata to the beginning of the file.

* `-an`{:.bash} disables audio and `-y`{:.bash} overwrites the output file without asking.

### Usage

The CodePen below shows see the "classical" desktop example. The thumbnails are replaced with the video snippets on hover. You have to attach a minimal JavaScript event handler to all of your videos to start and pause the videos on `mouseenter` and `mouseleave`. The example also illustrates that modern desktop browsers are highly optimized for video playback. Try increasing the number of elements and you will see that it takes many elements to notice performance issues.

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
    vid.addEventListener('mouseleave', () => vid.pause());
});
~~~

### Considerations

* Instead of limiting yourself to desktop browsers by only handling mouse events you could play the video snippets as an infinitely looping "cover" in front of your original video, to account for touch devices.

* You should think about lazy-loading and load the video as soon as the element enters the viewport. The same goes for playback. Don't play your videos when they are out of sight.

* It's difficult to choose where to cut your videos. You might want to write an editor that lets you or your users specify timecodes. This can be done via the `audio|video.currentTime` property. Another option is to always skip the first 5 seconds and trim your video to the next 5 seconds. These methods depend heavily on your use case. Bear in mind, that automatically detecting important parts in a video is a current topic of research and highly complex.

* Videos will generally not autoplay on mobile devices, to save battery and bandwidth. You can circumvent this by converting your video snippet to an animated GIF, or you choose the second approach in this article.



## Showing _n_ frames of the original video

Instead of showing a video snippet you might want to opt for a slideshow of the first few scenes. On the on hand you get the benefit of relying purely on CSS, which means it works on mobile devices. On the other hand FFmpeg features a scene detection algorithm you can use for this purpose.

~~~ bash
ffmpeg -i video.mp4 \
        -vf "select=gt(scene\,0.75),scale=320:-1,tile=4x1" -vframes 1 slides.png \
&& convert slides.png -quality 75% slides.jpg \
&& rm slides.png
~~~

![](/files/big_buck_bunny_720p_h264_slides.jpg)

* `-vf`{:.bash} sets the filtergraph, which in this case consists of three operations, separated by commas.

    * `select=gt(scene\,0.75)`{:.bash} selects frames to pass to the output. The condition is that current frame introduces a new scene with a [probability of 75%](https://ffmpeg.org/ffmpeg-all.html#select_002c-aselect).
    
    * `scale=320:-1`{:.bash} scales the video proportionally to a width of 320 pixels.
    
    * `tile=4x1`{:.bash} layouts several successive frames in a grid.
    
* `convert slides.png -quality 75% slides.jpg`{:.bash} uses [ImageMagick](http://www.imagemagick.org/script/index.php) to properly convert the slides to a small JPEG with 40.8 KB.

### Usage

As you would do with a [CSS sprite animation](simple-electron-gui-wrapper-for-a-command-line-utility#bell) you have to use the `steps()` interpolation function to move your slideshow strip along the horizontal axis. You can choose the duration of each slide and show the main thumnbail in-between if you want, which I have done for the CodePen example.

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

### Considerations

* This approach uses CSS animations instead of actual videos, which makes it work virtually everywhere.

* The slides might be less of an eye-catcher than a fully moving video snippet. The slides do give a more diverse impression of the video, however.

* FFmpeg's scene detection is not perfect, but generally gives you good results. The documentation suggests using a value between 0.3 and 0.5 as probability threshold, but for Big Buck Bunny I had good results with a higher value.

* As with any other image- or video-heavy design you have to ensure that performance does not suffer. This can of course be achieved most notably by lazy-loading and only loading the slides if needed.

---

That's about it. Please let me know if these approaches are useful to you and feel free to link to your implementations in the comments below, I'd like to see what people come up with.

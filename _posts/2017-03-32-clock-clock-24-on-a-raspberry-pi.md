---
layout: post
title:  Clock Clock 24 on a Raspberry Pi
date:   2017-03-21
categories: [coding, art]
thumbnail: /images/clock-clock-24.jpg
sharing: true
---

The original Clock Clock 24 was designed by [Humans since 1982]. 24 analog clocks form a digital clock. Clever arrangement of the clock hands transform them into seven-segment displays. At the time of writing you can buy the clock at $ 5,999.00 in the [MoMA] store. My girlfriend's father stumpled upon this clock when looking for a new living room clock. I took the liberty and created a [Clock Clock 24] homage with web technologies. My girlfriend and I then put the clock on a Raspberry Pi with a 3.5″ display. This article explains how we did it.

<video width="990" height="430" autoplay controls preload="auto" loop>
    <source src="/images/clock-clock-24.mp4" type="video/mp4">
</video>

## Clock Clock 24 with HTML (SVG), CSS and JavaScript

The analog clocks are simple shapes that are animated via CSS variables.

``` css
.clock {
  --small-hand: -135deg;
  --large-hand: -45deg;
}

.clock-smallHand {
  transform: rotateZ(var(--small-hand));
  transition: transform 10s;
}

.clock-largeHand {
  transform: rotateZ(var(--large-hand));
  transition: transform 10s;
}
```

I made two helper functions `hourToDegrees()`{:.js} and `minuteToDegrees()`{:.js} to let myself think in clock positions instead of degrees. These are then used to set a single analog clock with the `setHands()`{:.js} function. The small hand moves clockwise and the large hand counterclockwise for a more interesting animation.

``` js
function setHands(id, hour, minute) {
  const clock = document.querySelector(`.clock--${id}`);
  clock.style.setProperty(`--small-hand`, `${hourToDegrees(hour) + 360}deg`);
  clock.style.setProperty(`--large-hand`, `${minuteToDegrees(minute) - 360}deg`);
}
```

A group of 6 analog clocks makes up a digit. A digit is formed by setting each clock to the clock position needed for this part of the seven-segment display. The following example shows the positions for the digit 2. It has to be read in lines, which means the third and fourth objects represent the center clocks.

``` json
[
    { hour: 3, minute: 15 },
    { hour: 9, minute: 30 },
    { hour: 6, minute: 15 },
    { hour: 0, minute: 45 },
    { hour: 0, minute: 15 },
    { hour: 9, minute: 45 }
]
```

At first I tried to recreate the digits from memory, but I struggled with the digit 8. After watching a lot of promotional videos I discovered how Humans since 1982 solved it. The digit 8 is now my favorite. It may seem weird at first, but the "cyclops" can not be confused with 6 or 9.

![](/images/clock-clock-24-digits.png)

The script then reads the system's time and strips the string to `hh:mm`. If the time plus ten seconds differs from the current state it triggers the animation. The animation itself lasts ten seconds and ends at the system's time.

``` js
let state = '----';
window.setInterval(() => {
  const time = new Date(Date.now() + 10000).toTimeString();
  if (time !== state) {
    setTime(time);
    state = time;
  }
}, 1000);
```

This concludes the Clock Clock 24 single-page application. The Humans since 1982 clocks have way more complex animations, though, which is why I have included two additional animations that can be triggered manually. To see the animations please click the bottom left and bottom right corner in the [CodePen] or press `H` once for happy clock faces and `N` once for neutral clock faces.

<p data-height="720" data-theme-id="0" data-slug-hash="XpQewQ" data-default-tab="result" data-user="Lorti" data-embed-version="2" data-pen-title="Clock Clock 24" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/XpQewQ/">Clock Clock 24</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Clock Clock 24 on a Raspberry Pi with a 3.5″ touchscreen

The initial motivation for this project was that my girlfriend's parents are looking for a new living room clock. As Wolfgang's birthday was nearing, we thought about ways to display the clock on a budget. This is when Daisy brought up the idea of hooking up a Raspberry Pi to a display. At first we thought about a cheap HDMI monitor, but the stumpled upon the <a rel="nofollow" href="https://www.amazon.de/gp/product/B01JRUH0CY/ref=as_li_tl?ie=UTF8&camp=1638&creative=6742&creativeASIN=B01JRUH0CY&linkCode=as2&tag=manuninja-21">Elegoo 3.5″ touchscreen</a> which costs around $ 25. You connect it via the GPIO of the Raspberry Pi, where it also draws its power from.

<img src="http://ir-de.amazon-adsystem.com/e/ir?t=manuninja-21&l=as2&o=3&a=B01JRUH0CY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

![](/images/clock-clock-24-on-a-raspberry-pi-with-a-3-5-inch-touchscreen.jpg)

Unfortunately installation of the drivers was problematic as they weren't compatible with the latest Raspbian release at that time. If you want to save yourself the hassle the producer has uploaded complete [Images] to GitHub.

All that was left was disabling Raspbian's default power saving feature, which turns of the display after a few minutes. Open `/etc/lightdm/lightdm.conf`{:.bash} with an editor and look for the heading `[SeatDefaults]`{:.bash}. It should have a `#xserver-command=X`{:.bash} line, which you have to change to `xserver-command=X -s 0 -dpms`{:.bash}. The last flag disables DPMS (Display Power Management Signaling). After a `sudo reboot`{:.bash} the Raspberry Pi's display stays on and shows the Clock Clock 24.

[CodePen]: http://codepen.io/Lorti/pen/XpQewQ/
[Humans since 1982]: http://www.humanssince1982.com/
[Clock Clock 24]: http://cc24.g01l.eu/
[Images]: https://github.com/goodtft/LCD-show/wiki/Images-Download-address
[MoMA]: https://store.moma.org/museum/moma/ProductDisplay_Clock-Clock-24-_10451_10001_238891_-1_26663_11551

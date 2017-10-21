---
path: /clock-clock-24-on-a-raspberry-pi-using-web-technologies
title: Clock Clock 24 on a Raspberry Pi using Web Technologies
date: 2017-03-22
categories: [art, coding]
thumbnail: /images/clock-clock-24.png
summary: The original Clock Clock 24 is kinetic art by Humans since 1982. Twenty-four analog clocks form a large digital clock. Clever arrangement of the clock hands transforms the analog clocks into seven-segment displays. My girlfriend’s father stumpled upon this clock when looking for a new living room clock. At the time of writing you can buy the clock at $ 5,999.00 in the MoMA store. Thus I took the liberty and created a Clock Clock 24 homage with web technologies. My girlfriend and I then put the clock on a Raspberry Pi.
---

The original Clock Clock 24 is kinetic art by [Humans since 1982]. Twenty-four analog clocks form a large digital clock. Clever arrangement of the clock hands transforms the analog clocks into seven-segment displays. My girlfriend's father stumpled upon this clock when looking for a new living room clock. At the time of writing you can buy the clock at $ 5,999.00 in the [MoMA] store. Thus I took the liberty and created a [Clock Clock 24] homage with web technologies. My girlfriend and I then put the clock on a Raspberry Pi.

<video width="990" height="430" autoplay controls preload="auto" loop>
    <source src="/images/clock-clock-24.mp4" type="video/mp4">
</video>

## Clock Clock 24 with HTML, CSS and JavaScript

The analog clocks are SVGs made up of a clock face and two shapes for the clock hands. The `--small-hand` and `--large-hand` variables drive the `transform`/`transition` animation.

~~~ css
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
~~~

I made two helper functions `hourToDegrees()` and `minuteToDegrees()` to let myself think in clock positions instead of degrees. These are then used to set a single analog clock with the `setHands()` function. The small hand moves clockwise and the large hand counterclockwise for a more interesting animation.

~~~ js
function setHands(id, hour, minute) {
  const clock = document.querySelector(`.clock--${id}`);
  clock.style.setProperty(`--small-hand`, `${hourToDegrees(hour) + 360}deg`);
  clock.style.setProperty(`--large-hand`, `${minuteToDegrees(minute) - 360}deg`);
}
~~~

A digit consists of six analog clocks. Setting each clock to the necessary clock position forms a seven-segment display. The following example shows the positions for the digit `2`. You have to read in lines, which means the third and fourth objects represent the center clocks.

~~~ json
[
    { hour: 3, minute: 15 },
    { hour: 9, minute: 30 },
    { hour: 6, minute: 15 },
    { hour: 0, minute: 45 },
    { hour: 0, minute: 15 },
    { hour: 9, minute: 45 }
]
~~~

At first I tried to recreate the digits from memory, but I struggled with the digit `8`. After watching a lot of promotional videos I discovered how Humans since 1982 solved it. The digit `8` is now my favorite. It may seem weird at first, but you can't confuse the "cyclops" with `6` or `9`.

![](/images/clock-clock-24-digits.png)

The script then reads the system's time and strips the string to `hh:mm`. If the time plus ten seconds differs from the current state it triggers the animation. The animation itself lasts ten seconds and ends at the system's time.

~~~ js
let state = '----';
window.setInterval(() => {
  const time = new Date(Date.now() + 10000).toTimeString();
  if (time !== state) {
    setTime(time);
    state = time;
  }
}, 1000);
~~~

This concludes the [Clock Clock 24] application. View the full source code on [CodePen], if you are interested.

The original clock has more sophisticated animations, though. The owner can choose from three different modes. This is why I have included extra animations that you can trigger manually. Touch the bottom left and bottom right corner or press `H` once for happy clock faces and `N` once for neutral clock faces.

<iframe height='700' scrolling='no' title='Clock Clock 24' src='//codepen.io/Lorti/embed/XpQewQ/?height=700&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/XpQewQ/'>Clock Clock 24</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Clock Clock 24 on a Raspberry Pi with a 3.5″ touchscreen

The motivation for this project was that my girlfriend's parents were looking for a new living room clock. As Wolfgang's birthday was nearing, we thought about ways to display the clock on a budget, as a fun gadget. This is when my girlfriend had the idea of hooking up a Raspberry Pi to a display.

At first we thought about a used HDMI display, but we then found the <a rel="nofollow" href="https://www.amazon.de/gp/product/B01JRUH0CY/ref=as_li_tl?ie=UTF8&camp=1638&creative=6742&creativeASIN=B01JRUH0CY&linkCode=as2&tag=manuninja-21">Elegoo 3.5″ touchscreen</a> which costs around $ 25. You connect it to the GPIO of the Raspberry Pi, where it also draws its power from.

<img src="http://ir-de.amazon-adsystem.com/e/ir?t=manuninja-21&l=as2&o=3&a=B01JRUH0CY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

![](/images/clock-clock-24-on-a-raspberry-pi-with-a-3-5-inch-touchscreen.jpg)

Unfortunately the drivers weren't compatible with the latest Raspbian. Save yourself from installation hassles and use the [Images] the producer has uploaded on GitHub. The touchscreen is also slightly slower than a regular display, resulting in a less smooth animation.

What's left is disabling Raspbian's default power saving feature. It turns the display off after ten minutes. Open `/etc/lightdm/lightdm.conf` with an editor and look for the heading `[SeatDefaults]`. It should have a `#xserver-command=X` line, which you have to change to `xserver-command=X -s 0 -dpms`. The last flag disables DPMS (Display Power Management Signaling). After a `sudo reboot` the Raspberry Pi's display stays on and shows the Clock Clock 24.

My girlfriend then built a cardboard case for the Clock Clock 24 and we gave it as a gift to Wolfgang. The above photographs come from Wolfgang himself, so I guess he was pleased.

If you liked this article, please consider [sharing] it with your followers. And if you do have the money, why not get the $ 5,999.00 clock? It's made in Sweden of Corian, steel and electric components. Badass, huh?

[CodePen]: http://codepen.io/Lorti/pen/XpQewQ/
[Humans since 1982]: http://www.humanssince1982.com/
[Clock Clock 24]: http://cc24.g01l.eu/
[Images]: https://github.com/goodtft/LCD-show/wiki/Images-Download-address
[MoMA]: https://store.moma.org/museum/moma/ProductDisplay_Clock-Clock-24-_10451_10001_238891_-1_26663_11551
[sharing]: https://twitter.com/intent/tweet?original_referer=https://manu.ninja/clock-clock-24-on-a-raspberry-pi&text=Clock%20Clock%2024%20on%20a%20Raspberry%20Pi%20using%20Web%20Technologies&tw_p=tweetbutton&url=https://manu.ninja/clock-clock-24-on-a-raspberry-pi-using-web-technologies&via=manuelwieser

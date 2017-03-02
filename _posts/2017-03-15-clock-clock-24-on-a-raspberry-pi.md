---
layout: post
title:  Clock Clock 24 on a Raspberry Pi
date:   2017-03-15
categories: [coding, art]
thumbnail: /images/clock-clock-24-raspberry-pi.jpg
sharing: true
---

<p data-height="720" data-theme-id="0" data-slug-hash="XpQewQ" data-default-tab="result" data-user="Lorti" data-embed-version="2" data-pen-title="Clock Clock 24" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/XpQewQ/">Clock Clock 24</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<a rel="nofollow" href="https://www.amazon.de/gp/product/B01JRUH0CY/ref=as_li_tl?ie=UTF8&camp=1638&creative=6742&creativeASIN=B01JRUH0CY&linkCode=as2&tag=manuninja-21">Elegoo 3.5″ Touch Screen Monitor</a>
<img src="http://ir-de.amazon-adsystem.com/e/ir?t=manuninja-21&l=as2&o=3&a=B01JRUH0CY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

DPMS (Display Power Management Signaling)

`/etc/lightdm/lightdm.conf`

`[SeatDefaults]`

`#xserver-command=X`

`xserver-command=X -s 0 -dpms`

`sudo reboot`

[CodePen]: http://codepen.io/Lorti/pen/XpQewQ/
[Humans since 1982]: http://www.humanssince1982.com/
[Clock Clock 24]: http://cc24.g01l.eu/
[Images]: https://github.com/goodtft/LCD-show/wiki/Images-Download-address

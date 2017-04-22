---
layout: post
title:  Web Push Notifications
date:   2017-04-25
categories: coding
thumbnail: /images/web-push-notifications.png
sharing: true
---

Engage and Retain Users with Push Notifications on the Web. It has become far easier for you in 2017. This tutorial shows you a complete working example to get you started. The final code is on [GitHub] and there's also a [video] demonstrating how you can send push notifications in under a minute.



## What's new?

Sendind push notifications was difficult in the past because you need a variety of new web technologies. It took some time before support for [Service Workers][Service Worker Support], [Notifications][Notifications API Support] and [Push][Push API Support], Google's and Mozilla's push messaging services and the urge to change to HTTPS was at a point where you can deliver push notifications to a significant amount of your users, not only a fraction.

In the process of standardizing web push notifications implementations have changed over the years. In the past you had to write very different code for each platform to enable push notifications. There have been steps in the right direction to make development more pleasant. The most important news are the following:

* [RFC 8030] – Generic Event Delivery Using HTTP Push
* You can use the same code for Chrome and Firefox since mid 2016.
* You no longer need a Firebase project, a `gcm_sender_id`, or an `Authorization` header. You no longer need a `manifest.json`.
* Microsoft is co-authoring the RFC, so they will follow the standard.



## Technological Overview

How do push notifications on the open web work?

![](/images/web-push-notifications-technological-overview.gif)

## Demonstration

Clone the code on [GitHub] and follow the instructions in the [video] below or do the following:

1. `npm install`
1. `npm start`
1. Enable push notifications and copy the subscription object that appears.
1. Update the subscription object in `server.js` file with your own subscription object.
5. Run `node server.js` to send a push notification.

<video id="video" width="1280" height="720" autoplay controls preload="auto" loop>
    <source src="/images/web-push-notifications.mp4" type="video/mp4">
</video>



## Explanation

What is happening?

`applicationServerKey`
[Web Push] `webpush.generateVAPIDKeys()`

Service Worker 
`navigator.serviceWorker.register()`

Subscription 
`serviceWorkerRegistration.pushManager.subscribe()`

Subscription Object 
`subscription.toJSON()`

Push Message
`webpush.sendNotification()`







## Browser Support

### Technologies

|---
|| Chrome | Firefox | Edge | Safari
|-|:-:|:-:|:-:|:-:
| [Service Worker] |  | ✅ | 🔜 | ❌
| [Push API] | ✅ | ✅ | 🔜 | ❌
| [Notifications API] | ✅ | ✅ | ✅ | ✅
| [Web Push Protocol] | ✅ | ✅ | ✅ | ❌

[Platform Status Service Worker]

[Platform Status Push API]

### Operating Systems

Chrome
: Windows, macOS, Linux and Android

Firefox
: Windows, macOS, Linux and Android

Edge
: Windows, Windows Mobile

Safari
: macOS via Apple’s non-standard implementation, iOS not supported






## Conclusion

Get the code at [GitHub] and poke around to understand what is happening. The [push.js](https://github.com/Lorti/web-push-notifications/blob/master/src/push.js) module is written in an events format so you might want to use it right away in your application with a few modifications. If you do so please mention me, leave a star on GitHub or tell your followers. 

![](/images/web-push-notifications.png)

If you want to go deeper into push notifications read the [Web Fundamentals](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/) section on web push notifications by Joseph Medley. The [Slides] for my talk at Stahlstadt.js on March 27, 2017 are also online. 





[RFC 8030]: https://tools.ietf.org/html/rfc8030
[Web Push Protocol]: https://tools.ietf.org/html/rfc8030

[GitHub]: https://github.com/Lorti/web-push-notifications
[Slides]: https://speakerdeck.com/lorti/web-push-notifications
[video]: #video

[Service Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API 
[Service Worker Support]: http://caniuse.com/#feat=serviceworkers
[Platform Status Service Worker]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/?q=Service%20Worker

[Push API]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
[Push API Support]: http://caniuse.com/#feat=push-api
[Platform Status Push API]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/?q=Push%20API

[Notifications API]: https://developer.mozilla.org/de/docs/Web/API/Notifications_API
[Notifications API Support]: http://caniuse.com/#feat=notifications

[Web Push]: https://github.com/web-push-libs/web-push

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

1. A device downloads your web app containing an already created public key, referred to in scripts as the `applicationServerKey`. Your web app installs a service worker.
1. During the subscription flow the browser contacts the messaging server to create a new subscription and returns it to the app. You don't need to know the URL of the message server. Each browser vendor manages it's own message server for its browser.
1. After the subscription flow, your app passes a subscription object back to your app server.
1. At some later point, your app server sends a message to the messaging server.
1. The messaging server forwards your message to the recipient.



## Demonstration

Clone the code on [GitHub] and follow the instructions in the [video] below or do the following:

1. `npm install`
1. `npm start`
1. Enable push notifications and copy the subscription object that appears.
1. Update the subscription object in `server.js` file with your own subscription object.
1. Run `node server.js` to send a push notification.

<video id="video" width="1280" height="720" controls>
    <source src="/images/web-push-notifications.mp4" type="video/mp4">
</video>



## Explanation

What is happening?

The `applicationServerKey` is part of the Voluntary Application Server Identification for Web Push ([VAPID]) specification. It let's the push service identify your application server. The easiest way to create this public/private key pair is to use a library like [Web Push]. Its `webpush.generateVAPIDKeys()` function returns an object with a `publicKey` and a `privateKey` property. If you want to create your keys simply uncomment the four lines at the top of [server.js](https://github.com/Lorti/web-push-notifications/blob/master/server.js#L3) in my example.



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

Microsoft [Platform Status Service Worker] [Platform Status Push API]

|| Chrome | Firefox | Edge | Safari
|-|:-:|:-:|:-:|:-:
| [Service Worker] | ✅ | ✅ | 🔜 | ❌
| [Push API] | ✅ | ✅ | 🔜 | ❌
| [Notifications API] | ✅ | ✅ | ✅ | ✅
| [Web Push Protocol] | ✅ | ✅ | ✅ | ❌



### Operating Systems

still iOS not supported

<table>
    <tr>
        <th>Chrome</th>
        <td>Windows, macOS, Linux and Android</td>
    </tr>
    <tr>
        <th>Firefox</th>
        <td>Windows, macOS, Linux and Android</td>
    </tr>
    <tr>
        <th>Edge</th>
        <td>Windows, Windows Mobile</td>
    </tr>
    <tr>
        <th>Safari</th>
        <td>macOS (via Apple’s non-standard implementation)</td>
    </tr>
</table>



## Conclusion

Get the code at [GitHub] and poke around to understand what is happening. The [push.js](https://github.com/Lorti/web-push-notifications/blob/master/src/push.js) module is written in an events format so you might want to use it right away in your application with a few modifications. If you do so please mention me, leave a star on GitHub or tell your followers. 

![](/images/web-push-notifications.png)

If you want to go deeper into push notifications read the [Web Fundamentals](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/) section on web push notifications by Joseph Medley. The [Slides] for my talk at Stahlstadt.js on March 27, 2017 are also online. 



[RFC 8030]: https://tools.ietf.org/html/rfc8030
[Web Push Protocol]: https://tools.ietf.org/html/rfc8030
[VAPID]: https://tools.ietf.org/html/draft-ietf-webpush-vapid

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

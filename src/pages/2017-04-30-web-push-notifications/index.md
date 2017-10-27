---
path: /web-push-notifications
title: Web Push Notifications
date: 2017-04-30
categories: [coding]
tags: [business, conversion, meetups, slides]
thumbnail: /images/web-push-notifications.png
sharing: true
summary: Developers use push notifications to engage and retain users. Unfortunately, sending push notifications on the open web was difficult in the past. It has become simpler in 2017. This tutorial shows you a complete working example to get you started. The final code is on GitHub and you'll find a video demonstrating how you can send your first push notification.
---

Developers use push notifications to engage and retain users. Unfortunately, sending push notifications on the open web was difficult in the past. It has become simpler in 2017. This tutorial shows you a complete working example to get you started. The final code is on [GitHub] and you'll find a [video] demonstrating how you can send your first push notification.



## What's new?

Sending push notifications is complicated because there's a variety of modern web technologies involved. It took time before support for [Service Workers][Service Worker Support], the [Notification][Notifications API Support] and [Push][Push API Support] APIs, Google's and Mozilla's push messaging services, as well as the appeal of switching to HTTPS were at a point where you can deliver push notifications to a significant amount of your users, not only a fraction.

In the process of standardization implementations have changed over the years. Until recently you had to write very different code for each platform to enable push notifications. Luckily, there have been steps in the right direction to make development more pleasant. The most important news are the following:

* [RFC 8030] – Generic Event Delivery Using HTTP Push
* You can use the same code for Chrome and Firefox since mid 2016.
* You no longer need a Firebase project, a `gcm_sender_id` , or an `Authorization`  header. You no longer need a `manifest.json`, except for building a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/).
* Microsoft is co-authoring the RFC, so they will follow the standard.



## Technological Overview

How do push notifications work on the open web?

![](/images/web-push-notifications-technological-overview.gif)

1. The user downloads your app containing a public key, called the `applicationServerKey`. Your app installs a service worker in the user's browser.
1. During the subscription flow the browser requests a subscription from the messaging server. Each browser vendor has it's own messaging server, but your browser knows which server to call.
1. Your app sends the subscription object to your server.
1. Your server sends a push notification to the messaging service.
1. The messaging service forwards your push notification to the recipient.



## Demonstration

Now that you've seen the flow please clone or download the code from [GitHub]. Then follow the steps below, which you can also watch in the [video].

1. `npm install`
1. `npm start`
1. Enable push notifications and copy the subscription object that appears.
1. Update the subscription object in the `server.js` file with your own subscription object.
1. Run `node server.js` to send a push notification.

<video id="video" width="1280" height="720" autoplay controls loop>
    <source src="/images/web-push-notifications.mp4" type="video/mp4">
</video>



## Explanation

What is happening? I will explain the most important parts, without error handling or feature detection. The full code is production-ready, though, if you add the missing parts that depend on your stack.

### Voluntary Application Server Identification for Web Push

The `applicationServerKey` is part of the Voluntary Application Server Identification for Web Push ([VAPID]) specification. It let's the push service identify your application server. The easiest way to create this public and private pair of keys is to use a library like [Web Push]. Its `webpush.generateVAPIDKeys()` function returns an object with a `publicKey` and a `privateKey` property. If you want to create your keys simply uncomment the four lines at the top of [server.js](https://github.com/Lorti/web-push-notifications/blob/master/server.js#L3), which you've just checked out.

~~~ js
const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();
console.log(vapidKeys.publicKey);
console.log(vapidKeys.privateKey);
process.exit();
~~~

The following code snippets are from the `push.js` module and run on the client.

### Service Worker

The second step is to install a service worker with `navigator.serviceWorker.register()`. This only works if your site is served on `localhost` or has a valid SSL certificate. For testing you can get around the HTTPS restriction by checking the _Enable Service Workers over HTTP (when toolbox is open)_ option in the Firefox developer tools. You can also start Chrome via command line and use the `--unsafely-treat-insecure-origin-as-secure` flag.

~~~ js
navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        init();
    });
~~~

~~~ js
function init() {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.pushManager.getSubscription()
            .then((subscription) => {
                // Do we already have a push message subscription?
                if (subscription) {
                    sendSubscriptionToServer(subscription);
                }
            });
    });
};
~~~

### Subscribing to the Push Messaging Service

You should of course ask the user's permission for showing notifications on your page. This is handled in more detail in the actual code. The following example gives you an idea by handling the `'granted'` result.

If the service worker registration is successful you can access its `pushManager` object. `serviceWorkerRegistration.pushManager.subscribe()` returns a promise with a valid subscription if successful. You don't have to care about the messaging service itself. Chrome will return a subscription with a Google endpoint wheres Firefox will return a subscription with a Mozilla endpoint. This is the beauty of a standards-based approach.

~~~ js
function subscribe() {
    Notification.requestPermission().then((result) => {
        if (result === 'granted') {
            const options = {
                userVisibleOnly: true,
                applicationServerKey: buildApplicationServerKey(),
            };
            navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
                serviceWorkerRegistration.pushManager.subscribe(options)
                    .then((subscription) => {
                        sendSubscriptionToServer(subscription);
                    });
            });

        }
    }):
}
~~~

Depending on how you've generated your `applicationServerKey` you might need to convert it from one Base64 variant to another. The variants differ in the last two characters and the padding character. `buildApplicationServerKey()` converts characters 62 and 63 from the `-_` pair to the `+/` pair.

~~~ js
function buildApplicationServerKey() {
    const base64 = 'BE8PyI95I_jBIfb_LTS_nkUJnOwjLP2zAaGBSFEi3jmFJ3l5ox7-NtNqrVuyPL4Qmt4UxDI-YgwYI1sEMIpoU90=';
    const rfc4648 = base64.replace(/-/g, '+').replace(/_/g, '/');
    const characters = atob(rfc4648).split('').map(character => character.charCodeAt(0));
    return new Uint8Array(characters);
}
~~~

### Saving the Subscription Object

The `sendSubscriptionToServer()` function is a stub that you have to implement depending on your server. You can call `subscription.toJSON()` on the subscription object to retrieve the endpoint and keys as strings. Save the subscription object to your database to send the user notifications later on. The example outputs the JSON to the page itself, so you can copy it to `server.js`.

~~~ js
function sendSubscriptionToServer(subscription) {
    console.log(JSON.stringify(subscription.toJSON()));
}
~~~

### Sending the Push Notification

If you open `server.js`, you will find few lines of code, thanks to the [Web Push] library. You have to get a user's subscription object and call `webpush.sendNotification()`. This sends the notification to the messaging service, which itself queues it and tries to send it as soon as possible. For this to work your service worker has to be up and running.

Why use a library? Otherwise, you would have to create the Authorization (JWT), Crypto-Key and TTL headers yourself, as well as encrypt your payload. There is a link at the end of the article, if you are interested in the details.

~~~ js
const webpush = require('web-push');
const subscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/...',
    keys: {
        p256dh: 'BHfHzdoRRiN7ZXvjzckj23Uk...',
        auth: 'N9iezp-o35cV-8-FiyDjnQ==',
    },
};
const notification = JSON.stringify({
    title: 'manu.ninja',
    body: 'I’ve just published “Web Push Notifications”.',
};
webpush.sendNotification(subscription, notification);
~~~

### Receiving the Push Notification

The service worker listens for various events from the push messaging service. The `push` event may have data attached. You can use the data to specify your notifications. The payload of your message has to be relatively small, though. If you need to send more data you can send what's called a "tickle": You use the push message as a signal to fetch data from your server in the service worker.

The payload has to be encrypted, which is good for privacy, but difficult to implement. Which again brings us to the benefits of using a library.

~~~ js
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title;
    const options = {
        body: data.body,
        icon: 'https://pbs.twimg.com/profile_images/717346718870859776/vsyH7GEi.jpg',
    };
    event.waitUntil(
        self.registration.showNotification(title, options),
    );
});
~~~

Et voilà!



## Browser Support

### Technologies

You can use the example code for Chrome and Firefox right away. The good news is, Edge is catching up quickly. You can check the platform status for [Service Workers][Platform Status Service Worker] and the [Push API][Platform Status Push API] for updates. Safari is missing all of the technologies necessary, except for the Notifications API.

|| Chrome | Firefox | Edge | Safari
|-|:-:|:-:|:-:|:-:
| [Service Worker] | ✅ | ✅ | 🔜 | ❌
| [Push API] | ✅ | ✅ | 🔜 | ❌
| [Notifications API] | ✅ | ✅ | ✅ | ✅
| [Web Push Protocol] | ✅ | ✅ | ✅ | ❌

### Operating Systems

Google and Mozilla support web push notifications on all of their platforms. Microsoft will probably also support web push notifications on Windows Mobile, but at a market share of 1% it won't be your highest priority. Sadly, Apple's not shown interest in the standard. Safari Push Notifications are available since Mavericks (OS X 10.9), but Apple uses a non-standard implementation and doesn't allow them on iOS. If you want to support Safari, you will have to follow the [Safari Push Notifications] guide.

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

Get the code at [GitHub] and poke around to understand what's happening. The code is production-ready, if you add the missing parts that depend on your stack. The [push.js](https://github.com/Lorti/web-push-notifications/blob/master/src/push.js) module is written using events so you can plug it right into in your application with a few modifications. If you do so please mention me, leave a star on GitHub or tell your followers.

![](/images/web-push-notifications.png)

If you want to dive deeper into push notifications, read the [Web Fundamentals](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/) section on web push notifications by Joseph Medley. The [Slides] for my talk at Stahlstadt.js on March 27, 2017 are also online.



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

[Safari Push Notifications]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html

[Web Push]: https://github.com/web-push-libs/web-push

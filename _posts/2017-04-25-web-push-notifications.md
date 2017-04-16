---
layout: post
title:  Web Push Notifications
date:   2017-04-25
categories: coding
thumbnail: /images/web-push-notifications.png
sharing: true
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

## What's new?

* [RFC 8030] – Generic Event Delivery Using HTTP Push
* You can use the same code for Chrome and Firefox since mid 2016.
* You no longer need a Firebase project, a `gcm_sender_id`, or an `Authorization` header. You no longer need a `manifest.json`.
* Microsoft is co-authoring the RFC, so they will follow the standard.

## Technological Overview

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

![](/images/web-push-notifications-technological-overview.gif)

## Demonstration

* `applicationServerKey`
* Service Worker 
* Subscription 
* Subscription Object 
* Push Message

* webpush.generateVAPIDKeys()
* navigator.serviceWorker.register()
* serviceWorkerRegistration.pushManager.subscribe()
* subscription.toJSON()
* webpush.sendNotification()

[Web Push]

[GitHub]

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

## Browser Support

### Technologies

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

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

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

Chrome
: Windows, macOS, Linux and Android

Firefox
: Windows, macOS, Linux and Android

Edge
: Windows, Windows Mobile

Safari
: macOS via Apple’s non-standard implementation, iOS not supported

## Conclusion

[GitHub]

[Slides]

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur ducimus et molestiae nisi quos sint? Accusantium blanditiis consequuntur delectus dignissimos doloribus, ducimus ea exercitationem fuga hic illum in inventore ipsa ipsum minima molestias nihil nulla officia quaerat repudiandae saepe unde, veritatis voluptas voluptatem? Ducimus ea illo illum quia vel.

![](/images/web-push-notifications.png)



[RFC 8030]: https://tools.ietf.org/html/rfc8030

[GitHub]: https://github.com/Lorti/web-push-notifications
[Slides]: https://speakerdeck.com/lorti/web-push-notifications

[Platform Status Service Worker]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/?q=Service%20Worker
[Platform Status Push API]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/?q=Push%20API

[Service Worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API 
[Push API]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
[Notifications API]: https://developer.mozilla.org/de/docs/Web/API/Notifications_API
[Web Push Protocol]: https://tools.ietf.org/html/rfc8030

[Web Push]: https://github.com/web-push-libs/web-push

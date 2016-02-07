---
layout: post
title:  Notes from Topconf Linz 2016
date:   2016-02-09
categories: coding
---

[Topconf Linz 2016](http://topconf.com/linz-2016/) was a a great conference with charming people and inspiring talks. I am looking forward to next year and hope events like this will help put Linz on the map and attract more international attendees and speakers. Here are my notes from the talks that I have seen.



## Carving up stuff for fun and profit -- Stefan Tilkov

[Slides](https://speakerdeck.com/stilkov/carvin-up-stuff-for-fun-and-profit)

* People structure their code into smaller building blocks. (Micro-)services, components, modules, procedures...

* The blocks have in common that they exist within an environment, have boundaries and dependencies, an implementation and an interface.

* "How big shall each individual piece be?" -- "Just make things the right size."

* The same programming task can be solved with several pages of code or just a few lines.

* David Parnas proposes that "one begins [to decompose a system] with a list of difficult design decisions or design decisions that are likely to change. Each module is then designed to hide such a decision from the others."

* _Separation of Concerns_ and the _Single Responsibility Principle_ tell us to "separate separate things" and "join things that belong together."

* Bob Martin says a module "should only have one reason to change," while at the same time "an axis of change is only an axis of change if the changes actually occur."

* Indicators of strong cohesion are simplicity, a single stakeholder, only one reason to change and that the module doesn't get split but used as a whole.

* Indicators of weak cohesion are that the code is hard to understand and difficult to explain, obviously divisible, has many stakeholders, many reasons to change and is often used only partially.

* Isolated development teams are not a good reason for separation.

* Do not forget about the application environment when designing your building blocks.

* _What works:_ Being explicit about your meta-model. _What doesn't:_ Mentioning the word "meta-model".

* _What works:_ Separating macro and micro decisions. _What doesn't:_ Over-regulating everything.

* _What works:_ Trusting your gut and making a good guess. _What doesn't:_ Fleeing into technicalities.

* _What works:_ Use organization and its use cases as level 0 driver. _What doesn't:_ Center around technical commonality.

* _What works:_ Prepare to be wrong on every level. _What doesn't:_ Aim for perfection and stubbornly stick to it.



## The web is getting pushy -- Phil Nash

[Slides](https://speakerdeck.com/philnash/the-web-is-getting-pushy-topconf-linz)

* The browsers have implemented technologies that already work (as in "Does this make sense?") for native apps, like geolocation, accelerometer or peer-to-peer video chat.

* You may look at native apps as a testing ground for future web technologies, if you want.

* One major advantage of native apps are currently push notifications.

* Notifications are supported by major browsers. The status for Edge is "Under Consideration".

* Service Workers are only supported in the latest Chrome, Firefox and Opera. The status for Safari is unknown. The status for Edge is "Under Consideration".

* Push Notifications are only supported in the latest Chrome and Firefox. The Safari implementation is non-standard, Opera has it "on the roadmap" and Edge has it "Under Consideration".

* Implementation status can be checked on [jakearchibald.github.io/isserviceworkerready](https://jakearchibald.github.io/isserviceworkerready/) and [status.modern.ie](https://dev.windows.com/en-us/microsoft-edge/platform/status/).

* Demo is listening for the `#topconfpush` hashtag and then pushing a notification.

* Code for the live demo is available on [github.com/philnash/the-web-is-getting-pushy](https://github.com/philnash/the-web-is-getting-pushy).

* It is possible to push notifications to your users via your web app, but try to follow the lessons learned in native apps over the last few years and don't overdo it.

* There is now a nice tutorial over at [Google Developers](https://developers.google.com/web/fundamentals/getting-started/push-notifications).



## Punishment Driven Development -- Louise Elliot

[Slides](http://de.slideshare.net/IvanaTerrorBull/punishment-driven-development)

When things go wrong the first thing we do is find who is to blame and the second thing is to punish them. This talk deives into why humans have this tendency to blame and punish. It looks at real examples of punishment within the software world and the results which were achieved. These stories not only cover managers punishing team members but also punishment within teams and self-punishment. We are all guilty of some of the behaviours discussed.

This is aimed at everyone involved in software development. After the talk attendees will understand:

- Why we tend to blame and punish others.
- The impact of self-blame.
- The unintended (but predictable) results from punishment.
- The alternatives to punishment, which get real results.



## There is no half-remote team -- Markus Tacker

[Slides](https://docs.google.com/presentation/d/1wOsTthhK1rgmSYl6ZChHzSTD3hkMjmlkfZKnlgQtU94)

Having remotes on the team enables you to hire for talent and not for availability. From my recent positions I learned that it is critical to encode remote work in every team members work habits-even if they are working on location. In this talk I would like to show you how I've set up my teams in the past and what I did to integrate remotes in our physical office (yes, we still have one).



## JSON-API -- The ultimate anti-bikeshedding weapon -- Henning Glatter-Götz

[Slides](https://speakerdeck.com/hglattergotz/how-json-api-can-bring-sanity-to-your-php-apis)

APIs are everywhere: many return JSON and are RESTful or even provide hypermedia controls, but chances are they do not adhere to any standard. Essentially they all speak a different language that has to be learned for each specific provider. Wouldn’t it be great if there was a sane specification that lets you standardize your API? Something around which the community can build tools so you don’t have to reinvent the wheel over and over again? In this talk I will introduce the JSON-API specification and explain how it can benefit you on your next API project.



## Show me your office and I'll tell you how productive you are! -- Thomas Turner

http://ideenbewegen.at/

Different kinds of work need different environment. This seems to be logical, though many companies miss to support their employees with an optimized, supporting office-concept.

Due to studies 50-90% of employees are dissatisfied with their personell job-situation. Key-factors are bad work-climate, low efficiency, slow communication, high stress-level and low comfort factor.

Why and how should CEOs and managers think about their work-culture and office-structure? Why will innovation be supported by new and different rooms? This firsthand report of a reference project, the middle- and long-term conclusions will answer these and many more questions and will give you a lot to think.



## HTTP/2: Current Status -- Simone Bordet

[Video](https://www.youtube.com/watch?v=QpLtBftqM04)

HTTP 2.0 is supposed to be the next big thing for the web, after the overwhelming success of HTTP 1.1. In this keynote we will examine the HTTP 2.0 protocol, what is the status of its specification, what features does it offer over HTTP 1.1, and how websites can benefit (in speed and money) from it. Finally, we will explore the status of HTTP 2.0 support in the Java platform, finishing up with a demo of new HTTP 2.0 features.



## CSS for Software Engineers for CSS Developers -- Harry Roberts

[Slides](https://speakerdeck.com/csswizardry/css-for-software-engineers-for-css-developers)

Depending on where you draw your measurements from, the first programming languages for use on ‘modern’ electric computers were designed in the ’40s and ’50s. CSS, on the other hand, is a mere adolescent—born in 1996, it’s just 18 years old. This means that software engineers have had over four decades’ head start on us: we should be listening to a lot more of what they have to say.

In this talk, we’ll take a look at some very traditional computer science and software engineering paradigms and how we can steal, bend, borrow, and reimplement them when writing our CSS. Writing CSS like software engineers so that we can become better CSS developers.



## We're going in: The 3D web -- Martin Naumann

[Slides](https://docs.google.com/presentation/d/1-v4bmNMN4jum0K5GtJRyldP4U9VZVrDH5BgU6ZW8g3I/)

The modern web is tearing down the borders of the browser window and allows us to create so much more than just another website.
This talk is a whirlwind tour of how 3D and virtual reality can be woven into entirely new applications that the web hasn’t seen yet. On top of interactive 3D web applications with WebGL we’ll go through the history of 3D on the web.
In addition we’ll see how we can unlock the powers of the GPU thanks to GLSL.

We will then explore the amazing superpowers that Virtual Reality is currently bringing to the web and teleport us to places we can’t go.

This talk is accompanied by use case demonstrations along with a bit of live coding as the "frosting" on top.



## Your Web Stack Would Betray You In An Instant -- Tim Perry

[Video](https://www.youtube.com/watch?v=CDX_oVahNV0)

Securely setting up a web stack today is a tricky balancing act, as you gingerly balance frameworks and services and tools all atop one another, ever higher, to get all mod cons happily running together safely and correctly. One security flaw though, and the whole pile tumbles down on you to throw your customer passwords to the world.

In this talk we take a stroll down through a modern web stack and examine some recent major security breakages in each layer to see how they work and why. With any luck we can work out how to avoid this sort of thing in future too, when either using or building such tools, but if all else fails we can at least relax from all the careful balancing with a little schadenfreude.



## An Abusive Relationship with AngularJS -- Mario Heiderich

[Slides](http://de.slideshare.net/x00mario/an-abusive-relationship-with-angularjs)

Some voices claim that "Angular is what HTML would have been if it had been designed for building web applications". While this statement may or may not be true, is certainly accounts as one of the bolder ones a JavaScript web framework can ever issue. And where boldness is glistening like a German Bratwurst sausage in the evening sun, a critical review from a grumpy old security person shouldn’t be too far away.

This talk will have a stern, very stern look at AngularJS in particular and shed light on the security aspects of this ever-popular tool. Did the super-hero framework do everything right and follow its own super-heroic principles? Does AngularJS increase or rather decrease the attack surface of a web application? How does AngularJS play along with the Content Security Policy, and was it a good idea to combine this kind of security with futuristic feature creep? And what about AngularJS version 2.0?

Beware that we won’t stop at glancing at the code itself, investigating security best practices, and verifying compatibility and other common things that contribute to robust security (or lack thereof). We will cross the moral border and see if the AngularJS team could notice rogue bug tickets. A pivotal question that everyone is wondering about is: Have they successfully kept evil minds like yours truly speaker here from introducing new security bugs into the code base?

This talk is a reckoning with a modern JavaScript framework that promises a lot and keeps even more, not necessarily for the best for developers and users. We will conclude in deriving a general lesson learnt and hopefully agree that progress doesn't invariably mean an enhancement.

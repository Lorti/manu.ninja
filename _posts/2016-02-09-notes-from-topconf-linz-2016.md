---
layout: post
title:  Notes from Topconf Linz 2016
date:   2016-02-09
categories: coding
summary: Topconf Linz 2016 was a a great conference with charming people and inspiring talks. I am looking forward to next year and hope events like this will help put Linz on the map and attract more international attendees and speakers. Here are my notes from the talks that I have seen.
---

[Topconf Linz 2016](http://topconf.com/linz-2016/) was a a great conference with charming people and inspiring talks. I am looking forward to next year and hope events like this will help put Linz on the map and attract more international attendees and speakers. Here are my notes from the talks that I have seen.



## Carving up stuff for fun and profit -- Stefan Tilkov

[Slides](https://speakerdeck.com/stilkov/carvin-up-stuff-for-fun-and-profit)

* People structure their code into smaller building blocks. (Micro-)services, components, modules, procedures…

* "How big shall each individual piece be?" -- "Just make things the right size."

* The same programming task can be solved with several pages of code or just a few lines.

* _David Parnas_ proposes that "one begins [to decompose a system] with a list of difficult design decisions or design decisions that are likely to change. Each module is then designed to hide such a decision from the others."

* _Separation of Concerns_ and the _Single Responsibility Principle_ tell us to "separate separate things" and "join things that belong together."

* _Robert Martin_ says a module "should only have one reason to change," while at the same time "an axis of change is only an axis of change if the changes actually occur."

* Indicators of strong cohesion are _simplicity,_ _a single stakeholder,_ _one reason to change_ and that the module doesn't get split but _used as a whole._

* Indicators of weak cohesion are that the code is _hard to understand_ and _difficult to explain,_ _obviously divisible,_ has _many stakeholders,_ _many reasons to change_ and is often _used only partially._

* Isolated development teams are not a good reason for separation.

* Try not to forget about the application environment when designing your building blocks.

* _What works:_ Being explicit about your meta-model. _What doesn't:_ Mentioning the word "meta-model".

* _What works:_ Separating macro and micro decisions. _What doesn't:_ Over-regulating everything.

* _What works:_ Trusting your gut and making a good guess. _What doesn't:_ Fleeing into technicalities.

* _What works:_ Use organization and its use cases as level 0 driver. _What doesn't:_ Center around technical commonality.

* _What works:_ Prepare to be wrong on every level. _What doesn't:_ Aim for perfection and stubbornly stick to it.



## The web is getting pushy -- Phil Nash

[Slides](https://speakerdeck.com/philnash/the-web-is-getting-pushy-topconf-linz)

* Browser vendors have implemented technologies that already work (as in "Does this make sense?") for native apps. If you want, you may look at native apps as a testing ground for future web technologies.

* Browser Support

    * _Notifications_ are supported by major browsers. The status for Edge is "Under Consideration".

    * _Service Workers_ are only supported in the latest Chrome, Firefox and Opera. The status for Safari is unknown. The status for Edge is "Under Consideration".

    * _Push Notifications_ are only supported in the latest Chrome and Firefox. The Safari implementation is non-standard, Opera has it "on the roadmap" and Edge has it "Under Consideration".

    * Implementation status can be checked on [jakearchibald.github.io/isserviceworkerready](https://jakearchibald.github.io/isserviceworkerready/) and [status.modern.ie](https://dev.windows.com/en-us/microsoft-edge/platform/status/).

* Demo is listening for the `#topconfpush` hashtag and then pushing a notification. The code is available on [github.com/philnash/the-web-is-getting-pushy](https://github.com/philnash/the-web-is-getting-pushy).

* It is possible to push notifications to your users via your web app, but try to follow the lessons learned over the last few years.

* There is now a nice tutorial over at [Google Developers](https://developers.google.com/web/fundamentals/getting-started/push-notifications).



## Punishment Driven Development -- Louise Elliot

[Slides](http://de.slideshare.net/IvanaTerrorBull/punishment-driven-development)

* _Bonuses_ are a punishment tool and may weaken the performance of your team.

* _Narcissim of small differences:_ The odd man out may be invaluable to your success with his differing views.

* _Hansei:_ Acknowledge your mistakes and learn from them.

* _Kaizen:_ It is often easier to change yourself than to change others.

* There is an area in your brain responsible for blame and punishment, called the [dorsolateral prefrontal cortex](http://dx.doi.org/10.1016/j.neuron.2015.08.023).

* Punishment Driven Development Manifesto

    * Finding out who is to blame _over working collaboratively_

    * Retribution _over improving the process_

    * Punishing mistakes _over avoiding future mistakes_

    * Venting emotions _over achieving goals_

* People Driven Development Manifesto

    * Respecting people _over controlling people_

    * Celebrating mistakes _over punishing mistakes_

    * Putting yourself in their place _over putting others in their place_

    * Changing your behaviour _over changing another's behaviour_



## There is no half-remote team -- Markus Tacker

[Slides](https://docs.google.com/presentation/d/1wOsTthhK1rgmSYl6ZChHzSTD3hkMjmlkfZKnlgQtU94)

* The three most important challenges when working with a distributed team are the [missing watercooler](https://blog.cto.hiv/working-remote-fix-the-missing-watercooler), [quality time](https://blog.cto.hiv/working-remote-quality-together-time) and [celebrating successes](https://blog.cto.hiv/working-remote-celebrate-successes).

* _ProTips:_ Always have a communication fallback ready, define a communication escalation process, everybody should work remotely (at least some days a week), plan every hour when meeting in person and send everyone a cake once in a while.

* There is a [Developer Happiness Questionnaire](https://blog.cto.hiv/developer-happiness-questionnaire) based on the book [First, Break All The Rules](http://www.gallup.com/press/176069/first-break-rules-world-greatest-managers-differently.aspx) that helps you collect feedback from your colleagues.


## JSON API -- The ultimate anti-bikeshedding weapon -- Henning Glatter&#8209;Götz

[Slides](https://speakerdeck.com/hglattergotz/how-json-api-can-bring-sanity-to-your-php-apis)

* [JSON API](http://jsonapi.org/) is a specification for building APIs in JSON.

* `Content-Type: application/vnd.api+json` is registered with the IANA.

* It specifies _content negotiation,_ _document structure,_ _fetching data_ (including pagination), _CRUD,_ _query parameters_ and _errors._

* Standardization tremendously helps with tooling. Libraries for the most popular languages already exist.



## HTTP/2: Current Status -- Simone Bordet

[Slides](http://de.slideshare.net/SimoneBordet/http2-and-java-current-status)

* _Why?_ HTTP/1.1 is an inefficient, old protocol for serving single pages. Web developers are hacking around its limitations and browser vendors break recommendations to make their browsers fast. "Better HTTP means more money!"

* _How?_ HTTP/2 is a binary protocol based on frames. It offers multiplexed streams, compressed headers, request prioritization and pushing of correlated resources to reduce round-trips. TLS is mandatory for browsers but server-to-server communication may be unencrypted.

* _When?_ The protocol is specified in [RFC 7540](https://tools.ietf.org/html/rfc7540). Browser vendors have already implemented it and major websites are using HTTP/2 already.



## CSS for Software Engineers for CSS Developers -- Harry Roberts

[Slides](https://speakerdeck.com/csswizardry/css-for-software-engineers-for-css-developers)

* The first programming languages were written in the 1950s. We should honor existing programming paradigms and apply them to our stylesheets.

* _Don't Repeat Yourself_ is not about duplicated output, therefore argumentless mixins can be valid in certain cases.

* _Single Source of Truth_, the _Single Responsibility Principle_, _Separation of Concerns_, _Immutability_ and the _Open/Closed Principle_ can all be applied to CSS.

* Mutation is particularly common in CSS and leads to unpredictable outcomes and unexpected side effects.

* Deeply nested or qualified selectors increase _Cyclomatic Complexity._

* Proper scoping of selectors can improve _Orthogonality,_ which is inherently difficult in CSS. Can you reorder your `@import` statements?



## We're going in: The 3D web -- Martin Naumann

[Slides](https://docs.google.com/presentation/d/1-v4bmNMN4jum0K5GtJRyldP4U9VZVrDH5BgU6ZW8g3I/)

* WebGL is ready to be used, especially via one of the excellent libraries like [three.js](http://threejs.org/).

* [Archilogic](http://about.archilogic.com/) builds real-time architectural visualization for the web. Another example for good use of WebGL is the article [The Dawn Wall](http://www.nytimes.com/interactive/2015/01/09/sports/el-capitan-2d-image.html?_r=0) by The New York Times.

* The same visual perception tricks as in game engines help us improve performance: Light maps, normal maps, level of detail, asynchronous asset loading…

* WebVR is currently being standardized, but there is a [polyfill](https://github.com/borismus/webvr-boilerplate) for Cardboard and Oculus available.



## Your Web Stack Would Betray You In An Instant -- Tim Perry

[Slides](http://pimterry.github.io/Your-Web-Stack-Would-Betray-You-In-An-Instant)

* Your greatest weakness is (probably) not your code, but your _web framework_, _programming language_, _web server_, _database_ or _network infrastructure._

* Always be ready to update your web stack, so you can benefit from the latest security updates.

* Fear user input in any format and be as restrictive as possible ([CVE-2013-0156](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-0156)).

* Value best practices. If you see automated tests failing, please report it ([CVE-2011-3189](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-3189)).

* Keep internal errors secret from your end users ([CVE-2015-2080](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-2080)).

* Isolate your components from themselves and everyone else ([CVE-2013-1899](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2013-1899)).

* Avoid complexity, as it makes security flaws hard to find ([CVE-2015-5477](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-5477)).



## An Abusive Relationship with AngularJS -- Mario Heiderich

[Slides](http://de.slideshare.net/x00mario/an-abusive-relationship-with-angularjs)

* AngularJS extends the attack surface dramatically. Many sites still use older versions, as updating is unnecessary difficult, largely due to frequent API changes.

* Sandbox bypasses exist for every version of AngularJS, including 1.5.0.

* _Content Security Policy_ can be bypassed when applications use Google's CDN. If it is whitelisted a collision check implemented in AngularJS 1.2.15 enables a downgrade attack.

* Mario was able to attack the code base itself by issuing a [pull request](https://github.com/angular/angular.js/issues/10779) for an apparent "bug", enabling cross-site scripting via the `attributeName` and `attributeType` SVG attributes.

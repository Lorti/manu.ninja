---
layout: post
title:  Topconf Linz 2016 -- Tuesday
date:   2016-02-02
categories: coding
---

Today was the [second day](http://topconf.com/linz-2016/schedule/2016-02-02/) of Topconf Linz 2016. I have seen Phil Nash's talk about service workers and then stayed on the _New Ways To Manage_ track for the rest of the day. Here are my notes from these talks.

## Opening Keynote: One size does not fit all: Carving up stuff for fun and profit -- Stefan Tilkov

@STilkov

(Micro-)services, bounded contexts, components, modules, classes, structs and records, procedures and functions – whatever structuring mechanism we’re talking about, a recurring challenge is to find the right size for things. Opposing forces influence our decisions from both technical and organizational perspectives, and strategies for finding a good balance are few and far between. Let’s take a closer look at what works, what doesn’t, and why.

---

## The web is getting pushy -- Phil Nash

[Slides](https://speakerdeck.com/philnash/the-web-is-getting-pushy-topconf-linz)

The battle between native and web rages on. The browsers are fighting hard to tear down the benefits that native developers have relied on since the inception of mobile platforms. Geolocation, sorted. Accelerometer, done. Performance, we'll come back to that. But one of the greatest draws for native developers has been push notifications, for the web, email alerts just don't cut it.

But now, new in browsers for 2015, is the Service Worker. Born out of the struggle to make the Appcache work for offline capable sites it has also brought the advent of push notifications to the web. Through building up an example application live we will see how to implement the Service Worker to not only serve up an app when we're offline but enhance the online experience with push notifications.

The battle may continue, but the web is definitely pushing back.

## Punishment Driven Development -- Louise Elliot

@IvanaTerrorBull

When things go wrong the first thing we do is find who is to blame and the second thing is to punish them. This talk deives into why humans have this tendency to blame and punish. It looks at real examples of punishment within the software world and the results which were achieved. These stories not only cover managers punishing team members but also punishment within teams and self-punishment. We are all guilty of some of the behaviours discussed.

This is aimed at everyone involved in software development. After the talk attendees will understand:

- Why we tend to blame and punish others.
- The impact of self-blame.
- The unintended (but predictable) results from punishment.
- The alternatives to punishment, which get real results.

## There is no half-remote team -- Markus Tacker

[Slides](https://docs.google.com/presentation/d/1wOsTthhK1rgmSYl6ZChHzSTD3hkMjmlkfZKnlgQtU94)

Having remotes on the team enables you to hire for talent and not for availability. From my recent positions I learned that it is critical to encode remote work in every team members work habits-even if they are working on location. In this talk I would like to show you how I've set up my teams in the past and what I did to integrate remotes in our physical office (yes, we still have one).

---

## JSON-API -- The ultimate anti-bikeshedding weapon -- Henning Glatter-Götz

[Slides](https://speakerdeck.com/hglattergotz/how-json-api-can-bring-sanity-to-your-php-apis)

APIs are everywhere: many return JSON and are RESTful or even provide hypermedia controls, but chances are they do not adhere to any standard. Essentially they all speak a different language that has to be learned for each specific provider. Wouldn’t it be great if there was a sane specification that lets you standardize your API? Something around which the community can build tools so you don’t have to reinvent the wheel over and over again? In this talk I will introduce the JSON-API specification and explain how it can benefit you on your next API project.

## Show me your office and I'll tell you how productive you are! -- Thomas Turner

http://ideenbewegen.at/

Different kinds of work need different environment. This seems to be logical, though many companies miss to support their employees with an optimized, supporting office-concept.

Due to studies 50-90% of employees are dissatisfied with their personell job-situation. Key-factors are bad work-climate, low efficiency, slow communication, high stress-level and low comfort factor.

Why and how should CEOs and managers think about their work-culture and office-structure? Why will innovation be supported by new and different rooms? This firsthand report of a reference project, the middle- and long-term conclusions will answer these and many more questions and will give you a lot to think.

---

## Keynote: HTTP/2: Current Status -- Simone Bordet

[Video](https://www.youtube.com/watch?v=QpLtBftqM04)

HTTP 2.0 is supposed to be the next big thing for the web, after the overwhelming success of HTTP 1.1. In this keynote we will examine the HTTP 2.0 protocol, what is the status of its specification, what features does it offer over HTTP 1.1, and how websites can benefit (in speed and money) from it. Finally, we will explore the status of HTTP 2.0 support in the Java platform, finishing up with a demo of new HTTP 2.0 features.

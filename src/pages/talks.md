---
layout: layouts/minimal.njk
permalink: /talks/
title: Speaking and Workshops
description: I’m available for speaking and workshops, talking about web design and development, game asset creation and challenges we’ve faced at karriere.at.
---

I’m available for speaking and workshops, just send a message to [office@manuelwieser.com](mailto:office@manuelwieser.com).
I’d be happy to talk about web design and development, game asset creation and challenges we’ve faced at [karriere.at](https://www.karriere.at).

![Manuel speaking at Stahlstadt.js](/manuel-speaking-at-stahlstadt-js.jpg)

{% set publicTalks = talks  | selectattr('public') %}
{% set hagenbergTalks = talks  | selectattr('hagenberg-2019') | reverse %}
{% set internalTalks = talks | selectattr('karriere.at') %}

## Talks

{% set talks = publicTalks %}
{% include 'partials/talks.njk' %}

## Lectures

This is a selection of lectures I have given at the University of
Applied Sciences in Hagenberg, Upper Austria. The slides often
contain examples and repository links that may also benefit others
learning the discussed technology, which is why I wanted them to
be public after the course(s).

{% set talks = hagenbergTalks %}
{% include 'partials/talks.njk' %}

## karriere.at

The karriere.at Dev-Café is an internal meetup where developers
give talks on technology, tools or methods related to software
development. I’ve supported this format with many talks, but also
organized and held workshops for present and (hopefully) future
co-workers.

I won’t upload the slides, as many of them contain information
specific to karriere.at. They only serve as list of topics I have
and can give talks/workshops about at your event, if you’re
interested.

{% set talks = internalTalks %}
{% include 'partials/talks.njk' %}

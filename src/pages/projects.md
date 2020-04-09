---
layout: layouts/minimal.njk
permalink: /projects/
title: Projects
description: Here you’ll find a selection of open-source projects I’ve created or contributed to, as well as personal and professional work.
---

Here you’ll find a selection of open-source projects I’ve created or contributed to, as well as personal and professional work. As
soon as I find the time I’ll add games and digital art projects.

There’s a list of featured projects and a chronological list of projects. Also I try to actively maintain all of my open-source projects, if they’re not marked as deprecated.


{% set chronologicalProjects = projects %}
{% set featuredProjects = projects | selectattr('featured') %}

## Featured Projects ✨

{% set projects = featuredProjects %}
{% include 'partials/projects.njk' %}

## Projects <small>(Chronological 📅)</small>

{% set projects = chronologicalProjects %}
{% include 'partials/projects.njk' %}

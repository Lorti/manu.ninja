---
layout: layouts/post.njk
permalink: /microfrontends-at-karriere.at/
title: Microfrontends at karriere.at
description: Learn how we’ve split the karriere.at “front-end monolith” into smaller parts that our teams can develop effectively and independently! ⛏
date: 2020-06-23
categories: [coding]
tags: [software-architecture]
thumbnail: /images/microfrontends/split-apple-rock.jpg
---

I had first heard about microfrontends at the Frontend Developer Love conference in Amsterdam on Valentine's Day 2019. Luca Mezzalira and Max Gallo from DAZN gave an [introductory high-level talk][Amsterdam] about microfrontends, but didn't go into any technical details. Still, I immediately had a feeling that the concept could solve some of our pains at karriere.at, so when I got home I created a proof of concept for how we might implement this idea for karriere.at.

<!-- https://drive.google.com/file/d/1b6HXNkVIqLpnge5Ur5-ez-EQdEYZjLsY/view?usp=sharing (Diagrams) -->

If you've never heard of microfrontends, please read the [introductory article][martinfowler.com] by Cam Jackson. It serves as a great reference and shows how microfrontends can be implemented using different web development techniques.

This article will go into detail on how we've applied the concept of microfrontends at karriere.at.

## Microfrontends … ? 🤨

Scaling web development is hard. In the 15-year history of karriere.at we've transitioned from a handful of people working on a monolith to many teams, some of them cross-functional, simultaneously working on a large product that's split between client and server, but also has a microservice architecture in its API layer.

Breaking up the "back-end monolith" into smaller, more manageable parts introduced some costs but overall it made the teams more effective and efficient. The transition to microservices was important, as there were already multiple projects calling the same database, spreading business logic among them.

![](/images/microfrontends/microfrontends-architecture-I.svg)

The front-end was clearly separated, as every project had it's own front-end, tailored to the product. There were no shared components, because the public-facing, customer-facing and internal applications looked and behaved differently.

The need for breaking up the "front-end monolith" arised when two things happened.

* First, we relaunched karriere.at with a cleaner, modern codebase (both back-end and front-end). We did not rewrite all pages before going to production, as this would have meant spending years without product improvements reaching the user. This is why we initially only migrated the home page and job search to the new codebase. All other parts remained in the legacy codebase. Since then we've migrated about 90 % of all pages.
<br>In case you're interested, the legacy application uses the Zend Framework, whereas the modern application uses Laravel. [Yes, we're using PHP.](https://www.jesuisundev.com/en/why-developers-hate-php/)

* Second, we split the public-facing karriere.at into smaller parts, so teams could work independently on them. This brings us to the first example of how to use microfrontends, which I'll call "vertical application slicing".

## <small>Example #1</small><br>Vertical application slicing at karriere.at

The gradual relaunch of karriere.at and enabling teams to change and deploy parts independently requires that we serve two or more different applications under the same domain. The applications look and feel exactly the same, so that it doesn't make a difference to the user.

![](/images/microfrontends/microfrontends-architecture-II.svg)

karriere.at is already split into multiple applications, so here's a few examples:

* "Candidate Content" takes care of everything surrounding search features.

* "Candidate Success" takes care of everything surrounding a user's profile.

* The "Application Form" handles all logic regarding job applications. They can be started from different sources, not just job postings, so the application form is not as trivial as it may seem. <br> Also, since we're mostly speaking German in the company, there's not much confusion between the different meanings of the word "application".

![](/images/microfrontends/microfrontends-verticals.svg)

### Benefits

Why have we split karriere.at into multiple applications?

* Again, doing a full relaunch means there's no updates for the user and no updates for the client over a long period of time. This is why we wanted to replace pages gradually with a new stack.

* "Candidate Content" can be optimized for search engines (rendered on the server, then hydrated on the client).

* "Candidate Success" and "Application Form" can be built as a single-page web applications, fully rendered on the client.

* We can also separate content pages (articles, landing pages, promotions …) from applications, so that marketing is independent from product development and the other way around.

* Teams can freely (to an extent) decide on their technical stack.

### <small><strike>Problems?</strike></small> <small><strike>Issues?</strike></small> <br> Challenges

Splitting karriere.at into vertical application slices poses a few questions:

* How to set up the infrastructure?
* How to handle authentication and authorization?
* How to keep design (UX/UI) consistent?
* How to prevent code duplication?

#### Infrastructure

Splitting karriere.at into multiple applications requires some DevOps work on the infrastructure. In our case users are forwarded to different applications depending on the URL's path, using nginx' rewrite rules.

![](/images/microfrontends/microfrontends-applications.svg)

If a user requests `karriere.at/dashboard` or `karriere.at/profil` he is forwarded to the "Candidate Success" single-page application. If the user requests `karriere.at/apply` he is forwarded to the "Application Form", wich is also a single-page application. If there's no application linked to a path the user is forwarded to the legacy application.

The legacy application has its own list of already migrated routes. This means if the user requests `karriere.at/jobs` he is forwarded to the "Candidate Content" application, if he requests `karriere.at/center` he stays in the legacy application (at the time of writing).

 And all of this applications have cross-linking between them via URLs.

#### Authentication and Authorization

We are currently finalizing the last steps towards a [single sign-on service](https://en.wikipedia.org/wiki/Single_sign-on) for all karriere.at applications. This service will itself be a vertical application slice that guides the user through an authentication process. In the end the client receives a [JSON Web Token (JWT)](https://jwt.io/) that we can use for any request that needs authorization.

#### Design (UX/UI)

The solution for keeping user experience consistent among several applications is a design system. The karriere.at Design Language System is constantly evolving and describing it in detail requires a separate article, written by one of our designers.

![](/images/microfrontends/design-language-system.jpg)

Tightly coupled to this system is a shared library of styles, assets (icons/fonts) and design tokens.

However, our teams and applications have different technical stacks, depending on what they're optimized for. Styles---written in Sass and BEM---are what the stacks have in common. The HTML structure in our npm package is just an example that has to be rebuilt in the templating language of the project. This approach is similar to CSS frameworks like Bootstrap and Foundation. There are no ready-to-use JavaScript components, which brings us to the next topic---code duplication.

#### Code Duplication

Having multiple applications that should look and feel as if they're a single application can lead to code duplication. Shared styles can help with that, but there are still parts that were duplicated across our karriere.at applications. The most prominent examples are the header and footer, including menus (a pop-up on desktop, a drawer on mobile). Some people call these parts the "application shell", or "app shell".

![](/images/microfrontends/app-shell.jpg)

The user won't notice slight differences in the content styles, but the app shell should be solid. Sadly it wasn't, because it had three different implementations: one in our legacy application, one in our modern component-based "Candidate Content" application and one in our Vue.js-powered "Candidate Success" application. Slight differences in the styles lead to visual jumps.

![](/images/microfrontends/headers.gif)

Could shared styles help with that? Yes, they can prevent jumps, but there'd still be duplicated HTML and JavaScript among the applications. So what's our solution?

## Fragments as Microfrontends

The goal is to have a shared fragment of HTML, CSS and JavaScript that can be reused among every application. It has to be used in different technical stacks, should look and feel the same and be independently deployable. So the idea was to build a microfrontend for the app shell, that can be integrated into existing front-ends. Sounds easy?

![](/images/microfrontends/microfrontends-architecture-III.svg)

### How to implement fragments?

Let's have a look at different ways to go about the technical implementation of fragments.

#### `<frameset>`

Really? There are no `<frameset>` and `<frame>` elements in HTML5. They're obsolete, not just deprecated. In the good old days of FrontPage and Netscape, this would be the ideal solution.

#### `<iframe>`

Layouting is difficult, because you have to cumbersomely adjust the `<iframe>`'s size to fit the content. Elements can't "break out" of the `<iframe>`, so there's no way to build dropdowns, overlays and popovers.

#### npm package

The applications use different templating languages (client- and server-side), different CSS preprocessors and different JavaScript language versions. The last of which can be solved with UMD (Universal Module Definition) and Babel.

However, the biggest problem is that you can't deploy npm packages with a single click of a button. Whenever you release a new package version you'd have to update all of the depending applications. Yes, we do have packages where this is already the case, so we know it's annoying.

#### Web Components

I do have hope for web components, but at the moment they still need polyfills and it's difficult (or clunky) to render the Shadow DOM on the server. Also most solutions for custom elements---Angular Elements and similar frameworks---are simply not suitable for us.

### Now what … !? 😭

Because of the differences in our applications we can't use any of the previously mentioned approaches. Therefore let's pause and rewind: What are the similarities of our applications?

* All of our applications use HTML, CSS und JavaScript.
* All of our applications communicate via HTTP(S).
* All of our applications support the same browsers (same demographics plus crawlers).
* All of our applications run on the same domain (https://www.karriere.at).

So what's our solution in the end?

## <small>Example #2</small><br>Horizontal application slicing at karriere.at

The basic concept for karriere.at microfrontends is simple: Provide the front-end fragment as a microservice (with major versions) at a domain similar to `https://microfrontend.karriere.at/v1`.

### Using fragments/microfrontends in applications

The microfrontend returns a static HTML snippet. The snippet has all the HTML, CSS and JavaScript necessary for the microfrontend, without the surrounding `<html>`, `<head>` and `<body>` elements. Applications can fetch the snippet asynchronously and render it (unescaped) in their layouts. The application and microfrontend can have their own technical stacks.

The following sequence diagram shows how this works for a server-rendered application:

![](/images/microfrontends/microfrontends-communication-I.svg)

You can't do the same in a single-page application. When you’d render the whole snippet (including scripts) in a single-page application the browser won’t execute the scripts for security reasons. Therefore you have to send a request with an `Accept: application/json` header, so that the microfrontend can send you a JSON response with the HTML snippet and script URLs as separate fields:

![](/images/microfrontends/microfrontends-communication-II.svg)

### Data

The microfrontend is similar to a ReST API. It's stateless, so you'll always get the same response for the same request. The application itself is responsible for (user) data and session handling.

To get different versions of a microfrontend you can send a `vm` parameter to the API. The `vm` parameter has to include a view model as JSON string, for example `?vm={"user":"Manuel"}` (of course you also have to URL-encode the view model). Why is the view model a single GET parameter? Because it allows us to use arrays and objects, which is difficult with flat parameters.

### Styles

Styles are mainly inlined in the HTML, but you can lazy-load components if you want. Also the HTML classes have a prefix, so that styles don't leak over to the application. There might also be small CSS resets so that the application styles don't leak into the microfrontend. Styles on the `<html>` and `<body>` elements are expected to cascade down into the microfrontend, e.g. font declarations and styling.

Of course there'll be a bit of redundancy between the applications' and microfrontends' styles. A shared style library, gzip and deduplication in the build process all help mitigate this problem.

### Interactivity

Global variables in JavaScript also have to be prefixed, but in our case this only applies to webpack's `output.jsonpFunction`. All other JavaScript redundancy is solved by lazy-loading components. It doesn't get rid of the redundancy, but lazy-loading makes sure that there is no impact on page speed or perceived performance. Still, this approach has by far not the overhead that polyfills for web components would bring.

Last, but not least, the application and microfrontend communicate over a global event bus. They simply listen for any dispatched `CustomEvent()` on the `window` object. The implementation details should be hidden in a JavaScript module (in our case a "microfrontend client" npm package), so that the structure of events is decoupled from applications.

## Conclusion

The app shell is the first karriere.at microfrontend. It allows us to roll out changes to all applications simultaneously. The designer want's to change the header's appearance? A product team want's to introduce a new navigation item? Marketing wants to shuffle all links in the footer? No problem, just let me deploy the new microfrontend version. Of course, if there's a breaking change we have to update the major version in all applications, but this should rarely happen. This and other pros and cons apply to microservices in general.

Now, will there be more microfrontends at karriere.at in the future?

> Why would you cut up your system into tiny, distributed, hard-to manage fragments?<br>[Stefan Tilkov][Tilkov]

We probably won't introduce a lot of horizontal application slices, but more vertical application slices. We don't want our system to become too fragmented, as there are potential dangers: What if one of the fragments becomes a bottleneck? What if the shared ownership of a fragment leads to neglect? Refactoring within a team's boundaries is much easier than across an organization.

Is the solution presented in this article what every developer considers a microfrontends approach? Maybe not, if you are strictly thinking about orchestration of multiple single-page applications that you can dynamically load into parts of your pages. Does our solution consist of many front-end applications that together form a larger whole? Absolutely.

As our system's architecture evolves and orchestration / module federation becomes an industry standard we will challenge and rethink our approach. We prefer tried and tested solutions, not jumping on everything new, and choose the simplest thing that works for what we're trying to accomplish.

If you have any thoughts or questions please ask me on [Twitter](https://twitter.com/manuelwieser) or write an email to [manuel.timelthaler@karriere.at](mailto:manuel.timelthaler@karriere.at). There's also a list of links at the end of this article, if you want to dive deeper into microfrontends. Also we're always on the lookout for talented people. So, if you find this topic interesting, why not have a chat about joining our team?

## Sources

### Articles

* [Micro Frontends – Article by Cam Jackson on MartinFowler.com][martinfowler.com]
* [Micro Frontends – ThoughtWorks Technology Radar][ThoughtWorks]
* [Micro­service Websites – Article by Gustaf Nilsson Kotte][Transclusion]
* [Module Federation][ModuleFederation]
* [Self-Contained Systems][SCS]

### Talks

* [You Don’t Know Microfrontends – Talk by Luca Mezzalira & Max Gallo][Amsterdam]
* [“Good Enough” Architecture – Talk by Stefan Tilkov][Tilkov]

### Code

* [single-spa (Open-Source Project)][single-spa]
* [BigPipe (Facebook)][BigPipe]
* [Tailor (Zalando)][Tailor]
* [Web Components][WebComponents]

### Lists

* [Micro Frontends by Elisabeth Engel](https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc)
* [Awesome Micro Frontends](https://www.google.com/search?q=awesome+micro+frontends)

[Amsterdam]:https://www.youtube.com/watch?v=fl6F-f454to
[martinfowler.com]: https://martinfowler.com/articles/micro-frontends.html
[microfrontends.com]: https://microfrontends.com/
[micro-frontends.org]: https://micro-frontends.org/
[ModuleFederation]: https://webpack.js.org/concepts/module-federation/
[SCS]: http://scs-architecture.org/
[Transclusion]: https://gustafnk.github.io/microservice-websites/
[ThoughtWorks]: https://www.thoughtworks.com/radar/techniques/micro-frontends
[Tilkov]: https://gotober.com/2019/sessions/846/good-enough-architecture

[BigPipe]: https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919/
[single-spa]: https://github.com/single-spa/single-spa
[Tailor]: https://github.com/zalando/tailor
[Luigi]: https://github.com/SAP/luigi
[WebComponents]: https://www.webcomponents.org/introduction#what-are-web-components

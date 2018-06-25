---
path: /ab-testing-using-google-analytics
title: A/B Testing Using Google Analytics
date: 2018-06-25
categories: [coding]
tags: [business, conversion, performance, testing, tools]
external: https://dev.karriere.at/a/google-analytics-ab-testing
---

A/B testing allows you to continually improve your product's user experience or various sales and marketing KPIs, as long as your goals are well-defined and you have a clear hypothesis. This article does not tell you why you should do A/B testing, but focuses on how to track the test and analyze its result using JavaScript and Google Analytics.

<!--

A/B testing allows you to continually improve your product's user experience or various sales and marketing KPIs, as long as your goals are well-defined and you have a clear hypothesis. This article does not tell you why you should do A/B testing, but focuses on how to track the test and analyze its result using JavaScript and Google Analytics.

![](/images/google-analytics-ab-testing/analytics-chart-data-cliché-stock-photo.jpg) 

The article is written for developers, marketing and product managers. If you are not a developer, feel free to skip the coding part and only read the first and third sections!

## 1. Test Definition

Before the actual implementation you should define your A and B (even C?) versions and your conversion goal. 

The example A/B test we are going to create has a `Version A` and a `Version B`. The versions have no difference other than their names and we want visitors to click on the `Call to action` button, which is our conversion goal.

![](/images/google-analytics-ab-testing/versions.png) 

To evaluate the test we therefore have to track three events:

1. A visitor viewing version A
2. A visitor viewing version B
3. A visitor clicking the `Call to action` button

The third event is a basic [Google Analytics event](https://support.google.com/analytics/answer/1033068), made up of a __category__, __action__ and optional __label__ component. The component values depend on how you want to manage your events in Google Analytics and are entirely up to you. 

In the example A/B test each component has a value of the same name:

Component | Value
- | - 
Category | `Category`
Action | `Action`
Label | `Label` 

You can also send events for the visitor's pageview of version A or B. We did so for _karriere.at_ in the past, and it looked similar to the following:

Component | Value
- | - 
Category | `ab-test`
Action | `test-name`
Label | `version-a`

Component | Value
- | - 
Category | `ab-test`
Action | `test-name`
Label | `version-b`

This solution works reliably, however in this article I want to propose another approach: __virtual pageviews__. A virtual pageview is like a real pageview, but the URL is made up, hence virtual. 

In the example A/B test the pageview URLs are as follows:

Page | URL (Path)
- | - 
Page containing the A/B test | `/google-analytics-ab-testing`
Version A | `/virtual/A`
Version B | `/virtual/B`

What does that mean? For each request two pageviews are send to Google Analytics: the original pageview of `/google-analytics-ab-testing` and, depending on the version that was served to the user, either `/virtual/A` or `/virtual/B`. 

Why virtual pageviews? I feel it makes talking about the A/B test easier, as you would normally use phrases like 

> How many visitors viewed the red landing page?
 
as opposed to:
 
> How many events in the 'A/B test' category with a 'summer campaign' action and the 'red landing page' label have been tracked?

<small>
Beware, that the virtual pageviews are collected additionally to the normal pageview, so your visits will get "inflated". For this and many other reasons you should create a new view for all of your A/B tests and add a [filter](https://support.google.com/analytics/answer/1033162?hl=en) to exclude virtual pageviews (`/virtual/A`) in your original view.
</small> 

## 2. JavaScript Implementation

The next step is to hand the test definition to the developer, who sets up the code and sends the data to Google Analytics.

The code for the example A/B test is available on [GitHub](https://github.com/karriereat/google-analytics-ab-testing) and can be adapted to your needs. The A/B test implementation has four tasks:

1. Deliver version A to 50% of clients and version B to the other 50% of clients
1. Deliver the same version to a client on each subsequent page load
1. Send virtual pageviews, to track the version a client has received
1. Send conversion events when clicks on the `Call to action` button happen

First you have to add Google Analytics to your code. If you copy the snippet from [analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/) it already sends the normal pageview with `ga('send', 'pageview');`:

```html
<script>
    // ...
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
```

You can immediately test the pageview by opening your browser's developer tools and looking at the network tab:

![](/images/google-analytics-ab-testing/network-tab-pageview-request.png)

In the example A/B test the visitor is assigned a version randomly, which is then stored via `localStorage` on the client. 

<small>
You can do the same on the server by sending cookies, depending on your needs. You might for example choose to segmentize users based on their IDs.
</small>

```js
function getVersion() {
    return localStorage.getItem('version') || (Math.random() >= 0.5 ? 'A' : 'B');
}
function setVersion(value) {
    localStorage.setItem('version', value);
}
```

As soon as you have decided the visitor's version you can immediately send a virtual pageview with `ga('send', ...);`. You can use an options object or the shorthand notation for sending any [Google Analytics hits](https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits):

```js
function sendVirtualPageview(version) {
    ga('send', {
        hitType: 'pageview',
        page: `/virtual/${version}`
    });
    // ga('send', 'pageview',`/${this.version}`)
}
```

![](/images/google-analytics-ab-testing/network-tab-virtual-pageview-request.png) 

The conversion event, which has to be fired when clicking the `Call to action` button, is also sent via `ga('send', ...);`:

```js
function sendConversionEvent() {
    ga('send', {
        hitType: 'event',
        eventCategory: 'Category',
        eventAction: 'Action',
        eventLabel: 'Label'
    });
    // ga('send', 'event', 'Category', 'Action', 'Label');
}
```

![](/images/google-analytics-ab-testing/network-tab-event-request.png) 

This concludes the tracking implementation. The `getVersion` function can then be used to change parts of the page depending on the version being served.

## 3. Google Analytics Report

You can start setting up the A/B test report in Google Analytics simultaneous to the tracking implementation. However, if the implementation was already deployed you can check whether Google Analytics has properly collected your pageviews and events.

To check the pageviews you can open up any content report and search for `virtual`. You can also select real-time reports, if you have just finished implementation and the data hasn't been processed yet, which can take up to a few hours in Google Analytics. This will show you all virtual pageviews collected in the specified timeframe:

![](/images/google-analytics-ab-testing/report-virtual-pageviews.png) 

Then you can verify the conversion event by going to the behavior category and searching for your event (either by category, action or label):

![](/images/google-analytics-ab-testing/report-events.png) 

For your report you will now have to create so-called [segments](https://support.google.com/analytics/answer/3123951) and a [goal](https://support.google.com/analytics/answer/1012040?hl=en) in Google Analytics.

The goal can be created by going to the admin section and selecting _Goals_ in the view column, which is the rightmost column.

![](/images/google-analytics-ab-testing/goal-creation-step-1.png)

I have named the goal `Conversion` and set its type to _Event_. You then have to enter the details of the event and save the goal. If you want, you can use __Verify this Goal__ to have Google Analytics check for any existing events that match your settings.

![](/images/google-analytics-ab-testing/goal-creation-step-2.png)

You can now pick any report in Google Analytics and select the newly defined `Conversion` goal and its various metrics. You can for example go to __Channels__ in the __Acquisition__ section and select goal completions. It will show you how often the `Call to action` button has been clicked in total:

![](/images/google-analytics-ab-testing/goal-completions.png)

What you then want to do is get the number of clicks that happened in each version of your A/B test. For this to happen you have to add two segments via the __+ Add Segment__ button. The only thing you have to specify, besides giving it a meaningful name, is the page you want to filter:

![](/images/google-analytics-ab-testing/segment-creation.png)

With your report properly set up you should now see the conversion rate per version. You can save your report for later or export it in various formats, so you can send it to your data analyst to check its statistical significance. There are also many online [significance calculators](https://vwo.com/ab-split-test-significance-calculator/), if you prefer.

Obviously the data from the example A/B test is boring, which is why I want to conclude this article with the report of an actual A/B/C test that we did at _karriere.at_, so you can see what it looks like with real numbers:

![](/images/google-analytics-ab-testing/report.png)

That was all you need for a simple A/B testing setup using Google Analytics. If you have any questions or feedback, please get in touch!

-->

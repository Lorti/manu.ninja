---
path: /changing-the-color-of-all-links-in-a-google-slides-presentation-with-a-google-apps-script
title: Changing the Color of All Links in a Google Slides Presentation with a Google Apps Script
date: 2018-08-21
categories: [coding]
tags: [business, conferences, slides, tools]
external: https://dev.karriere.at/a/changing-the-color-of-all-links-in-a-google-slides-presentation-with-a-google-apps-script
---

We often use Google Slides at karriere.at for our presentations. To comply with our corporate identity we usually change all colors to our brand color, which is a saturated green. There is one problem, though: The default hyperlink color in Google Slides is a light blue and can not be changed for all Slides at once. Luckily, there is Google Apps Script, which allows you to automate Google Slides and other services.

<!--

We often use Google Slides at karriere.at for our presentations. To comply with our corporate identity we usually change all colors to our brand color, which is a saturated green (#8bc72a). There is one problem, though: The default hyperlink color in Google Slides is a light blue (#01afd1) and can not be changed for all Slides, except if you do a lot of clicking and manually format the color of each hyperlink. Luckily, there is Google Apps Script, which allows you to automate Google Slides and other services:

> Google Apps Script is a scripting language based on JavaScript that lets you do new and cool things with G Suite products like Docs, Sheets, Slides, and Forms. There's nothing to install—we give you a code editor right in your browser, and your scripts run on Google's servers.

-- [Overview of Google Apps Script](https://developers.google.com/apps-script/overview)

To access the script editor open up any of your presentations and head to _Tools_ > _Script editor_ in the menu. This will open up a project which can contain multiple scripts and has familiar _Save_, _Run_ and _Debug_ icons:

![](/images/google-apps-script/google-apps-script-editor.png)

Using the [Slides Service](https://developers.google.com/apps-script/reference/slides/) is just a matter of using a JavaScript-like scripting language and getting to know the various classes and elements a presentation consists of. We'll start with retrieving all slides of the current presentation:

```js
function changeLinkColorToBrandColor() {
    var deck = SlidesApp.getActivePresentation();
    var slides = deck.getSlides();
}
```

You can then iterate over all slides and collect their page elements:

```diff
function changeLinkColorToBrandColor() {
    var deck = SlidesApp.getActivePresentation();
    var slides = deck.getSlides();

+    var pageElements = slides.reduce(function (list, slide) {
+        return list.concat(slide.getPageElements());
+    }, []);
}
```

A page element is everything from shapes to tables or groups. I only care about hyperlinks in shapes, but you can extend your code to e.g. tables, if you want. This is where it starts to get a bit complicated: A page element can be converted to a different object, allowing access to new methods like `getText()`. `getText()` returns a text range, which is the content of a shape or table cell.

```diff
    var pageElements = slides.reduce(function (list, slide) {
        return list.concat(slide.getPageElements());
    }, []);

+    var textRanges = pageElements.reduce(function (list, pageElement) {
+        if (pageElement.getPageElementType() == "SHAPE") {
+            return list.concat(pageElement.asShape().getText());
+        }
+        return list;
+    }, []);
}
```

A text range finally gives you access to its style via `getTextStyle()`:

```diff
    var textRanges = pageElements.reduce(function (list, pageElement) {
        if (pageElement.getPageElementType() == "SHAPE") {
            return list.concat(pageElement.asShape().getText());
        }
        return list;
    }, []);
    
+    textRanges.forEach(function (textRange) {
+        var textStyle = textRange.getTextStyle();
+        if (textStyle.hasLink()) {
+            textStyle.setForegroundColor('#8bc72a');
+        }
+    });
}
```

This seems to be all there is to it, but if we run this script we'll quickly discover a problem: If a shape has normal text and hyperlinks, or if there are multiple hyperlinks, `hasLink()` returns `null`. To solve this, use the `getRuns()` method. A text run is a segment of text where all the characters have the same text style.

```diff
    var textRanges = pageElements.reduce(function (list, pageElement) {
        if (pageElement.getPageElementType() == "SHAPE") {
-            return list.concat(pageElement.asShape().getText());
+            return list.concat(pageElement.asShape().getText().getRuns());
        }
        return list;
    }, []);
```

The final script now looks as follows:

```js
function changeLinkColorToBrandColor() {
    var deck = SlidesApp.getActivePresentation();
    var slides = deck.getSlides();

    var pageElements = slides.reduce(function (list, slide) {
        return list.concat(slide.getPageElements());
    }, []);

    var textRanges = pageElements.reduce(function (list, pageElement) {
        if (pageElement.getPageElementType() == "SHAPE") {
            return list.concat(pageElement.asShape().getText().getRuns());
        }
        return list;
    }, []);

    textRanges.forEach(function (textRange) {
        var textStyle = textRange.getTextStyle();
        if (textStyle.hasLink()) {
            textStyle.setForegroundColor('#8bc72a');
        }
    });
}
```

You can run the script by pressing the play icon, but only after allowing it to view and manage the presentation that's currently opened: 

![](/images/google-apps-script/google-apps-script-permissions.png)

![](/images/google-apps-script/google-apps-script-transformation.png)

Feel free to copy and modify the script from this blog post. If you have any questions please don't hesitate to ask me on Twitter.

-->

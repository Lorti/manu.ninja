---
layout: post
title:  Inline SVG – How I Learned to Stop Worrying and Love gzip
date:   2016-08-28
categories: coding
thumbnail: /images/general-buck-turgidson.gif
sharing: true
---

What If I told you, that you can inline all of your SVG icons and stop worrying about the alternatives? In this article I suggest that you make your life easier by embracing gzip and replacing all of your `<use>`{:.html} references.

The web community has switched from [sprite sheets](http://alistapart.com/article/sprites) to [icon fonts](https://24ways.org/2011/displaying-icons-with-fonts-and-data-attributes) to [SVG icon systems](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/) all in only ten years. We have done this for the sake of user experience, while sometimes putting developer happiness aside and maybe over-engineering the basic task of displaying an image.

While using SVG icons has many benefits -- like them being small, flexible and sharp -- we still have to deal with annoyances and browser inconsistencies and depend on authoring/build pipelines of various complexity. What are the implementation options and the problems you might have already encountered?

* `<img>`{:.html} and `<picture>`{:.html} do not let you manipulate your icons.

* `background-image: url(...)`{:.css} limits manipulation options and Base64-encoded SVGs are often larger than the original.

* `<iframe>`{:.html}, `<embed>`{:.html} and `<object>`{:.html} do not let you style your SVGs directly and add a significant overhead to your site when used several times.

* Putting your SVGs inline saves one or many HTTP requests but the images won't get cached by the browser.

* Sprites using `<symbol>`{:.html} and `<use>`{:.html} are one of my favorites but they add overhead via explicit references. You will also have to create different sets for different sites in the build process or load icons you don't need on the page, adding to the overhead.

* Sprites come with additional problems, as you still need a fallback for external references in the style of `xlink:href="path/to/icons.svg#icon"`{:.html} in all versions of Internet Explorer and early versions of Edge.

* Sprites have to be hidden or they will take up space on the page. Hiding and referencing leads to various implementation-specific problems. Have yourself a good time and spend a day with `<defs>`{:.html}, `<symbol>`{:.html}, `<use>`{:.html} and [linear gradients](https://bugzilla.mozilla.org/show_bug.cgi?id=353575) in Firefox.

* You have to use fragment identifiers for `xlink:href`{:.html}, meaning you have to be careful with IDs.
 
* You require a build step in which you have to either manually define which icons should be grouped into a set or try to determine the icons your individual pages depend on.<br>
This has become a problem for us when switching to _webpack_ and npm scripts for our build process in a current project. It also undermines the idea of independent front-end components, as icon sprites have to be already present on a page to be used. There are ways to request the sprite from within the components but this approach is far from elegant.

* People have begun to borrow methods from font loading like [storing sprites in the local storage](http://osvaldas.info/caching-svg-sprite-in-localstorage) for better performance, which I think is great but further complicates the matter.

* Having all these different implementation options and quirks has to be a nightmare for newcomers to web development.

![](/images/general-buck-turgidson.gif)

This is just an excerpt of the things that come to my head right away and that I have experienced in the last years. I don't want to diminish existing solutions. I solely want to suggest a radically simpler approach, which you might add to your inventory and consider for your next project. I'm in favor of inlining SVG as it saves you a lot of headaches, is the easiest to manipulate and may not even require a build process in certain projects, given that your SVG icons are already optimized.

This of course means to relinquish browser caching. But in my opinion the ease of implementation and that you only send the icons actually present on a page makes up for it, especially on initial page load.



## Applying gzip to a prototypal SVG icon system

What enables us to get rid of sprites, build processes and implementation-specific problems is our old friend gzip. The icon system we will be using in this example is the open-source [Open Iconic v1.1.1](http://useiconic.com/open).

gzip is based on LZ77 and Huffman coding, which you may have heard of as the DEFLATE algorithm. LZ77 replaces repeated occurences of data with references and Huffman coding assigns shorter codes to frequent characters. 

The way LZ77 works can be compared to what you do manually when using `<use>`{:.html} in your HTML. Why not let gzip do the work for you? The more often a string of characters is repeated the better gzip compression gets. So after encoding gzip has created a SVG "sprite" with references of just the icons that are present on our page.

To test this assumption I have created four example files and put them through `gzip -1`{:.bash}, being the default compression level of nginx, and `gzip -6`{:.bash}, being the default of the command line utility.

* `references.html`{:.bash} ([Source](https://github.com/Lorti/open-icon-gzip-examples/blob/master/html/open-iconic-references.html)) contains the full Open Iconic set with all 223 SVG icons referenced via `<use>`{:.html}.

* `inline.html`{:.bash} ([Source](https://github.com/Lorti/open-icon-gzip-examples/blob/master/html/open-iconic-inline.html)) contains each of the 223 SVG icons inlined in the HTML.

* `duplicates.html`{:.bash} ([Source](https://github.com/Lorti/open-icon-gzip-examples/blob/master/html/open-iconic-duplicates.html)) contains each of the 223 SVG icons inlined in the HTML, repeated 10 times.

* `realistic.html`{:.bash} ([Source](https://github.com/Lorti/open-icon-gzip-examples/blob/master/html/open-iconic-some-duplicates.html)) contains each of the 223 SVG icons inlined in the HTML, with 4 "representative" icons repeated 20 times.

~~~ bash
html
 68168 open-iconic-references.html
 59903 open-iconic-inline.html
594522 open-iconic-duplicates.html
 86985 open-iconic-realistic.html

html-gzip-1
 17884 open-iconic-references.html.gz
 14461 open-iconic-inline.html.gz     # 3,423 bytes smaller than referenced icons
139610 open-iconic-duplicates.html.gz
 15334 open-iconic-realistic.html.gz  # 6 % larger (873 bytes) than all inlined icons

html-gzip-6
 14986 open-iconic-references.html.gz
 11517 open-iconic-inline.html.gz     # 3,469 bytes smaller than referenced icons
104971 open-iconic-duplicates.html.gz
 12135 open-iconic-realistic.html.gz  # 5.4 % larger (618 bytes) than all inlined icons

minified
 68167 open-iconic-references.min.html
 59003 open-iconic-inline.min.html
585522 open-iconic-duplicates.min.html
 85525 open-iconic-realistic.min.html

minified-gzip-1
 17888 open-iconic-references.min.html.gz
 14323 open-iconic-inline.min.html.gz     # 3,656 bytes smaller than referenced icons
138102 open-iconic-duplicates.min.html.gz
 15213 open-iconic-realistic.min.html.gz  # 6.2 % larger (890 bytes) than all inlined icons

minified-gzip-6
 14990 open-iconic-references.min.html.gz
 11424 open-iconic-inline.min.html.gz     # 3,566 bytes smaller than referenced icons
103887 open-iconic-duplicates.min.html.gz
 12029 open-iconic-realistic.min.html.gz  # 5.3 % larger (605 bytes) than all inlined icons
~~~

The icons in `realistic.html`{:.bash} were selected to have different "representative" lengths, similar to what might be used on a real page – most of the icons once, and few of the icons often.

~~~ html
<svg class="icon" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v1h8v-1h-8zm2 2v1h6v-1h-6zm-2 2v1h8v-1h-8zm2 2v1h6v-1h-6z"/>
</svg>
<svg class="icon" width="8" height="8" viewBox="0 0 8 8">
    <path d="M1.16 0c-.72.72-1.16 1.71-1.16 2.81s.43 2.12 1.16 2.84l.72-.72c-.54-.54-.88-1.29-.88-2.13 0-.83.33-1.55.88-2.09l-.72-.72zm5.69 0l-.72.72c.54.54.88 1.26.88 2.09 0 .83-.33 1.58-.88 2.13l.72.72c.72-.72 1.16-1.74 1.16-2.84 0-1.1-.43-2.09-1.16-2.81zm-4.25 1.41c-.36.36-.59.86-.59 1.41 0 .55.23 1.08.59 1.44l.69-.72c-.18-.18-.28-.44-.28-.72 0-.28.1-.5.28-.69l-.69-.72zm2.81 0l-.69.72c.18.18.28.41.28.69 0 .28-.1.54-.28.72l.69.72c.36-.36.59-.89.59-1.44 0-.55-.23-1.05-.59-1.41z"
          transform="translate(0 1)"/>
</svg>
<svg class="icon" width="8" height="8" viewBox="0 0 8 8">
    <path d="M2 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1 4.81v3.19l1-1 1 1v-3.19c-.31.11-.65.19-1 .19s-.69-.08-1-.19z"
          transform="translate(2)"/>
</svg>
<svg class="icon" width="8" height="8" viewBox="0 0 8 8">
    <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1c.66 0 1.26.21 1.75.56l-4.19 4.19c-.35-.49-.56-1.09-.56-1.75 0-1.66 1.34-3 3-3zm2.44 1.25c.35.49.56 1.09.56 1.75 0 1.66-1.34 3-3 3-.66 0-1.26-.21-1.75-.56l4.19-4.19z"/>
</svg>
~~~

What you can see in the prior `ls -l *`{:.bash} output is that the byte sizes show a few interesting things.

* `gzip -6`{:.bash} is around 3 KB smaller than `gzip -1`{:.bash}, so you should play with the compression level.
* The difference between normal and minified HTML can be neglected, as the icons are already optimized.
* Reusing icons that are already present on a page only adds a small amount of data.
* You should be able to serve your HTML in under 14,2 KB easily, transferring all of your data in [TCP's initial window](https://tools.ietf.org/html/rfc6928).

The compression level can be set via the `DeflateCompressionLevel`{:.bash} directive in Apache [mod_deflate](http://httpd.apache.org/docs/current/mod/mod_deflate.html) and the `gzip_comp_level`{:.bash} directive in nginx' [ngx_http_gzip_module](http://nginx.org/en/docs/http/ngx_http_gzip_module.html) module.

Another tip is to make sure the ordering of your attributes is the same throughout your page. This makes it easier for gzip to repeat the string by reducing the entropy in your data.



## Conclusion

You should of course test this for your project and if it also applies to you. Different prerequisites lead to different results. If you are happy with your current solutions and it fits you, please keep it. Although for your next project I hope that you see and consider the benefits of this approach.

* You can stop worrying and just use icons as creatively as you'd like.
* You are keeping it simple by using a "Don't overthink it" approach.
* You can serve your "critical icons" in your first request.
* You don't have to determine what icons are included in your set.

In some ways this solution can be compared to Hugo Giraudel's [conclusion](https://www.sitepoint.com/avoid-sass-extend/) about `@include`{:.css} versus `@extend`{:.css} in Sass. gzip eliminates the alleged disadvantage of printing the same CSS declarations repeatedly.

If you are still not convinced take a a look at [GitHub's source code](view-source:https://github.com/) and marvel at their "octicons"!

~~~ html
<svg aria-hidden="true" class="octicon octicon-bell" height="16" version="1.1" viewBox="0 0 14 16" width="14">
    <path d="M14 12v1H0v-1l.73-.58c.77-.77.81-2.55 1.19-4.42C2.69 3.23 6 2 6 2c0-.55.45-1 1-1s1 .45 1 1c0 0 3.39 1.23 4.16 5 .38 1.88.42 3.66 1.19 4.42l.66.58H14zm-7 4c1.11 0 2-.89 2-2H5c0 1.11.89 2 2 2z"></path>
</svg>
~~~

Have I missed something? Do you feel there's a flaw in this logic? Do you wildly oppose my suggestions? I'm happy to discuss your thoughts about this approach. 

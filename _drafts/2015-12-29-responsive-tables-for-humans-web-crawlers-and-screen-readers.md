---
layout: post
title:  Responsive Tables for Humans, Web&nbsp;Crawlers and Screen&nbsp;Readers
date:   2015-12-29
categories: coding
---

The web was once full of tables and creative ways of misusing them for layout. These days are over and tables are being used for their initial purpose, being data representation. Unfortunately responsive web design and having to deal with tables on smaller screens has led people to stir `<div>`{:.html} soups on the one hand and creating JavaScript houses of cards on the other.

This post summarizes what I have learnt about HTML tables and the approach that I use to get the most out of data tables while using the simplest CSS possible. You can see the end product in the [CodePen](http://codepen.io/Lorti/pen/obXOyM/) below. Please resize your viewport for the layout to switch.

<p data-height="320" data-theme-id="0" data-slug-hash="obXOyM" data-default-tab="result" data-user="Lorti" class='codepen'>See the Pen <a href='http://codepen.io/Lorti/pen/obXOyM/'>Responsive Tables II</a> by Manuel Wieser (<a href='http://codepen.io/Lorti'>@Lorti</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
 <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Benefits

* **Sexy** - Designers can go crazy with typography, spacing, dimensions and colors. As long as they agree to the vertical table layout on mobile, where each entry is shown as a distinct block of information (similar, but not exactly like the [information tables on Wikipedia](https://en.wikipedia.org/wiki/Sun)).

* **Fast** - The markup for mobile and desktop is the same and there are no unnecessary helper elements needed. The layout switches only with CSS and there is no JavaSript needed. This prevents a "flash of unstyled table", as the table does not reflow once the JavaScript is loaded.

* **SEO** – A good table has a subject column, table headers with `<th>`{:.html} elements and a table caption with `<caption>`{:.html}. Search engines detect the subject column themselves, so you have to apply a custom style. In my example the left column has different colors and is written in bold. Search engines will also analyze content before and after the table to learn about the meaning of the table, so be sure to describe it in your heading and body text.

* **Accessibility** – You may further identify the table headers with `<th scope="col">`{:.html}
 or `<th scope="row">`{:.html}. There are also several ways of providing a table summary, but if you have the need for a summary your table is probably not very accessible and should be simplified. In most cases having a caption and clean markup is all you need for accessible tables. You can find further information in the [Web Accessibility Tutorial](http://www.w3.org/WAI/tutorials/tables/) of the WAI.

In contrast to some responsive table solutions this is also a real table, not a collection of elements made to look like a table. This is good for screen readers (and web crawlers), as they would simply serialize all your `<span>`{:.html} and `<div>`{:.html} elements.

* **Flexible** – We get all the cool things tables give us for free, like being able to control text alignment via `vertical-align: top | middle | bottom;`{:.html} and the browser adjusting cell size to fit the content length.

## Code

~~~ html
<table>
    <caption>Brutto/Netto-Umrechnungen für das Jahr 2015</caption>
        <thead>
            <tr>
                <th>Bruttolohn</th>
                <th>Lohnsteuer</th>
                <th>Freier Dienstvertrag</th>
                <th>Werkvertrag</th>
            </tr>
        </thead>
    <tbody>
        <tr>
            <td data-th="Bruttolohn">€ 1200</td>
            <td data-th="Lohnsteuer">€ 2,82</td>
            <td data-th="Sozialversicherung">€ 180,84</td>
            <td data-th="Nettolohn">€ 1.016,34</td>
        </tr>
        ...
    </tbody>
</table>
~~~

~~~ css
@media screen and (max-width: 640px) {
    thead {
        display: none;
    }

    td {
        display: block;
        position: relative;
        padding-left: 50%;
        text-align: right;
    }

    td:first-child {
        font-weight: bold;
    }

    td:before {
        content: attr(data-th);
        position: absolute;
        top: 10px;
        left: 10px;
        width: 50%;
        font-weight: inherit;
        text-align: left;
    }
}
~~~

---
path: /responsive-tables-for-humans-web-crawlers-and-screen-readers
title: Responsive Tables for Humans, Web Crawlers and Screen Readers
date: 2016-01-05
categories: [coding]
tags: [accessibility]
summary: The web was once full of tables and creative ways of misusing them for layout. These days are over and tables are being used for their initial purpose, being data representation. Unfortunately responsive web design and having to deal with tables on smaller screens has led people to stir <code>&lt;div&gt;></code> soups on the one hand and creating JavaScript houses of cards on the other.
---

The web was once full of tables and creative ways of misusing them for layout. These days are over and tables are being used for their initial purpose, being data representation. Unfortunately responsive web design and having to deal with tables on smaller screens has led people to stir `<div>` soups on the one hand and creating JavaScript houses of cards on the other.

This post summarizes what I have learnt about HTML tables and the approach that I use to get the most out of data tables while using the simplest CSS possible. You can see the end product in the [CodePen](http://codepen.io/Lorti/pen/obXOyM/) below. Please resize your viewport for the layout to switch.

<iframe height='320' scrolling='no' title='Responsive Tables II' src='//codepen.io/Lorti/embed/obXOyM/?height=320&theme-id=dark&default-tab=html,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Lorti/pen/obXOyM/'>Responsive Tables II</a> by Manuel Wieser (<a href='https://codepen.io/Lorti'>@Lorti</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Benefits

* **Sexy** - Designers can go crazy with typography, spacing, dimensions and colors. As long as they agree to the vertical table layout on mobile, where each entry is shown as a distinct block of information (similar, but not exactly like the [information tables on Wikipedia](https://en.wikipedia.org/wiki/Sun)).

* **Fast** - The markup for mobile and desktop is the same and there are no unnecessary helper elements needed. The layout switches only with CSS and there is no JavaSript needed. This prevents a "flash of unstyled table", as the table does not reflow once the JavaScript is loaded.

* **SEO** – A good table has a subject column, table headers with `<th>` elements and a table caption with `<caption>`. Search engines detect the subject column themselves, so you have to apply a custom style. In my example the left column has different colors and is written in bold. Search engines will also analyze content before and after the table to learn about the meaning of the table, so be sure to describe it in your heading and body text.

* **Accessibility** – You may further identify the table headers with `<th scope="col">`
 or `<th scope="row">`. There are also several ways of providing a table summary, but if you have the need for a summary your table is probably not very accessible and should be simplified. In most cases having a caption and clean markup is all you need for accessible tables. You can find further information in the [Web Accessibility Tutorial](http://www.w3.org/WAI/tutorials/tables/) of the WAI.

In contrast to some responsive table solutions this is also a real table, not a collection of elements made to look like a table. This is good for screen readers (and web crawlers), as they would simply serialize all your `<span>` and `<div>` elements.

* **Flexible** – We get all the cool things tables give us for free, like being able to control text alignment via `vertical-align: top | middle | bottom;` and the browser adjusting cell size to fit the content length.

## Code

To show the table data as key–value pairs on mobile you have to add the keys as custom data attributes to your HTML. You can see this in the example as `<td data-th="Bruttolohn">€ 1200</td>`.

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

I have stripped all HTML classes from the example for the sake of brevity. You can and should of course use BEM or any other front-end paradigm, but let's just stick with element selectors here. You can see the whole code in the [CodePen](http://codepen.io/Lorti/pen/obXOyM/), so we just take a closer look at the media query.

You will notice, that this is a desktop-first approach. It is usually the only one I use in my projects. The real headings are hidden and the key–value pairs created via pseudo-elements. The `attr()` expression used in `content: attr(data-th);` lets you retrieve the value of custom data attributes, so you don't have to put strings into your styles. This works since Internet Explorer 8, so don't worry about that.

The `<td>` gets a padding to make room for the absolutely positioned pseudo-element, which gets a width of the same size and is positioned according to the cell padding with `top` and `left`.

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

It's a wrap! Hopefully you can make your tables sexy, fast, search engine optimized, accessible and flexible as well with these tips. If you spot any errors or suggest a different approach please feel free to do so!

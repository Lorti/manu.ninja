---
layout: post
title:  Responsive Tables for Humans, Web&nbsp;Crawlers and Screen&nbsp;Readers
date:   2015-12-15
categories: coding
---

The web was once full of tables and creative ways of misusing them for layout. These days are over and tables are being used for their initial purpose, being data representation. Unfortunately responsive web design and having to deal with tables on smaller screens has led people to stir `<div>`{:.html} soups on the one hand and creating JavaScript houses of cards on the other.

This post summarizes what I have learnt about HTML tables and hopefully enables you to make your tables **sexy,** **fast,** **search engine optimized,** **accessible** and **flexible** as well.

<!--
<p data-height="268" data-theme-id="0" data-slug-hash="obXOyM" data-default-tab="result" data-user="Lorti" class='codepen'>See the Pen <a href='http://codepen.io/Lorti/pen/obXOyM/'>Responsive Tables II</a> by Manuel Wieser (<a href='http://codepen.io/Lorti'>@Lorti</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
 <script async src="//assets.codepen.io/assets/embed/ei.js"></script>
-->

* Sexy
* Fast
* **SEO** – A good table has a subject column, table headers with `<th>`{:.html} elements and a table caption with `<caption>`{:.html}. Search engines detect the subject column themselves, so you have to apply a custom style. In my example the left column has different colors and is written in bold. Search engines will also analyze content before and after the table to learn about the meaning of the table, so be sure to describe it in your heading and body text.
* **Accessibility** – You may further identify the table headers with `<th scope="col">`{:.html}
 or `<th scope="row">`{:.html}. There are also serveral ways of providing a table summary, but if you have the need for a summary your table is probably not very accessible and should be simplified. In most cases having a caption and clean markup is all you need for accessible tables.
* Flexible

Why?

-sexy*
Typographie, Abstände, Dimensionen und Farben lassen sich frei anpassen

*fast*
kein doppeltes HTML für Mobile und Desktop, kein JavaScript, rein über CSS, daher ohne Verzögerung

*accessible*
WAI-konform, Screenreader sieht es als eine echte Tabelle

*suchmaschinenoptimiert*
Google sieht es als eine echte Tabelle und freut sich

*flexibel*
Anzahl der Zeilen egal, Anzahl der Spalten egal, Länge der Beschriftungen egal

kurz SFASF, leicht zu merken!
(Fichtl empfiehlt auch FFASS als Abkürzung)

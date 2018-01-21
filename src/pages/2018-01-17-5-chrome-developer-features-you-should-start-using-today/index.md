---
path: /5-chrome-developer-features-you-should-start-using-today
title: 5 Chrome Developer Tools Features You Should Start Using Today
date: 2018-01-17
categories: [coding]
tags: [tools, performance]
external: https://dev.karriere.at/a/chrome-developer-tools
language: de
---

Developers use the Chrome DevTools on a regular basis. However, most developers limit themselves to a few features that are familiar to them - like changing CSS styles or checking JavaScript errors. It pays off to explore and discover new tools. In this post I'll show you 5 features you may not yet know, but which I find very helpful in my work.

<!--

# 5 Features der Chrome Developer Tools, die du unbedingt verwenden solltest!

Die Chrome Developer Tools werden von Entwicklern täglich genutzt. Die meisten Entwickler beschränken sich allerdings auf ein paar Features, die ihnen sehr vertraut sind -- etwa um CSS-Styles zu verändern oder JavaScript-Fehler zu überprüfen. Dabei lohnt sich der Blick über den Tellerrand, um neue hilfreiche Tools zu entdecken. 

In diesem Post möchte ich 5 Features vorstellen, die ihr vielleicht noch nicht kennt, aber ich bei meiner Arbeit sehr praktisch finde:

1. [Browser verlangsamen](#browser-verlangsamen)
1. [Events überprüfen](#events-überprüfen)
1. [Progressive Web Apps überprüfen](#progressive-web-apps-überprüfen)
1. [7 Arten von Breakpoints](#7-arten-von-breakpoints)
1. [Ausführung (Anzahl und Zeit) messen](#ausführung-anzahl-und-zeit-messen)

## Browser verlangsamen

Oft möchte man die Zeit verlangsamen, um genau beobachten zu können, was eigentlich auf der eigenen App oder Seite passiert. Diese Möglichkeit bieten die Chrome Developer Tools in drei verschiedenen Panels: _Animations_, _Network_ und _Performance_.

### Animationen verlangsamen

Das hilfreiche Panel _Animations_ ist leider nicht auf Anhieb sichtbar. Wer mit `Esc` die Konsole öffnet, findet es im Menü mit den drei vertikalen Punkten. Darin werden alle CSS-Animationen inkl. ihrer Graphen aufgeschlüsselt, lassen sich wiederholen und eben auch langsamer abspielen.

<video width="864" height="432" controls>
  <source src="/images/chrome-developer-tools/chrome-developer-tools-animation-panel.mp4" type="video/mp4">
</video>

### Netzwerk drosseln

Im Panel _Network_ lassen sich langsame Verbindungen simulieren, indem man das Dropdown rechts in der Leiste öffnet. Das gleiche Dropdown befindet sich außerdem im Panel _Performance_.

![](/images/chrome-developer-tools/chrome-developer-tools-throttle-network.png)

### CPU drosseln

Ein schwacher Rechner lässt sich ebenfalls simulieren. Das Dropdown im Panel _Performance_ hat aber leider nur zwei Auswahlmöglichkeiten.

![](/images/chrome-developer-tools/chrome-developer-tools-throttle-cpu.png)

## Events überprüfen

Die Chrome Developer Tools bietet mehrere Möglichkeiten die zahlreichen Events auf modernen Seiten zu überprüfen. Besonders bei unbekannten Codestellen möchte man herausfinden, welche Event Listener auf welchen Elementen gesetzt sind.

### Event Listeners auf DOM-Elementen

Das Panel _Elements_ bietet einen Tab _Event Listeners_ in der Sidebar. Wählt man ein DOM-Element aus, werden alle Event Listener aufgelistet. Zu jedem Event Listener wird die Codezeile angegeben. Außerdem besteht die Möglichkeit, Event Listener vorübergehend zu entfernen.

![](/images/chrome-developer-tools/chrome-developer-tools-events-on-dom-elements.png)

### Event Listeners auf Objekten

Will man sich die Event Listener in der Konsole ausgeben lassen gibt es den Befehl `getEventListeners(object)`. So lassen sich über `getEventListeners($('.c-dropdown-button'))` die gleichen Event Listener wie im vorherigen Beispiel anzeigen.

![](/images/chrome-developer-tools/chrome-developer-tools-get-event-listeners.png)

Der Befehl `$(selector)` ist übrigens ein Alias für [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).

### Events überwachen

Es lassen sich jedoch nicht nur die Event Listener eines Elements anzeigen. `monitorEvents(object[, events])` bietet die Möglichkeit, alle oder bestimmte Events in der Konsole zu protokollieren.

![](/images/chrome-developer-tools/chrome-developer-tools-monitor-events.png)

Außerdem gibt es vordefinierte Gruppen, um mehrere Events gleichzeitig anzugeben: `mouse`, `key`, `touch` und `control`. `monitorEvents($0, 'mouse')` protokolliert z.B. `mousedown`, `mouseup` und dergleichen.
 
Der Befehl `$0` liefert übrigens das zuletzt ausgewählte DOM-Element oder JavaScript-Objekt.

## Progressive Web Apps überprüfen

Google möchte [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) vorantreiben, weshalb sie Tools in ihren Browser integriert haben, die dazu Anreize schaffen sollen. 

### Manifest

Das [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) ist ein grundlegender Bestandteil von Progressive Web Apps. Darin lassen sich Einstellungen treffen, die dem System dabei helfen, die eigene Seite wie eine native App wirken zu lassen.

Das Panel _Applications_ beinhaltet einen Tab, der das `manifest.json` validiert und die Einstellungen und Icons übersichtlich anzeigt.

![](/images/chrome-developer-tools/chrome-developer-tools-manifest.png)

### Audits

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) ist ein Tool, um die Qualität von Webseiten zu verbessern. Es liefert eine Wertung zu Accessibility, Best Practices, Performance und Progressive Web Apps -- inklusive Vorschlägen, wie man die Wertung verbessern kann. 

Lighthouse hat als Chrome Extension begonnen und ist jetzt direkt in die Chrome Developer Tools integriert.

![](/images/chrome-developer-tools/chrome-developer-tools-audit.png)

## 7 Arten von Breakpoints

Die Chrome Developer Tools bieten 7 Arten von Breakpoints an, um ausgeführten Code zu pausieren:

* Codezeile
* Codezeile mit Bedingung
* DOM
* XHR/Fetch
* Event Listener
* Exception
* Funktion

In der [offiziellen Dokumentation](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints) werden alle Varianten ausführlich beschrieben, hier möchte ich jedoch 3 spezielle Möglichkeiten beleuchten.

### XHR/Fetch-Breakpoints setzen

Im Panel _Sources_, in der rechten Sidebar, befindet sich der Punkt _XHR/fetch Breakpoints._ Darin lassen sich URLs angeben, bei deren Aufruf die Ausführung gestoppt werden soll. So kann bei unbekanntem Code schnell herausgefunden werden, welche Funktion die Anfrage schickt.

![](/images/chrome-developer-tools/chrome-developer-tools-xhr-fetch-breakpoints.png)

### Event-Listener-Breakpoints setzen

Es lassen sich auch Events oder Gruppen an Events auswählen, bei deren Auftreten der Browser die Ausführung stoppt. So kann unter anderem herausgefunden werden, ob und wieviele Listener auf globale Events wie `scroll` und `resize` hören.

![](/images/chrome-developer-tools/chrome-developer-tools-event-listener-breakpoints.png)

### Breakpoints im Code setzen

Breakpoints lassen sich nicht nur in den Chrome Developer Tools selbst setzen, sondern auch im Code. Fügt man den Befehl `debugger` im eigenen Code ein, so stoppt der Browser die Ausführung in dieser Zeile.

Solltest du dich ertappen, `debugger` oft in die erste Zeile einer Funktion zu schreiben, ist `debug(function)` eine gute Alternative. Dem Befehl übergibt man einen Funktionsnamen, bei deren Aufruf der Browser stoppen soll.

## Ausführung (Anzahl und Zeit) messen

Mit den Chrome Developer Tools kann auch gezählt werden, wie oft eine Zeile aufgerufen wird, und messen, wie lange ein Code-Fragment bei der Ausführung braucht.

### Ausführungszeit messen

Um die Ausführungszeit zu messen gibt es die Befehle `console.time([label])` und `console.timeEnd([label])`. Die Befehle können ein optionales Label entgegennehmen, um Messungen zu unterscheiden. Nach Aufruf von `console.timeEnd()` wird die Ausführungszeit in die Konsole geschrieben.

![](/images/chrome-developer-tools/chrome-developer-tools-measuring-executions.png)

### Ausführungsanzahl messen

Mit `console.count([label])` lässt sich zusätzlich die Anzahl der Aufrufe mitprotokollieren. So kann beispielsweise überprüft werden, ob eine Funktion zu oft aufgerufen wird. 

### Punkte in der Timeline markieren

Der Befehl `console.timeStamp([label])` aus dem vorherigen Beispiel setzt eine Markierung in der Timeline im Panel _Performance_. Das hilft bei der Auffindung der betroffenen Stellen.

![](/images/chrome-developer-tools/chrome-developer-tools-performance-timestamp.png)

-->

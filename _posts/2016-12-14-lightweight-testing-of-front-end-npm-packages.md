---
layout: post
title:  Lightweight Testing of Front-End npm Packages
date:   2016-12-14
categories: coding
sharing: true
---

## Using npm for Front-End JavaScript

## Simple form tracking with Google Analytics

~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms."
}
~~~

~~~ js
function submit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const fields = form.getAttribute('data-event').split(',');
    const fieldsObject = {
        hitType: 'event',
        eventCategory: fields[0],
        eventAction: fields[1],
        hitCallback: () => {
            form.submit();
        }
    };

    ga('send', fieldsObject);
}

function init() {
    if (!ga) {
        throw new Error('Google Analytics missing, aborting…');
    }

    const forms = [].slice.call(document.querySelectorAll('form[data-event]'));
    forms.forEach((form) => {
        form.addEventListener('submit', submit);
    });
}

export default init;
~~~

## Transpiling to 2011's JavaScript with Babel

~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms.",
  "main": "dist/main.js",
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-preset-es2015": "^6.18.0",
  }
}
~~~

~~~ json
{
  "presets": [
    "es2015"
  ]
}
~~~

~~~ bash
npm install
./node_modules/.bin/babel main.js
~~~

~~~ js
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function submit(e) {
    e.preventDefault();

    var form = e.currentTarget;
    var fields = form.getAttribute('data-event').split(',');
    var fieldsObject = {
        hitType: 'event',
        eventCategory: fields[0],
        eventAction: fields[1],
        hitCallback: function hitCallback() {
            form.submit();
        }
    };

    ga('send', fieldsObject);
}

function init() {
    if (!ga) {
        throw new Error('Google Analytics missing, aborting…');
    }

    var forms = [].slice.call(document.querySelectorAll('form[data-event]'));
    forms.forEach(function (form) {
        form.addEventListener('submit', submit);
    });
}

exports.default = init;
~~~

## Using the prepublish hook to automate transpiling

~~~ bash
├── dist
│   └── main.js
├── src
│   └── main.js
├── test
│   └── main.js
├── .babelrc
└── package.json
~~~

~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms.",
  "main": "dist/main.js",
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-preset-es2015": "^6.18.0",
  },
  "scripts": {
    "prepublish": "babel src/main.js --out-file dist/main.js",
  }
}
~~~

## Testing in a browser environment with Browserify, Tape and Sinon

~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms.",
  "main": "dist/main.js",
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-preset-es2015": "^6.18.0",
    "babelify": "^7.3.0",
    "browserify": "^13.1.1",
    "sinon": "^1.17.6",
    "tap-spec": "^4.1.1",
    "tape": "^4.6.2",
    "tape-run": "^2.1.4"
  },
  "scripts": {
    "prepublish": "babel src/main.js --out-file dist/main.js",
    "test": "browserify test/main.js -t [ babelify ] | tape-run | tap-spec"
  }
}
~~~

~~~ js
import test from 'tape';
import { spy } from 'sinon';
import init from '../src/main';

test('Tracking', (t) => {
    t.plan(4);

    window.ga = null;
    t.throws(init, 'Throws exception when Google Analytics not found');

    document.body.innerHTML = `
        <form data-event="category,action">
            <button type="submit" value="Submit">
        </form>
    `;

    window.ga = spy();
    init();

    document.querySelector('form').dispatchEvent(new Event('submit'));
    t.ok(window.ga.calledOnce, 'Sends event to Google Analytics on form submit');

    const fields = window.ga.getCall(0).args[1];
    t.equal(fields.eventCategory, 'category', 'Event category is `category`');
    t.equal(fields.eventAction, 'action', 'Event action is `action`');
});
~~~

~~~ bash

  Tracking

    ✔ Throws exception when Google Analytics not found
    ✔ Sends event to Google Analytics on form submit
    ✔ Event category is `category`
    ✔ Event action is `action`


  total:     4
  passing:   4
  duration:  3.4s

~~~

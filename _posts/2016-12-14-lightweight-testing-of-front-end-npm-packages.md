---
layout: post
title:  Lightweight Testing of Front-End npm Packages
date:   2016-12-14
categories: coding
sharing: true
---

This tutorial shows how to use npm for front-end JavaScript package management and writing lightweight automated tests with Browserify, Tape and Sinon. It also examines transpiling with Babel, handling npm hooks and using npm privately without publishing your package.

## Using npm for Front-End JavaScript

A few years ago Bower introduced developers to front-end package management. Almost everything of what made Bower great can also be done with npm, especially since it now uses a flat dependency graph.

<blockquote class="twitter-tweet" data-align="center">
    <p lang="en">With npm 3 there is no valid reason for people to keep using Bower anymore other than inertia. It’s good for front-end deps now.</p>
    <a href="https://twitter.com/dan_abramov/status/654406112180047872">Dan Abramov</a>
</blockquote>
<!--<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>-->

npm was initally developed for the Node.js ecosystem, not with front-end packages in mind. This has changed with module-bundling tools like Browserify and webpack. We can now simply `import`{:.js} or `require`{:.js} modules and use them in our front-end.

It is likely that you already have a `package.json`{:.bash} file for npm in your existing projects. Installing Bower and creating a separate `bower.json`{:.bash} would increase complexity.

Which is why you will now find a complete example package illustrating how to use npm for front-end packages and how to easily set up automated tests for JavaScript that is dependant on a browser environment.

## Simple form tracking with Google Analytics

The examplary front-end npm package for this tutorial is a form tracker using Google Analytics. When setting the custom `data-event`{:.html} attribute on a form it sends an event to Google Analytics. The value of the attribute are the event category and event action, separated by a comma.

### package.json
~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms."
}
~~~

### main.js
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

## Transpiling to ES5 with Babel

The prior code is written in ES6, as can be seen by the `const`{:.js} and `export`{:.js} statements. To ensure the best compatiblity with browsers we can transpile it to older JavaScript with Babel. For this we add `babel-cli`{:.bash} and `babel-preset-es2015`{:.bash} as dependencies and add a short `.babelrc`{:.bash} file.

### package.json
~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms.",
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-preset-es2015": "^6.18.0",
  }
}
~~~

### .babelrc
~~~ json
{
  "presets": [
    "es2015"
  ]
}
~~~

After `npm install`{:.bash} and we can test Babel by writing `./node_modules/.bin/babel main.js`{:.bash} and it will output the ES5 result, which should work in any popular browser being used today.

### Output
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

## Using npm hooks to automate transpiling

You can specify various [hooks](https://docs.npmjs.com/misc/scripts) in your `package.json`{:.bash}. If you need to perform operations on your package before it is used you should use a `prepublish`{:.bash} script. This script is run before the package is published to the npm registry and on `npm install`{:.bash}, when called without any arguments.

At this point it may be beneficial to sort the project into a `src`{:.bash}, `test`{:.bash}, and `dist`{:.bash} folder. 

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

We can then add `"main": "dist/main.js"`{:.json} to our `package.json` to specify the script that should be used when we `import` or `require` the package. `babel src/main.js --out-file dist/main.js`{:.bash} is our `prepublish`{:.bash} hook, reading from `src/main.js`{:.bash} and writing to `dist/main.js`{:.bash}.

### package.json
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

The last question is how to test your front-end code automatically. The lightweight `tape` offers the ability to write unit tests for Node.js, outputting the results in Test Anything Protocol format. It provides a simple interface to write assertions like `t.equal(actual, expected, message)` and plan how many assertions should be run.

For testing our form tracking we further need `tape-run`, enabling us to run our test in a browser environment. Otherwise we would have no `document.body` to add our form to. To run our code in a browser enviroment we first need to bundle it, though. Browserify bundles our imported packages and transforms the result to ES5 using Babel via Babelify.

[Sinon](http://sinonjs.org/) is then used to mock the Google Analytics library, as we don't want to send real events. We can create a test spy, that resembles a function, but doesn't really do anything. The spy enables us to test, whether the `ga()` gets called by our script. We can also compare the arguments used while calling `ga()` to our expected category and action.

The last package `tap-spec` takes the Test Anything Protocol output and changes it to look like Mocha's spec reporter, which is just a personal preference. You could even have your results printed as Nyan Cat's rainbow with `tap-nyan`.

### package.json
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

### test/main.js
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

### Output
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

Remember that you are not obliged to publish your packages to the npm registry. You can use any [Git URL as a dependency](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies), for example from your private GitHub repositories or your company's internal GitLab repositories.

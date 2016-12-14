---
layout: post
title:  Lightweight Testing of Front-End npm Packages
date:   2016-12-14
categories: coding
sharing: true
thumbnail: /images/form-tracking-test-results.png
---

1. Zeiten kontrollieren
2. Pronomen kontrollieren
3. Korrekturlesen

This tutorial explains using npm for front-end JavaScript package management and writing lightweight automated tests with Browserify, Tape and Sinon. It also features transpiling with Babel, handling npm hooks and using npm privately without publishing your package.

## Using npm for Front-End JavaScript

A few years ago Bower introduced developers to front-end package management. Almost everything of what made Bower great can also be done with npm, especially since it now uses a flat dependency graph.

<blockquote class="twitter-tweet" data-align="center">
    <p lang="en">With npm 3 there is no valid reason for people to keep using Bower anymore other than inertia. It’s good for front-end dependencies now.</p>
    <a href="https://twitter.com/dan_abramov/status/654406112180047872">Dan Abramov</a>
</blockquote>
<!--<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>-->

npm was initally developed for the Node.js ecosystem, not with front-end packages in mind. This has changed with module-bundling tools like Browserify and webpack. We can now simply `import`{:.no-highlight} or `require()`{:.no-highlight} modules and use them in our front-end.

It is likely that you already have a `package.json`{:.no-highlight} file for npm in your existing projects. Installing Bower and creating a separate `bower.json`{:.no-highlight} would increase complexity.

Which is why you will now find a complete example package illustrating how to use npm for front-end packages and how to easily set up automated tests for JavaScript that is dependant on a browser environment.

## Simple form tracking with Google Analytics

The example front-end npm package for this tutorial is a form tracker using Google Analytics. When setting the custom `data-event`{:.no-highlight} attribute on a form it sends an event to Google Analytics. The value of the `data-event`{:.no-highlight} attribute is a comma-separated string containing the event category and event action.

<figure>
<figcaption>package.json</figcaption>
<pre><code>{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms."
}</code></pre>
</figure>

<figure>
<figcaption>main.js</figcaption>
<pre><code>function submit(e) {
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

export default init;</code></pre>
</figure>

## Transpiling to ES5 with Babel

The prior code is written in ES6, as can be seen by the `const`{:.no-highlight} and `export`{:.no-highlight} statements. To ensure compatiblity with older browsers we can transpile it to ES5 with Babel. For this you have to add `babel-cli`{:.no-highlight} and `babel-preset-es2015`{:.no-highlight} as dependencies and set up a short `.babelrc`{:.no-highlight} configuration file.

<figure>
<figcaption>package.json</figcaption>
<pre><code>{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms.",
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-preset-es2015": "^6.18.0",
  }
}</code></pre>
</figure>

<figure>
<figcaption>.babelrc</figcaption>
<pre><code>{
  "presets": [
    "es2015"
  ]
}</code></pre>
</figure>

After running `npm install`{:.no-highlight} you can test Babel by typing `./node_modules/.bin/babel main.js`{:.no-highlight} and it will output the ES5 result, which should work in any popular browser being used today.

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

You can specify various [hooks](https://docs.npmjs.com/misc/scripts) in your `package.json`{:.no-highlight}. If you need to perform operations on your package before it's being used you should specify a `prepublish`{:.no-highlight} script. That script is run before your package is published to the npm registry and on `npm install`{:.no-highlight}, when called without any arguments. This makes it a good fit for automating the transpiling you did in the previous section.

At this point it may be beneficial to sort the project into a `src`{:.no-highlight}, `test`{:.no-highlight}, and `dist`{:.no-highlight} folder. 

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

You can then add `"main": "dist/main.js"`{:.no-highlight} to your `package.json`{:.no-highlight} to specify the script that should be called when you `import`{:.no-highlight} or `require()`{:.no-highlight} the package. 

Finally `babel src/main.js --out-file dist/main.js`{:.no-highlight} is your `prepublish`{:.no-highlight} hook, reading from `src/main.js`{:.no-highlight} and writing to `dist/main.js`{:.no-highlight}.

<figure>
<figcaption>package.json</figcaption>
<pre><code>{
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
}</code></pre>
</figure>

## Testing in a browser environment with Browserify, Tape and Sinon

You now have your project set up and want to confirm that everything is working correctly. This last section therefore deals with how to test your front-end code automatically. You will utilize [Browserify](http://browserify.org/), [Tape](https://github.com/substack/tape) and [Sinon](http://sinonjs.org/), with the help of `babelify`{:.no-highlight}, `tape-run`{:.no-highlight} and `tap-spec`{:.no-highlight}.

<figure>
<figcaption>package.json</figcaption>
<pre><code>{
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
}</code></pre>
</figure>

### Browserify

[Browserify](http://browserify.org/) bundles our imported packages -- Tape, Sinon and our `src/main.js` -- and transforms the result to ES5 using Babelify. Babelify is a Browserify plugin, which can be set with the transform flag as in `browserify test/main.js -t [ babelify ]`{:.no-highlight}. This way we can write our test in ES6 as we did our actual form tracking. You can of course do the same with webpack, but Browserify needs less configuration in this case.

### Tape

The lightweight [Tape](https://github.com/substack/tape) offers the ability to write unit tests for Node.js, outputting the results in Test Anything Protocol format. It provides a simple interface to write assertions like `t.equal(actual, expected, message)`{:.no-highlight} and plan how many assertions should be run.

For testing our form tracking we further need `tape-run`{:.no-highlight}, enabling us to run our test in a browser environment. Otherwise we would have no `document.body`{:.no-highlight} to add our form to. For this we simply pipe the Browserify output to `tape-run`. You can run the test in any browser by specifying the `--browser` flag, per default it will fire up Electron.

### Sinon

[Sinon](http://sinonjs.org/) is then used to mock the Google Analytics library, as we don't want to send real events. We can create a test spy, that resembles a function, but doesn't really do anything. The spy enables us to test, whether the `ga()`{:.no-highlight} gets called by our script. We can also compare the arguments used while calling `ga()`{:.no-highlight} to our expected category and action. Be sure to check out the Sinon documentation and learn what else it has to offer.

<figure>
<figcaption>test/main.js</figcaption>
<pre><code>import test from 'tape';
import { spy } from 'sinon';
import init from '../src/main';

test('Tracking', (t) => {
    t.plan(4);
    
    window.ga = null;
    t.throws(init, 'Throws exception when Google Analytics not found');
    
    document.body.innerHTML = &#96;
        &lt;form data-event="category,action"&gt;
            &lt;button type="submit" value="Submit"&gt;
        &lt;/form&gt;
    &#96;;
    
    window.ga = spy();
    init();
    
    document.querySelector('form').dispatchEvent(new Event('submit'));
    t.ok(window.ga.calledOnce, 'Sends event to Google Analytics on form submit');
    
    const fields = window.ga.getCall(0).args[1];
    t.equal(fields.eventCategory, 'category', 'Event category is `category`');
    t.equal(fields.eventAction, 'action', 'Event action is `action`');
});</code></pre>
</figure>

The last package `tap-spec` takes the Test Anything Protocol output and changes it to look like Mocha's spec reporter, which is just a personal preference. You could even have your results printed as Nyan Cat's rainbow with `tap-nyan`. If you now run `npm test` it will output the result of our test and its four `t.assertion(…)` statements.

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

That was all you need for thoroughly tested front-end npm packages. Remember that you are not obliged to publish your packages to the npm registry, though. You can list any [Git URL as a dependency](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies), for example your private GitHub repositories or your company's internal GitLab repositories.

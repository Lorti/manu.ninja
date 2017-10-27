---
path: /lightweight-testing-of-front-end-npm-packages
title: Lightweight Testing of Front-End npm Packages
date: 2016-12-15
categories: [coding]
tags: [testing]
sharing: true
thumbnail: /images/form-tracking-test-results.png
---

This tutorial explains using npm for front-end JavaScript package management and writing lightweight automated tests with Browserify, tape and Sinon. It also features transpiling with Babel, handling npm hooks and using npm privately without publishing your package.

## Using npm for Front-End JavaScript

A few years ago Bower introduced developers to front-end package management. Almost everything of what made Bower great can also be done with npm, especially since it now uses a flat dependency graph.

<blockquote class="twitter-tweet" data-align="center">
    <p lang="en">With npm 3 there is no valid reason for people to keep using Bower anymore other than inertia. It’s good for front-end dependencies now.</p>
    <a href="https://twitter.com/dan_abramov/status/654406112180047872">Dan Abramov</a>
</blockquote>
<!--<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>-->

npm was initally developed for the Node.js ecosystem, not with front-end packages in mind. This has changed with module-bundling tools like Browserify and webpack. We can now simply `import` or `require()` modules and use them in our front-end.

It is likely that you already have a `package.json` file for npm in your existing projects. Installing Bower and creating a separate `bower.json` likely increases the complexity of your project.

Which is why we'll now examin an example package, illustrating how to use npm for front-end packages and how to easily set up automated tests for JavaScript that is dependant on a browser environment.

## Simple form tracking with Google Analytics

The example front-end npm package for this tutorial is a form tracker using Google Analytics. When setting the custom `data-event` attribute on a form it sends an event to Google Analytics. The value of the `data-event` attribute is a comma-separated string containing the event category and event action.

<figure>
<figcaption>package.json</figcaption>

~~~ json
{
  "name": "form-tracking",
  "version": "0.1.0",
  "description": "Track form submission by specifying a `data-event` attribute on forms."
}
~~~

</figure>

<figure>
<figcaption>main.js</figcaption>

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

</figure>

## Transpiling to ES5 with Babel

The prior code is written in ES6, as can be seen by the `const` and `export` statements. To ensure compatiblity with older browsers we can transpile it to ES5 with Babel. For this you have to add `babel-cli` and `babel-preset-es2015` as dependencies and set up a short `.babelrc` configuration file.

<figure>
<figcaption>package.json</figcaption>

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

</figure>

<figure>
<figcaption>.babelrc</figcaption>

~~~ json
  "presets": [
    "es2015"
  ]
}
~~~

</figure>

After running `npm install` you can test Babel by typing `./node_modules/.bin/babel main.js` and it will output the ES5 result, which should work in any popular browser being used today.

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

You can specify various scripts in your `package.json`. If you need to perform operations on your package before it's being used you should specify a [prepublish](https://docs.npmjs.com/misc/scripts#common-uses) hook. That code runs before your package is published to the npm registry and on `npm install`, when called without any arguments. This makes it a good fit for automating the transpiling we did in the previous section.

At this point it may be beneficial to sort the project into a `src`, `test`, and `dist` folder.

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

We can then add `"main": "dist/main.js"` to your `package.json` to specify the script that should be called when you `import` or `require()` the form tracking package.

Finally `babel src/main.js --out-file dist/main.js` is our prepublish hook, reading from `src/main.js` and writing to `dist/main.js`.

<figure>
<figcaption>package.json</figcaption>

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

</figure>

## Testing in a browser environment with Browserify, tape and Sinon

We now have our project set up and want to confirm that everything is working correctly. This last section therefore deals with how to test your front-end code automatically. We'll utilize [Browserify](http://browserify.org/), [tape](https://github.com/substack/tape) and [Sinon](http://sinonjs.org/), with the help of `babelify`, `tape-run` and `tap-spec`.

<figure>
<figcaption>package.json</figcaption>

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

</figure>

You can find [`test/main.js`](#test/main.js) after my description of the tools. Before you continue reading you might want to create the file, read the test and run `npm test` to see the results.

### Browserify

[Browserify](http://browserify.org/) bundles our imported packages, tape and Sinon, and combines them with our `src/main.js`. Additionally we can transform the result to ES5. Babelify, a Browserify plugin, can be activated with the transform flag as in `browserify test/main.js -t [ babelify ]`. This way we can write our test in ES6 as we did our actual form tracking.

You can of course do the same with [webpack](https://webpack.js.org/), but Browserify needs less configuration. If you want you can now convert the test script, copy it into your browser's console and look at the [TAP](http://testanything.org/) output -- which brings us to tape.

### tape

The lightweight [tape](https://github.com/substack/tape) offers the ability to write unit tests for Node.js, outputting the result in [TAP](http://testanything.org/) format. It provides a simple interface for writing assertions like `t.equal(actual, expected, message)` and planning how many assertions should be run. If you read the code you'll find it to be clear and straightforward.

For testing our form tracking we further want to pipe the Browserify output to [tape-run](https://github.com/juliangruber/tape-run), enabling us to automatically run our test in a browser environment. You can run the test in any browser by specifying the `--browser` flag. Per default it will fire up Electron.

### Sinon

We can use [Sinon](http://sinonjs.org/) to mock the Google Analytics library, as we don't want to send real events. The simplest tool it has to offer is a [spy](http://sinonjs.org/docs/#spies). A spy allows us to test whether the `ga()` function gets called by our script, without the function having to actually do anything. We can also compare the arguments used when calling `ga()` to our expected category and action. Be sure to check out the Sinon [documentation](http://sinonjs.org/docs/) and learn what else it has to offer.

<figure id="test/main.js">
<figcaption>test/main.js</figcaption>

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

</figure>

The last package [tap-spec](https://github.com/scottcorgan/tap-spec) takes the TAP output and changes it to look like Mocha's spec reporter, which is just a personal preference. You could even have your results printed as Nyan Cat's rainbow with many of the available [formatters](https://github.com/sindresorhus/awesome-tap#javascript). If you now run `npm test` it will output the result of our test and its four assertions.

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

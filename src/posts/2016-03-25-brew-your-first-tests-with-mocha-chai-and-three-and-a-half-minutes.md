---
layout: layouts/post.njk
permalink: /brew-your-first-tests-with-mocha-chai-and-three-and-a-half-minutes/
title: "Brew Your First Tests with Mocha, Chai and 3½ Minutes"
description: "This post is for front-end developers who want to start writing tests. People have told them that testing their code is beneficial to their sanity. For some reason, though, they never got started – maybe because there are a lot of lenghty articles and different tools to consider. This article is different: It is a copy & paste guide to your first tests with a steeping time of about 3½ Minutes."
date: 2016-03-25
categories: [coding]
tags: [testing, tools]
---

This post is for front-end developers who want to start writing tests. People have told them that testing their code is beneficial to their sanity. For some reason, though, they never got started -- maybe because there are a lot of lenghty articles and different tools to consider. This article is different: It is a copy & paste guide to your first tests with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/), with a steeping time of about 3½ Minutes.

>  All code is guilty, until proven innocent.

## HTML

Include `mocha.js`, `mocha.css` and `chai.js` in your `tests.html`. This example uses behavior-driven development, which is why Mocha is initialized with `mocha.setup('bdd')`.

~~~ html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mocha/2.4.5/mocha.css">
</head>
<body>

    <div id="mocha"></div>

    <script src="//cdnjs.cloudflare.com/ajax/libs/mocha/2.4.5/mocha.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.js"></script>

    <script>
        var expect = chai.expect;
        var should = chai.should();
        mocha.setup('bdd');
    </script>

    <script src="tests.js"></script>

    <script>mocha.run();</script>

</body>
</html>
~~~

## JavaScript

Write a synchronous and an asynchronous test in your `tests.js`. If you are done open your `tests.html` in a browser and look at the test results.

~~~ js
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function getIPAddress(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://ip.jsontest.com/', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            callback(JSON.parse(request.responseText));
        } else {
            throw request.status;
        }
    };

    request.onerror = function() {
        throw 'Error';
    };

    request.send();
}

describe('Synchronous Code', function() {
    describe('#clamp()', function () {
        it('should return the number', function () {
            expect(clamp(5, 0, 10)).to.equal(5);
        });
        it('should return max if the number is larger', function () {
            expect(clamp(20, 0, 10)).to.equal(10);
        });
        it('should return min if the number is smaller', function () {
            expect(clamp(-20, 0, 10)).to.equal(0);
        });
    });
});

describe('Asynchronous Code', function() {
    describe('#getIPAddress()', function() {
        it('should get and parse without error', function(done) {
            getIP(function(json) {
                json.should.have.property('ip');
                done();
            });
        });
    });
});
~~~

![](/images/mocha-tests.png)

## Next Steps

Read some detailed articles about testing and use [Mocha](http://mochajs.org/)'s and [Chai](http://chaijs.com/)'s documentation. If you want to run your tests in Node.js run `npm install -g mocha`, write a `test.js` file and start `mocha`.

My goal with this article is to get people up and running so they can start to write some tests and see the benefits for themselves. There are already far better articles out there that can tell you the benefits and intricacies of testing so there is no point in writing another.

I also want to mention that this article was heavily inspired by Remy Sharp's [The copy & paste guide to your first Service Worker](https://remysharp.com/2016/03/22/the-copy--paste-guide-to-your-first-service-worker). Go read it, Service Workers may very well be the next big thing!

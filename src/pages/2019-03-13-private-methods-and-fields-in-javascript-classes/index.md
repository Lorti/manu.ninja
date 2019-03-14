---
path: /private-methods-and-fields-in-javascript-classes
title: Private Methods and Fields in JavaScript Classes
date: 2019-03-13
categories: [coding]
tags: [js]
thumbnail: /author.jpg
external: https://dev.karriere.at/a/private-methods-and-fields-in-javascript-classes
---

Ever since classes were introduced in ECMAScript 2015 people wanted to use private methods and fields, which are well-known from programming languages like C++, PHP or Java. There is now a Stage 3 ECMAScript Proposal regarding private methods, getter/setters and fields. We'll look at the proposed syntax -- which is how you'll (propably) write private methods and fields in future JavaScript versions -- and how to achieve the same functionality with current language features.

<!--

Ever since classes were introduced in ECMAScript 2015 people wanted to use private methods and fields, which are well-known from programming languages like C++, PHP or Java. There is now a [Stage 3 ECMAScript Proposal][Proposal] regarding private methods, getter/setters and fields. We'll look at the proposed syntax -- which is how you'll (propably) write private methods and fields in future JavaScript versions -- and how to achieve the same functionality with current language features.

What is a Stage 3 ECMAScript Proposal you might ask? Since ECMAScript 2015 (commonly known as ES6) new language features have to go through [four stages][The TC39 Process], before they're added to the official [ECMAScript Language Specification][ECMAScript]. The TC39 committee decides whether a feature proposal is worth looking into and what stage it's currently at. A proposal gets refined until the committee decides to change its stage. When a feature reaches stage 4 it will be added to the formal language specification and everyone can start implementing (if they haven't done so already) and using it.

The proposal "Private methods and getter/setters for JavaScript classes" suggests that,

> To make methods, getter/setters or fields private, [we] just give them a name starting with #.

Let's write a minimal `Counter` class as an example:

```js
class Counter {
    #value = 0;
    get value() {
        return this.#value;
    }
    increment() {
        this.#value++;
    }
}

const c = new Counter();
c.increment();
c.increment();
c.increment();
console.log(c.value); // 3
```

The `value` property of `Counter` instances can't be accessed if you don't provide getter/setter functions. The same is true for private methods (`#myPrivateMethod() { ... }`).

If you want to use private methods and fields right now, without waiting for the proposal's acceptance, you can use [WeakMap]. A weak map is a collection where keys are weakly referenced and have to be objects, in this example an instance of `Counter`:

```js
const privates = new WeakMap();

class Counter {
    constructor() {
        privates.set(this, {
            value: 0
        });
    }

    get value() {
        return privates.get(this).value;
    }

    increment() {
        privates.get(this).value += 1;
    }
}

const c = new Counter();
c.increment();
c.increment();
c.increment();
c.value = NaN; // Doesn’t do anything …
console.log(Object.getOwnPropertyNames(c)); // []
console.log(c.value); // 3
```

The concept isn't as fragile as a naming convention for private fields, like prefixing fields with an underscore (`this._privateField`). It's also more memory-efficient than using closures for privacy.
 
You might argue that the `privates` variable, which holds the weak map, can be accessed by anyone. However, if your counter is a module, and the class is exported via `module.exports = Counter;`, the weak map is inaccessible by other modules.

This example is actually what [Babel] does when transforming private methods and fields, although [Babel's code][Babel REPL] is more elaborate. Using Babel is a another way you can use private fields right now in your JavaScript code. You can also use TypeScript, but it has a different syntax (the familiar `private` keyword), which might differ from the ECMAScript language specification when the proposal we've talked about reaches stage 4.

There you have it, three way's of using private members in your JavaScript classes. Let me know if this article has helped you or if you have any feedback.

[Proposal]: https://github.com/tc39/proposal-private-methods
[The TC39 Process]: https://tc39.github.io/process-document/
[ECMAScript]: https://tc39.github.io/ecma262/
[WeakMap]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
[Babel]: https://babeljs.io/
[Babel REPL]: https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAEDCD2BXAdgFwKYCdoG8BQ0h0AxAG5giLrQC80ADANwFEDm6q05l6AFAJS4WRIpg6JMyaKgAWASwgA6MhSrMRAX2HQ5yYGIC26NAKEiRshcu5UA1LfVEtWvMHjIInYLWjJ0AdzgkNCwBZmBFXX10IxN-cMi9Q2NUMNdE6NjU-Nd3CHgQdEUQeFZeCJt0eOgAehroAGY8IA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=stage-3&prettier=false&targets=&version=7.3.4

-->

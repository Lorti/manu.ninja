---
path: /using-the-speech-synthesis-interface-of-the-web-speech-api
title: Using the Speech Synthesis Interface of the Web Speech API
htmlTitle: Using the Speech Synthesis Interface of the Web&nbsp;Speech&nbsp;API
date: 2018-08-26
categories: [coding]
tags: [accessibility, apis, interaction-design, pwa]
thumbnail: /images/author.jpg
---

> "Isn't it nice to have a computer that will talk to you?" 

-- [Agnes](https://www.youtube.com/watch?v=t2A_fZYI6cE), voice in Apple's text-to-speech since before Mac OS X

## What is the Speech Synthesis API?

https://caniuse.com/#feat=speech-recognition

https://caniuse.com/#feat=speech-synthesis

## Init speech synthesis and select one of the current device's voices

```js
let synth;
let voice;

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const voices = synth.getVoices();
  voice = voices.find(_voice => /ja-JP/.test(_voice.lang));
}
```

## Tell the speech synthesis what (and how) to read

```js
function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(output);
  utterance.addEventListener('error', error => console.error(error));
  utterance.voice = voice;
  synth.speak(utterance);
}
```

## Fix invalid BCP 47 language tags on Android

```diff
if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const voices = synth.getVoices();
-  voice = voices.find(_voice => /ja-JP/.test(_voice.lang));
+  voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
}
```

## Load voices when `window.speechSynthesis` is ready

There is a `voiceschanged` event, but it works unreliably, as a quick Stack Overflow search can tell you. 

```js
let attempts = 0;
function loadVoices() {
  attempts++;
  const voices = synth.getVoices();
  if (voices.length) {
    voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
  }
  if (!voice) {
    if (attempts < 10) {
      setTimeout(() => {
        loadVoices();
      }, 250);
    } else {
      console.error('`ja-JP` voice not found.');
    }
  }
}
```

## Fix default `SpeechSynthesisUtterance` property values on Android

```diff
if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
-  const voices = synth.getVoices();
-  voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
+  loadVoices();
}
```

```diff
function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(output);
  utterance.addEventListener('error', error => console.error(error));
+  utterance.lang = 'ja-JP';
+  utterance.pitch = 1;
+  utterance.rate = 1;
  utterance.voice = voice;
+  utterance.volume = 1;
  synth.speak(utterance);
}
```

## Fix utterance of punctuation marks

```diff
function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
-  const utterance = new SpeechSynthesisUtterance(output);
+  const output = text.replace(/(…|[._]{2,})/, '');
+  const utterance = new SpeechSynthesisUtterance(output);
  utterance.addEventListener('error', error => console.error(error));
  utterance.lang = 'ja-JP';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.voice = voice;
  utterance.volume = 1;
  synth.speak(utterance);
}
```

## Full speech synthesis JavaScript module

```js
let synth;
let voice;

let attempts = 0;
function loadVoices() {
  attempts++;
  const voices = synth.getVoices();
  if (voices.length) {
    voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
  }
  if (!voice) {
    if (attempts < 10) {
      setTimeout(() => {
        loadVoices();
      }, 250);
    } else {
      console.error('`ja-JP` voice not found.');
    }
  }
}

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  loadVoices();
}

function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
  // …,..., ___
  const output = text.replace(/(…|[._]{2,})/, '');
  const utterance = new SpeechSynthesisUtterance(output);
  utterance.addEventListener('error', error => console.error(error));
  utterance.lang = 'ja-JP';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.voice = voice;
  utterance.volume = 1;
  synth.speak(utterance);
}

export default {
  speak,
};
```

## Use of speech synthesis in the ⛩ Japanese Phrasebook

[Japanese Phrasebook](https://www.japanese-phrasebook.com/)

<video width="1872" height="1080" controls preload="auto">
    <source src="/images/japanese-phrasebook-speech-synthesis-H264.mp4" type="video/mp4">
</video>

Kanji pose a problem, as they have different readings.

## References

[Web Speech API Specification (W3C)](https://w3c.github.io/speech-api/webspeechapi.html)

[Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

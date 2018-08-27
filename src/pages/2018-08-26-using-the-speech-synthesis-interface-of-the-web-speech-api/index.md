---
path: /using-the-speech-synthesis-interface-of-the-web-speech-api
title: Using the Speech Synthesis Interface of the Web Speech API
htmlTitle: Using the Speech Synthesis Interface of the Web&nbsp;Speech&nbsp;API
date: 2018-08-26
categories: [coding]
tags: [accessibility, apis, interaction-design, pwa]
thumbnail: /images/author.jpg
sharing: true
---

Speech synthesis has come a long way since it's first appearance in operating systems in the 1980s. In the 1990s Apple already offered system-wide text-to-speech support. Alexa, Cortana, Siri and other virtual assistents recently brought speech synthesis to the masses. In modern browsers the [Web Speech API](https://w3c.github.io/speech-api/webspeechapi.html) allows you to gain access to your device's speech capabilities, so let's start using it!

> "Isn't it nice to have a computer that will talk to you?" 

-- [Agnes](https://www.youtube.com/watch?v=t2A_fZYI6cE), voice in Apple's text-to-speech since before Mac OS X

## What is the Speech Synthesis API?

This Web Speech API enables web developers to incorporate speech recognition and synthesis into their web applications. These are available via the `SpeechRecognition` and `SpeechSynthesis` interfaces. While speech recognition has very limited browser support<sup>[3](#references)</sup>, speech synthesis is supported by all major desktop browsers, iOS Safari, Chrome Android and Samsung Internet<sup>[4](#references)</sup>.

## Init speech synthesis and select one of the current device's voices

The `speechSynthesis` interface is a property of the `window` object, if supported by the browser. The `getVoices` method returns a list of all voices that are available on the current device. 

A voice has a name, for example `Kyoko` and a BCP 47 language tag<sup>[5](#references)</sup>, for example `ja-JP`, and a few other attributes. You can have the user choose a voice or iterate the list to find a voice for a specific language. Usually there aren't many to choose from, except when looking for English voices.

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

If you have selected a voice you can define a `SpeechSynthesisUtterance`, which you can pass to the `speak` method of the `SpeechSynthesis` API.

Depending on your operating system and device you should already be able to hear your computer talk. If not, there are a few pitfalls I have encountered myself and will describe in the next sections.

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

Some Android versions seem to ignore BCP 47, which tells us to use a hyphen in language tags<sup>[5](#references)</sup>, and use an underscore character instead. You can circumvent this with a simple `/ja[-_]JP/` regex.

```diff
if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const voices = synth.getVoices();
-  voice = voices.find(_voice => /ja-JP/.test(_voice.lang));
+  voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
}
```

## Load voices when `window.speechSynthesis` is ready

Your first call of the `getVoices` method might return an empty array. This is because the Speech Synthesis API requires a few milliseconds for initialization. There is a `voiceschanged` event, but it works unreliably, as a quick Stack Overflow search can tell you.

The safest approach is therefore to call `getVoices` again after a certain amount of time, and throw an error if it fails too often.

```diff
if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
-  const voices = synth.getVoices();
-  voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
+  loadVoices();
}
```

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

The specification lists sensible default values for the properties of `SpeechSynthesisUtterance` objects. Unfortunately, I have noticed Android using `-1` for pitch, rate and volume.

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

The [Japanese Phrasebook](https://www.japanese-phrasebook.com/) app has sentences that start with an ellipsis or multiple underscores, to mark blanks. Some text-to-speech implementations might read that out loud. This can be solved with a `/(…|[._]{2,})/` regex that sanitizes the text before speaking.

Generally, though, any text-to-speech implementation is highly advanced and will try to read the same way a human does.

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

1. [Web Speech API Specification (W3C)](https://w3c.github.io/speech-api/webspeechapi.html)
1. [Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
1. [Speech Recognition API Browser Support](https://caniuse.com/#feat=speech-recognition)
1. [Speech Synthesis API Browser Support](https://caniuse.com/#feat=speech-synthesis)
1. [Tags for Identifying Languages (BCP 47)](https://tools.ietf.org/html/bcp47)

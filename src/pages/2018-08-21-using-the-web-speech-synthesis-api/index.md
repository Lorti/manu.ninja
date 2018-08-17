---
path: /using-the-web-speech-synthesis-api
title: Using the Web Speech Synthesis API
date: 2018-08-21
categories: [coding]
tags: [accessibility, interaction-design]
---

## TODO
* Tags?
* Thumbnail?

<video width="1872" height="1080" autoplay controls preload="auto" loop>
    <source src="/images/japanese-phrasebook-speech-synthesis-H265.mp4" type="video/mp4">
</video>

```js
let synth;
let voice;

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const voices = synth.getVoices();
  voice = voices.find(_voice => /ja-JP/.test(_voice.lang));
}

function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(output);
  utterance.addEventListener('error', error => console.error(error));
  utterance.voice = voice;
  synth.speak(utterance);
}

export default {
  speak,
};
```

```diff
if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const voices = synth.getVoices();
-  voice = voices.find(_voice => /ja-JP/.test(_voice.lang));
+  voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
}
```

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

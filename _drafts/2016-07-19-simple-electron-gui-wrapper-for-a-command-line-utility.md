---
layout: post
title:  Simple Electron GUI Wrapper for a Command-Line Utility
date:   2016-07-19
categories: coding
sharing: true
---

This post summarizes my experience building a simple Electron app. It guides you through providing a GUI for a command-line utility. It also provides a succinct overview of the few things you really need to know when you are just getting started. The source code of the finished [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator) is on Github, as well as the source code of the [command-line utility](https://github.com/karriereat/animation-strip-generator).


## What is Electron a great fit for?
graphical command-line interface wrapper for internal tools, for example automation for graphic designers
this has been done with other tools like ImageOptim, which uses eight different tools under the hood

<div id="bell"></div>
<style>
#bell {
    width: 109px;
    height: 75px;
    background: url(/images/karriere.at-bell.png) left center;
    animation: play 1.4666666666666666s steps(44) infinite;
}
@keyframes play {
    100% { background-position: -4796px; }
}
</style>

[Daniela](https://twitter.com/schmidxdaniela), one of my colleagues at karriere.at

![](/images/karriere.at-bell.png)

## The basic structure of an Electron app
http://electron.atom.io/docs/tutorial/quick-start/
https://github.com/electron/electron-quick-start

`package.json`
`main.js`
`index.html`

```
npm install electron-prebuilt --save-dev
./node_modules/.bin/electron .
```

## What the API offers you
https://github.com/electron/electron-api-demos
http://electron.atom.io/docs/api/

## Communication between processes
http://electron.atom.io/docs/api/ipc-main/
http://electron.atom.io/docs/api/ipc-renderer/

The `ipcMain` and `ipcRenderer` modules are instances of the standard Node.js `EventEmitter` class. They can be used to communicate asynchronously between the main process and the renderer process.

## Building an interface
CSS

## File dialogs
http://electron.atom.io/docs/api/dialog/

## Distribution
https://github.com/electron-userland/electron-packager
`./node_modules/.bin/electron-packager ./ --all`

118,9 MB on Mac OS X
133,1 MB on Windows

https://github.com/electron-userland/electron-builder
uses the packager under the hood and deals with additional concerns like icons, installers and updating your apps automatically



## Problems
precompiled third-party binaries like ImageMagick
stay with JavaScript dependencies, so your designers don't have to install dependencies
environment variables
sandbox outside of App Store on Mac OS X
large application

## Further reading
https://github.com/sindresorhus/awesome-electron

alternatives
http://nwjs.io/

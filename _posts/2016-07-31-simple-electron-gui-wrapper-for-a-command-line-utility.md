---
layout: post
title:  Simple Electron GUI Wrapper for a Command-Line Utility
date:   2016-07-31
categories: coding
thumbnail: /images/sprite-animation-generator.png
sharing: true
---

This post summarizes my experience building a simple Electron app. It guides you through providing a GUI for a command-line utility. It also provides a succinct overview of the few things you really need to know when you are just getting started.
 
 The source code of the finished [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator) -- which we'll be building -- is available on Github, as well as the source code of the original [command-line utility](https://github.com/karriereat/animation-strip-generator).



## What is Electron?

Electron enables you to build cross-platform desktop applications using Chromium and Node.js. It is used by the messaging apps [Franz](http://meetfranz.com/) and [Slack](https://slack.com/) or the open-source editors [Atom](https://atom.io/) and [Visual Studio Code](https://code.visualstudio.com/). A long list of apps is on [electron.atom.io/apps](http://electron.atom.io/apps/), if you are interested.



## What is Electron a great fit for?

There are compelling reasons for [building a desktop application rather than a web application](https://medium.com/@collinmathilde/why-desktop-apps-are-making-a-comeback-5b4eb0427647). But in my case the reason for choosing Electron was that it let's you build a graphical user interface just by using web technologies.

You can quickly create a graphical user interface wrapper for internal tools, for example automation for graphic designers. 
This has been done with other tools like [ImageOptim](https://imageoptim.com/mac), which uses eight different tools under the hood.

At karriere.at we experimented with sprite animations as an alternative to animating SVG with CSS, to shift a bit of workload from the programmers to the designers, while also giving the designers much more creative freedom. 

[Daniela](https://twitter.com/schmidxdaniela), one of my colleagues at karriere.at created a bell animation in After Effects and we then searched the web for a tool that let's her create a CSS sprite animation, but we found none. Most of the tools were concerned with packing icons for traditional icon sprites. 

<p id="bell"></p>

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

This is why I had created a Node.js [command-line utility](https://github.com/karriereat/animation-strip-generator) for creating sprite animations from image sequences.


~~~ bash
animation-strip-generator test/input test/output --name bell --fps 30
~~~

The above command will read the image sequence from `test/input` and create a strip at `test/input/bell.png`. The strip is then pushed through [pngquant](https://pngquant.org/) for compression. You also get the necessary CSS styles for the sprite animation.

![](/images/karriere.at-bell.png)

~~~ css
.animation {
    width: 109px;
    height: 75px;
    background: url(bell.png) left center;
    animation: play 1.4666666666666666s steps(44) infinite;
}
@keyframes play {
    100% { background-position: -4796px; }
}
~~~

This worked great, but in reality designers tend to avoid the Mac OS X Terminal or Windows Command Prompt. This is where Electron comes in handy to further support the designer's autonomy.



## The basic structure of an Electron app
http://electron.atom.io/docs/tutorial/quick-start/
https://github.com/electron/electron-quick-start

`package.json`
`main.js`
`index.html`

~~~ bash
npm install electron-prebuilt --save-dev
./node_modules/.bin/electron .
~~~



## What the API offers you
https://github.com/electron/electron-api-demos
http://electron.atom.io/docs/api/



## Communication between processes
http://electron.atom.io/docs/api/ipc-main/
http://electron.atom.io/docs/api/ipc-renderer/

The `ipcMain` and `ipcRenderer` modules are instances of the standard Node.js `EventEmitter` class. They can be used to communicate asynchronously between the main process and the renderer process.



## Building an interface
CSS
Foundation
![](/images/sprite-animation-generator.png)



## File dialogs
http://electron.atom.io/docs/api/dialog/



## Distribution
https://github.com/electron-userland/electron-packager

Package and distribute your Electron app with OS-specific bundles (.app, .exe etc) via JS or CLI

~~~ bash
./node_modules/.bin/electron-packager ./ --all`
~~~


* 146,2 MB on Mac OS X (55,3 MB when compressed for distribution)
* 160,4 MB on Windows (64,8 MB when compressed for distribution)

https://github.com/electron-userland/electron-builder
Complete solution to build ready for distribution and 'auto update' Electron App installers
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

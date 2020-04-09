---
layout: layouts/post.njk
permalink: /simple-electron-gui-wrapper-for-a-command-line-utility/index.html
title: Simple Electron GUI Wrapper for a Command-Line Utility
date: 2016-07-31
categories: [coding]
tags: [electron, animation]
thumbnail: /images/sprite-animation-generator.png
sharing: true
---

This post summarizes my experience building a simple Electron app. It guides you through providing a GUI for a command-line utility. It also provides a succinct overview of the few things you really need to know when you are just getting started.

The source code of the finished [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator) -- which we'll be building -- is available on Github, as well as the source code of the original [command-line utility](https://github.com/karriereat/animation-strip-generator).

![](/images/sprite-animation-generator.png)



## What is Electron?

Electron enables you to build cross-platform desktop applications using Chromium and Node.js. It is used by the messaging apps [Franz](http://meetfranz.com/) and [Slack](https://slack.com/) or the open-source editors [Atom](https://atom.io/) and [Visual Studio Code](https://code.visualstudio.com/). You can find a long list of apps on [electron.atom.io/apps](http://electron.atom.io/apps/), if you are interested.



## Why use Electron?

There are compelling reasons for [building a desktop application rather than a web application](https://medium.com/@collinmathilde/why-desktop-apps-are-making-a-comeback-5b4eb0427647). But in my case the reason for choosing Electron was that it let's you build a graphical user interface just by using your existing HTML/CSS and JavaScript knowledge.

You can quickly create a GUI wrapper for internal tools, for example automation for graphic designers.
This has been done with other tools like [ImageOptim](https://imageoptim.com/mac), which uses eight different tools under the hood.

At [karriere.at](http://www.karriere.at/) we experimented with sprite animations as an alternative to animating SVGs with CSS. This way we can shift a bit of workload from the programmers to the designers, while also giving the designers much more creative freedom.

One of my colleagues, [Daniela Schmid](https://twitter.com/schmidxdaniela), created a bell animation in After Effects and we then searched the web for a tool that would allow her to create a CSS sprite animation, which we didn't find. Most of the tools were concerned with packing icons for traditional icon sprites.

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

This is why I wrote a Node.js [command-line utility](https://github.com/karriereat/animation-strip-generator) for creating sprite animations from image sequences.

~~~ bash
animation-strip-generator example/input example/output --name bell --fps 30
~~~

The above command will read the image sequence from `example/input` and create a strip at `example/input/bell.png`. The strip is then pushed through [pngquant](https://pngquant.org/) for compression. You also get the necessary CSS styles for the sprite animation.

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

I highly recommend that you read the [Quick Start](http://electron.atom.io/docs/tutorial/quick-start/) tutorial on the official Electron page. It will tell you that you only need three files to get started:

* A `package.json` with at least a `name`, `version` and `main` property. Electron will load an `layout.js` file if there is no `main` specified.
* A `main.js` which requires the `electron` JavaScript module and runs the main process of your app. It creates web pages by creating `BrowserWindow` instances, each of which have their own renderer process.
* An `index.html` file. This file can include scripts that run in the renderer process. You have access to Node.js APIs in web pages, so you can do things you wouldn't be able to in a normal browser sandbox.

You should have a look at the files in the [Electron Quick Start](https://github.com/electron/electron-quick-start) repository, which you can clone and play around with. The bare minimum you have to write is as follows:

1. Create a `package.json` with the properties mentioned before and add a pre-compiled Electron binary via `npm install electron-prebuilt --save-dev`.
    ~~~ json
    {
        "name": "app",
        "version": "0.1.0",
        "main": "main.js",
        "devDependencies": {
            "electron-prebuilt": "^1.2.0"
        }
    }
    ~~~
2. Create a `main.js` and import `app` and `BrowserWindow` from the Electron API.
    ~~~ js
    const { app, BrowserWindow } = require('electron');
    let win;
    function createWindow() {
        win = new BrowserWindow({ width: 800, height: 600 });
        win.loadURL(`file://${__dirname}/index.html`);
    }
    app.on('ready', createWindow);
    ~~~
3. Create an `index.html`. The title will be used as your window’s title.
    ~~~ html
    <!doctype html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>App</title>
    </head>
    <body>
        You can use Node.js <script>document.write(process.versions.node)</script> in here!
    </body>
    </html>
    ~~~
4. Start your app with `./node_modules/.bin/electron .` or add an npm script in your `package.json` and start your app via `npm start`.
    ~~~ json
    {
        "name": "app",
        "version": "0.1.0",
        "main": "main.js",
        "scripts": {
            "start": "electron ."
        },
        "devDependencies": {
            "electron-prebuilt": "^1.2.0"
        }
    }
    ~~~



## What the API offers you

Developing an Electron app is basically requiring and using what the [Electron API](http://electron.atom.io/docs/api/) offers. The rest is familiar browser and Node.js coding.

To get an overview of what is possible download the [Electron API Demos](https://github.com/electron/electron-api-demos) app, which demonstrates the most important features of the API. You can control your application's life cycle, create and control browser windows, create native application menus and context menus or even add a tray icon to the system’s notification area.

For the Sprite Animation Generator we have to use the `app`, `BrowserWindow`, `ipcMain`, `ipcRenderer`, `remote` and `dialog` modules. The full [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator) on GitHub also uses `shell` and `Menu` for changing the application menu.



## Building an interface

Building an interface in Electron is just using your existing HTML/CSS skills. This means you have all the freedom you have in a web application, but at the same time your app won't look and feel native, if this is a concern to you. I have simply used the latest Foundation framework to speed things up. If you want your app to resemble Mac OS X you may like [Photon](http://photonkit.com/).



## Communication between processes

The `ipcMain` and `ipcRenderer` modules are instances of the standard Node.js `EventEmitter` class. They can be used to communicate asynchronously between the main process and the renderer process(es). In the Sprite Animation Generator the main process listens for form submission and then executes the `generator` function. It returns an event to the renderer process on success and failure, so the user can be notified.

~~~ js
const { ..., ipcMain } = require('electron');
const generator = require('animation-strip-generator');

function handleSubmission() {
    ipcMain.on('did-submit-form', (event, argument) => {
        const { source, destination, name, fps } = argument;
        generator(source, destination, name, fps).then(
            success => {
                console.log(success);
                event.sender.send('processing-did-succeed', success);
            },
            error => {
                console.log(error);
                event.sender.send('processing-did-fail', error);
            }
        );
    });
}

app.on('ready', () => {
    createWindow();
    handleSubmission();
});
~~~

The renderer process collects data from all existing form elements and submits it via an event to the main process. I have skipped the selection of DOM elements -- they are referenced in the `buttons` and `inputs` objects. Please have a look at the [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator) repository on GitHub for the full source code.

~~~ js
const { ..., ipcRenderer } = require('electron');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    ipcRenderer.send('did-submit-form', {
        source: inputs.source.value,
        destination: inputs.destination.value,
        name: inputs.name.value,
        fps: inputs.fps.value,
    });
});
~~~



## File dialogs

The renderer process in Electron is not allowed to call native GUI APIs, as this can be very dangerous. Therefore Electron's GUI modules are only available in the main process. You have to send an event and ask the main process to perform GUI operations. To make this simpler Electron provides a `remote` module.

The buttons labeled "Choose Directory" both have an event listener that displays a file dialog via the `dialog` module. The dialog in which the user gets prompted to select a destination folder also uses the `showOpenDialog()` function with an additional `createDirectory` property.

~~~ js
buttons.source.addEventListener('click', () => {
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (directory) {
        inputs.source.value = directory;
    }
});
~~~



## Distribution

If your app is finished you can use [Electron Packager](https://github.com/electron-userland/electron-packager) to package and distribute your app. Add it to your dependencies with `npm install electron-packager --save-dev` and execute it once with `./node_modules/.bin/electron-packager ./ --all`. This will generate packages for all platforms and architectures Electron can handle and may take a few minutes.

You can add an npm script that only builds the packages you need in your `package.json`. The `--prune` flag tells Electron Packager to prune unnecessary files, like npm modules that are listed as `devDependencies`. Be sure to add a `productName` field, because this is the name that Electron Packager uses for your app.

~~~ json
{
  "name": "sprite-animation-generator",
  "productName": "Sprite Animation Generator",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-packager ./ --platform=darwin,win32 --arch=x64 --prune --overwrite"
  },
  "dependencies": {
    "animation-strip-generator": "https://github.com/karriereat/animation-strip-generator.git#master"
  },
  "devDependencies": {
    "electron-packager": "^7.3.0",
    "electron-prebuilt": "^1.2.0"
  }
}
~~~

This is all you need to create an app you can send to your friends and colleagues. If you want to publish an app you should use [Electron Builder](https://github.com/electron-userland/electron-builder), which is a complete solution for creating installers. It uses the Electron Packer under the hood and deals with additional concerns like icons, code signing, version management and updating your apps automatically.



## Conclusion

Working with Electron is fun and entertaining, once you have grasped the few underlying concepts. The API is well documented and there is a great community building tools and offering learning ressources. There are some minor problems, though. The most commonly mentioned is the large size of application packages. This is the size of the Sprite Animation Generator applications after running `npm run build`:

* 146,2 MB on Mac OS X (55,3 MB zipped)
* 160,4 MB on Windows (64,8 MB zipped)

Another problem I have encountered is working with third-party binaries. I have tried to bundle ImageMagick in the [Sprite Animation Generator](https://github.com/karriereat/sprite-animation-generator), as I don't want our designers to install dependencies before using tools. Eventually I used [jimp](https://github.com/oliver-moran/jimp), which is entirely written in JavaScript. I do know it is possible to bundle ImageMagick and will most likely invest energy on this in the future.

Electron is of course not the only framework that allows you to build desktop applications with web technologies. A popular alternative is [NW.js](http://nwjs.io/) and there are also commercial contenders like [Tint](https://www.trueinteractions.com/index.html).

If you want to dive deeper into building desktop applications with Electron have a look at [Awesome Electron](https://github.com/sindresorhus/awesome-electron), a list of useful ressources curated by Sindre Sorhus. It also features a list of open-source apps, which I find immensely valuable. You can read other people's code and see how the API is being used in various applications. You also see different ways of structuring your app, from simple projects to large projects like Atom.

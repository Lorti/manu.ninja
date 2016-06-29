---
layout: post
title:  WebGL 3D Model Viewer Using three.js
date:   2016-06-30
categories: [art, coding, games]
---

You can create a WebGL model viewer in just a few lines of code using [three.js][1]. This tutorial shows you all you need to get started. The final code is on [GitHub](https://github.com/Lorti/webgl-3d-model-viewer-using-three.js) and you can see  the viewer in action showing a low-poly model that I made for an unfinished Space Western game.

<div class="FlexEmbed">
    <div class="FlexEmbed-ratio FlexEmbed-ratio--16by9">
        <iframe class="FlexEmbed-content" src="/files/webgl-3d-model-viewer-using-three-js"></iframe>
    </div>
</div>

## What do you need?

* Your model in OBJ format. If you do not know how to export your model, please take a look at the manual of Blender, 3ds Max, Maya, Lightwave, Modo or whatever modeling software you are using.

* You textures in a format that three.js can handle (PNG, JPG, DDS…), preferably as square power-of-two textures.

* An accompanying MTL file, which your software will generate automatically. This file references your textures and specifies the materials of your model.

* The latest build of the [three.js library](https://github.com/mrdoob/three.js/tree/master/build), mine is 76.

* Some other scripts that are hidden in the treasure trove that is the three.js GitHub repository.
    * [Detector](https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js), which detects if your browser can handle WebGL.
    * [OBJLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js) and [MTLLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/MTLLoader.js) for loading your files.
    * [OrbitControls](https://github.com/mrdoob/three.js/blob/master/examples/js/controls/OrbitControls.js) for controlling a camera that looks at and orbits around your model.

Put the files in a folder and reference them in a simple HTML page as in the code snippet below. I also recommend you to set a neutral color for the background.

## Camera

## Scene

## Lighting

## Model

## Renderer

## Controls

[1]: http://threejs.org/

---
layout: post
title:  WebGL/three.js Annotations
date:   2017-05-22
categories: coding
thumbnail: /images/webgl-three-js-annotations.png
sharing: true
summary: How do you add a comment box or annotation box to a WebGL object as seen on Sketchfab? When using WebGL you can harness the power of one of the world's most versatile GUI layers, which is HTML, CSS and JavaScript.
---

How do you add a comment box or annotation box to a WebGL object as seen on [Sketchfab][Dodo]? Engines usually provide a separate GUI layer, which consists of polygons and textures rendered after the game or visualization itself. Take a look at [Unity] or [Unreal Engine] for examples[<sup>1</sup>](#1). When using WebGL you can harness the power of one of the world's most versatile GUI layers, which is HTML, CSS and JavaScript.

<p data-height="480" data-theme-id="0" data-slug-hash="Vbppap" data-default-tab="result" data-user="Lorti" data-embed-version="2" data-pen-title="WebGL Annotations (three.js)" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/Vbppap/">WebGL Annotations (three.js)</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Setup

For this example we'll use a basic three.js setup as described in [WebGL 3D Model Viewer Using three.js], or any of the various three.js examples in the official repository. The object we'll annotate is a simple box with a width, height and depth of 500 units.

``` js
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(500, 500, 500),
    new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    })
);
scene.add(mesh);
```

## Screen Projection

The annotation is glued to one of the corners, represented by `THREE.Vector3(250, 250, 250)`{:.js}. To draw the annotation using DOM elements we have to project this point onto the screen. For this purpose three.js has a helper method `vector.project()`{:.js}. It converts the 3D coordinates to 2D coordinates between `-1`{:.js} and `1`{:.js}, `0`{:.js} being the center of the screen. 

``` js
const vector = new THREE.Vector3(250, 250, 250);
const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer

vector.project(camera); // `camera` is a THREE.PerspectiveCamera

vector.x = Math.round((vector.x + 1) * canvas.width / 2);
vector.y = Math.round((-vector.y + 1) * canvas.height / 2);

const annotation = document.querySelector('.annotation');
annotation.style.top = `${vector.y}px`;
annotation.style.left = `${vector.x}px`;
```

You can use these coordinates to get the top and left offset relative to the `canvas`{:html} element. This is already enough to go ahead and style your annotations. There are a few adaptations you might want to consider, though.

## Transfer the Annotation Marker to WebGL/three.js

Drawing the annotation box with HTML/CSS is great. You don't have to worry about typography and layout in WebGL. But you might want to have your marker as a 3D object, to accurately reflect the position you're annotating. To see this in action in my [CodePen]

1. remove the `::before`{:.css} pseudo-element starting at line 20 of the CSS
2. and display the 3D marker by removing `sprite.material.opacity = 0;`{:.js} in line 160 of the JavaScript.

### Draw the Annotation Marker on a 2D Canvas

To display the annotation marker in your scene you'll have to create a texture that can be mapped to polygons. three.js can load the bitmap data of other canvases and convert it to WebGL textures. Therefore we'll draw a few shapes that look like the recently removed CSS pseudo-element[<sup>2</sup>](#2).

``` js
const canvas = document.getElementById('number');
const ctx = canvas.getContext('2d');
const x = 32;
const y = 32;
const radius = 30;
const startAngle = 0;
const endAngle = Math.PI * 2;

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.fill();

ctx.strokeStyle = 'rgb(255, 255, 255)';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.stroke();

ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.font = '32px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('1', x, y);
```

### Load the Annotation Marker in the 3D Scene

A sprite is a plane that always faces towards the camera, which is exactly what we want for the annotation marker. You can load the texture by passing the canvas element to `THREE.CanvasTexture()`{:.js} and create a sprite material with `depthTest`{:.js} and `depthWrite`{:.js} set to `false`{:.js}. This will draw the marker always on top of your object.

``` js
const numberTexture = new THREE.CanvasTexture(
    document.querySelector('#number')
);

const spriteMaterial = new THREE.SpriteMaterial({
    map: numberTexture,
    alphaTest: 0.5,
    transparent: true,
    depthTest: false,
    depthWrite: false
});

sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(250, 250, 250);
sprite.scale.set(35, 35, 1);

scene.add(sprite);
```

## Fade the Annotation Marker when it's behind an Object

Both the 2D and 3D annotation markers are drawn on top of the object. It is not obvious to the user if the marker is in front or behind the object. An elegant solution to this is to lower the opacity of the CSS pseudo-element or sprite when the annotation vector is farther from the camera than the objects center. This way the user still sees the marker but also knows, if it is behind the object.

``` js
const meshDistance = camera.position.distanceTo(mesh.position);
const spriteDistance = camera.position.distanceTo(sprite.position);
spriteBehindObject = spriteDistance > meshDistance;

sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
```

## Footnotes

1. <a name="1"></a>[CryEngine] even uses [Scaleform], a technology based on Flash, if you want to use those dusty ActionScript skills you have aquired years ago.

2. <a name="2"></a>You can also draw a few markers in Photoshop, if you want. You might also consider creating a packed spritesheet for performance or animated markers.

[Dodo]: https://sketchfab.com/models/ad10226b4f7a451ea23920a556c72a90
[CodePen]: http://codepen.io/Lorti/pen/Vbppap/
[Unity]: https://docs.unity3d.com/Manual/UISystem.html
[Unreal Engine]: https://docs.unrealengine.com/latest/INT/Engine/UMG/
[CryEngine]: http://docs.cryengine.com/display/SDKDOC4/User+Interface
[Scaleform]: https://www.autodesk.com/products/scaleform/overview
[WebGL 3D Model Viewer Using three.js]: https://manu.ninja/webgl-3d-model-viewer-using-three-js

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

The annotation is glued to one of the corners, represented by `THREE.Vector3(250, 250, 250)`{:.js}.

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

## Transfer the Annotation Marker to WebGL/three.js

### Draw the Annotation Marker on a 2D Canvas

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

``` js
const meshDistance = camera.position.distanceTo(mesh.position);
const spriteDistance = camera.position.distanceTo(sprite.position);
spriteBehindObject = spriteDistance > meshDistance;

sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
```

line 20 in the CSS panel
line 160 in the JavaScript panel

``` js
// Do you want a number that changes size according to its position?
// Comment out the following line and the `::before` pseudo-element.
sprite.material.opacity = 0;
```



## Footnotes

1. <a name="1"></a>[CryEngine] even uses [Scaleform], a technology based on Flash, if you want to use those dusty ActionScript skills you have aquired years ago.



[Dodo]: https://sketchfab.com/models/ad10226b4f7a451ea23920a556c72a90
[Unity]: https://docs.unity3d.com/Manual/UISystem.html
[Unreal Engine]: https://docs.unrealengine.com/latest/INT/Engine/UMG/
[CryEngine]: http://docs.cryengine.com/display/SDKDOC4/User+Interface
[Scaleform]: https://www.autodesk.com/products/scaleform/overview
[WebGL 3D Model Viewer Using three.js]: https://manu.ninja/webgl-3d-model-viewer-using-three-js

---
path: /webgl-three-js-annotations
title:  WebGL/three.js Annotations
date:   2017-05-30
categories: [art, coding, games]
thumbnail: /images/webgl-three-js-annotations.png
sharing: true
summary: How do you add a comment box or annotation box to a WebGL object as seen on Sketchfab? This tutorial features a working example on CodePen and explains the essential code segments.
---

How do you add a comment box or annotation box to a WebGL object as seen on [Sketchfab][Dodo]? This tutorial features a working example on [CodePen] and explains the essential code segments.

Engines usually provide a separate UI layer, which consists of polygons and textures rendered after the game or visualization itself. Take a look at [Unity] or [Unreal Engine] for examples[<sup>1</sup>](#1). When you're in a browser you can harness the power of HTML, CSS and JavaScript, providing one of the world's most versatile UI layers. WebGL is good at handling geometry and transformations, but the browser itself is far better at handling typography and layout.

<p data-height="480" data-theme-id="0" data-slug-hash="Vbppap" data-default-tab="result" data-user="Lorti" data-embed-version="2" data-pen-title="WebGL Annotations (three.js)" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/Vbppap/">WebGL Annotations (three.js)</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Setup

For this example we'll use a basic three.js setup as described in [WebGL 3D Model Viewer Using three.js]. You can also use any of the various three.js examples in the official repository[<sup>2</sup>](#2). The object we'll annotate is a simple box with a width, height and depth of 500 units.

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

The annotation is glued to one of the boxes' corners, represented by `THREE.Vector3(250, 250, 250)`. To draw the annotation using DOM elements we have to project this point to screen space. 

For this purpose three.js has a helper method `vector.project()`. It converts 3D coordinates to 2D coordinates between `-1` and `1`, `0` being the center of the screen. These are called normalized device coordinates (NDCs) in computer graphics.  

``` js
const vector = new THREE.Vector3(250, 250, 250);
const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer

vector.project(camera); // `camera` is a THREE.PerspectiveCamera

vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

const annotation = document.querySelector('.annotation');
annotation.style.top = `${vector.y}px`;
annotation.style.left = `${vector.x}px`;
```

You can use these coordinates to get the top and left offset relative to the `canvas` element. This is already enough to go ahead and style your annotations. Although, there are a few possible modifications, which we'll discuss in the next sections.

## Transfer the Annotation Marker to WebGL/three.js

Drawing the annotation box with HTML/CSS is great. You don't have to worry about typography and layout in WebGL. But you might want to have your marker as a 3D object, to accurately reflect the position you're annotating. To see this in action you only have to change minor things in my [CodePen]:

1. Remove the `::before` pseudo-element starting at line 20 of the CSS.
2. Display the 3D marker by removing `sprite.material.opacity = 0;` in line 160 of the JavaScript.

### Draw the Annotation Marker on a 2D Canvas

To display the annotation marker in your scene you'll have to create a material that can be applied to geometry. three.js can load the bitmap data of other canvases and convert it to WebGL textures. Therefore we'll draw a few shapes that look like the recently removed CSS pseudo-element[<sup>3</sup>](#3).

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

A sprite is a plane that always faces towards the camera, which is exactly what we want for the annotation marker. You can convert your drawing to a texture by passing the canvas element to `THREE.CanvasTexture`, which is then used for a `THREE.SpriteMaterial`. `depthTest` and `depthWrite` set to `false`, which tells three.js to always draw the marker on top of the object.

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

The 2D marker and 3D marker are both drawn on top of the object. It may not be obvious to the user whether the marker is in front or behind the object. An elegant solution to that problem is to lower the opacity of the CSS pseudo-element or sprite when the annotation vector is farther from the camera than the objects center. This way the user still sees the marker at any time, but can easily tell if it's behind the object.

``` js
const meshDistance = camera.position.distanceTo(mesh.position);
const spriteDistance = camera.position.distanceTo(sprite.position);
spriteBehindObject = spriteDistance > meshDistance;

sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
```

## Conclusion

It's not difficult to display WebGL/three.js annotations in a browser when using each technology for its strengths. Look at my [CodePen] for the full code and leave a comment if you have further questions or suggestions.

## Footnotes

1. <a name="1"></a>[CryEngine] even uses [Scaleform], a technology based on Flash, if you want to use those dusty ActionScript skills you have aquired years ago.
1. <a name="3"></a>You don't have to use three.js, the concepts apply to plain WebGL as well.
1. <a name="2"></a>You can also draw a few markers in Photoshop, if you want. You might also consider creating a packed spritesheet for performance or animated markers.

[Dodo]: https://sketchfab.com/models/ad10226b4f7a451ea23920a556c72a90
[CodePen]: http://codepen.io/Lorti/pen/Vbppap/
[Unity]: https://docs.unity3d.com/Manual/UISystem.html
[Unreal Engine]: https://docs.unrealengine.com/latest/INT/Engine/UMG/
[CryEngine]: http://docs.cryengine.com/display/SDKDOC4/User+Interface
[Scaleform]: https://www.autodesk.com/products/scaleform/overview
[WebGL 3D Model Viewer Using three.js]: https://manu.ninja/webgl-3d-model-viewer-using-three-js

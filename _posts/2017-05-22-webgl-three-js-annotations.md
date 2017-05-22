---
layout: post
title:  WebGL/three.js Annotations
date:   2017-05-22
categories: coding
thumbnail: /images/web-push-notifications.png
sharing: true
---

How can you add a comment box or annotation box to a WebGL object as seen on [Sketchfab][Dodo]?

<p data-height="265" data-theme-id="0" data-slug-hash="Vbppap" data-default-tab="js,result" data-user="Lorti" data-embed-version="2" data-pen-title="WebGL Annotations (three.js)" class="codepen">See the Pen <a href="http://codepen.io/Lorti/pen/Vbppap/">WebGL Annotations (three.js)</a> by Manuel Wieser (<a href="http://codepen.io/Lorti">@Lorti</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Setup

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

[Dodo]: https://sketchfab.com/models/ad10226b4f7a451ea23920a556c72a90

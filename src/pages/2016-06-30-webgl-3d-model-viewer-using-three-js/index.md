---
path: /webgl-3d-model-viewer-using-three-js
title: WebGL 3D Model Viewer Using three.js
date: 2016-06-30
categories: [art, coding, games]
tags: [three-js, webgl]
summary: You can create a WebGL 3D model viewer in just a few lines of code using three.js. This tutorial shows you all you need to get started. The final code is on GitHub and you can see the viewer in action showing a low-poly model that I made for an unfinished Space Western game.
thumbnail: /images/webgl-3d-model-viewer.jpg
sharing: true
---

You can create a WebGL 3D model viewer in just a few lines of code using [three.js][threejs]. This tutorial shows you all you need to get started. The final code is on [GitHub][github] and you can see the viewer in action showing a low-poly model that I made for an unfinished Space Western game.

<div class="FlexEmbed">
    <div class="FlexEmbed-ratio FlexEmbed-ratio--16by9">
        <iframe class="FlexEmbed-content" src="https://static.manu.ninja/files/webgl-3d-model-viewer-using-three-js/"></iframe>
    </div>
</div>

You may want to open the above [WebGL 3D model viewer][example] to experience it full screen and toggle three-point lighting by pressing the `L` key.

## What do you need?

* Your model in OBJ format. If you do not know how to export your model, please take a look at the manual of Blender, 3ds Max, Maya, Lightwave, Modo or whatever modeling software you are using.

* You textures in a format that three.js can handle (PNG, JPG, DDS…), preferably as square power-of-two textures.

* An accompanying MTL file, which your software will generate automatically. This file references your textures and specifies the materials of your model.

* The latest build of the [three.js library](https://github.com/mrdoob/three.js/tree/master/build), mine is r76.

* Some other scripts that are hidden in the treasure trove that is the three.js GitHub repository.
    * [Detector](https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js), which detects if your browser can handle WebGL.
    * [OBJLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js) and [MTLLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/MTLLoader.js) for loading your files.
    * [OrbitControls][orbit] for controlling a camera that looks at and orbits around your model.

Put the files in a folder and reference them in a simple HTML page as in the code snippet below. I also recommend you to set a neutral color for the background.

~~~ html
<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script src="three.js"></script>
    <script src="Detector.js"></script>
    <script src="OrbitControls.js"></script>
    <script src="OBJLoader.js"></script>
    <script src="MTLLoader.js"></script>

    <style>
        body {
            overflow: hidden;
            margin: 0;
            padding: 0;
            background: hsl(0, 0%, 10%);
        }
    </style>

</head>
<body>

    <script>
        // You can put all the example code in a separate file or just add it here for simplicity.
        // Also no ES6 today, so we don't need a build setup ;)
    </script>

</body>
</html>
~~~

## Setup

This three.js application is structured into initialization (`init()`) and a render loop (`render()`). We also need a container to put our renderer in, so we create an empty element. You could of course also select an already existing element.

~~~ js
// The detector will show a warning if the current browser does not support WebGL.
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

// All of these variables will be needed later, just ignore them for now.
var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Code...
}

function render() {
    // Code...
}

~~~

## Camera

The first thing we do in our `init()` function is creating a [perspective camera](http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera). The arguments are sensible defaults. If your model is very large you may have to adjust the last two arguments, which are the frustum near plane and frustum far plane. They basically state that nothing nearer than one unit and nothing farther than a thousand units will be rendered.

~~~ js
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 3;
~~~

## Scene

A scene holds your camera(s), lights and models, as it would do in real life. The code below adds a white [ambient light](http://threejs.org/docs/#Reference/Lights/AmbientLight) which illuminates the whole scene without any shading.

~~~ js
scene = new THREE.Scene();
ambient = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambient);
~~~

## Lighting

Do you want your scene to have more sophisticated lighting? It's very easy to add [three-point lighting](https://en.wikipedia.org/wiki/Three-point_lighting) to your scene using [directional lights](http://threejs.org/docs/#Reference/Lights/DirectionalLight). You should dim the ambient light by setting the second argument to `0.25` or remove it altogether to see the effect.

~~~ js
keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
~~~

You can toggle three-point lighting by pressing the `L` key in my [example][example], but that is just because the model is intended to be rendered without any lighting, as the light information is painted into the texture.

If you want to further enhance your scene you might want to upgrade the directional lights to [spot lights](http://threejs.org/docs/#Reference/Lights/SpotLight), but they require some additional setup.

## Model

The `MTLLoader` and `OBJLoader` are pretty self-explanatory. They both require a file path and a callback function. If you want to translate, rotate or scale your object simply change the properties listed in the [Object3D](http://threejs.org/docs/#Reference/Core/Object3D) documentation. You can do so by setting the x, y and z values of the [Vector3](https://threejs.org/docs/api/math/Vector3.html) independently or with the `set(x, y, z)` method.

You can safely omit the two filter settings as I have needed them for the pixelated look of my model to keep the texture sharp. You can read about [texture filtering](http://threejs.org/docs/#Reference/Textures/Texture) in the three.js documentation.

~~~ js
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setBaseUrl('assets/');
mtlLoader.setPath('assets/');
mtlLoader.load('female-croupier-2013-03-26.mtl', function (materials) {

    materials.preload();

    materials.materials.default.map.magFilter = THREE.NearestFilter;
    materials.materials.default.map.minFilter = THREE.LinearFilter;

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('female-croupier-2013-03-26.obj', function (object) {

        scene.add(object);

    });

});
~~~

## Renderer

Up until now, nothing is rendered onto the canvas. We have to create a [renderer](http://threejs.org/docs/#Reference/Renderers/WebGLRenderer) and add it as a child of our container element. The render loop itself is an infinite loop calling itself at 60 frames per second using `window.requestAnimationFrame()`. It updates the controls that we are going to add in the next step and tells the renderer to render the scene using our only camera.

~~~ js
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

container.appendChild(renderer.domElement);
~~~

~~~ js
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
~~~

## Controls

The last thing we have to do is to initialize the orbit controls. You can specify a damping to smooth out camera movement, as well as some other options. Have a look at the variables in the beginning of the [source code][orbit] to see what's possible.

~~~ js
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
~~~

## Conclusion

Congratulations on creating a WebGL 3D model viewer with three.js. The full example is available on [GitHub][github] to be forked and modified. If you want to dive deeper into three.js head over to the extensive [documentation](http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene) and browse the [examples](http://threejs.org/examples/). The three.js home page also features a lot of inspirational [projects][threejs] which are worth checking out.



[threejs]: http://threejs.org/
[orbit]: https://github.com/mrdoob/three.js/blob/master/examples/js/controls/OrbitControls.js
[example]: https://static.manu.ninja/files/webgl-3d-model-viewer-using-three-js/
[github]: https://github.com/Lorti/webgl-3d-model-viewer-using-three.js

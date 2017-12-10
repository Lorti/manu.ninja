---
path: /game-graphics-with-webgl-three-js-and-lazy-loading-of-3d-models
title: Game Graphics with WebGL/three.js and Lazy-Loading of 3D Models
date: 2017-11-22
categories: [art, coding, games]
tags: [rxjs, functional-reactive-programming, three-js, lazy-loading]
thumbnail: /images/corsair.jpg
---

This is the third part in a series on creating a game with RxJS 5, Immutable.js and three.js. We'll look at rendering the game graphics in 3D, using WebGL and the three.js library. The goal of this part is to have a 3D scene that's updated according to the Immutable.js collection returned by our game state stream.

The full [Corsair] game, which we're developing in this series, is available on GitHub. You can clone it, play it and read the full source code while reading this article, if you want. All parts of the series are listed in [Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js].

<video style="margin-left: auto; margin-right: auto;" controls preload="auto" loop>
    <source src="/images/corsair.mp4" type="video/mp4">
</video>



## Scene setup

A scene holds your camera(s), lights and models, as it would do in real life. You create a scene by calling `new THREE.Scene()` and then add objects with the `add()` method. We'll look at different objects later, but for now the most important object is the camera.

There are different camera types in three.js. We'll be using a `THREE.PerspectiveCamera`, as it gives us a 3D perspective projection. The various parameters define the camera's [viewing frustrum](https://en.wikipedia.org/wiki/Viewing_frustum). Please refer to the three.js documentation and [Optional helpers](#optional-helpers) section for details.

To render the scene you have to create a `THREE.WebGLRenderer`. The renderer has a `domElement` property, which is the `canvas` element where the renderer draws its WebGL graphics. You can add it anywhere to your page, but we'll add it to the body and use the whole browser viewport. 

~~~js
function setup() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 200);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // We'll discuss lighting later...

    const circle = circleFactory();
    scene.add(circle);

    const ship = shipFactory();
    const water = waterFactory();
    const island = islandFactory();
    const coins = new THREE.Object3D();
    const cannonballs = new THREE.Object3D();

    scene.add(ship);
    scene.add(water);
    scene.add(island);
    scene.add(coins);
    scene.add(cannonballs);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    return (state) => {
        // Update all scene objects by reading the Immutable.js state...
        renderer.render(scene, camera);
        $score.innerHTML = state.get('score');
    };
}
~~~

Please notice that the `setup` function returns a function that's receiving the game state, we've previously defined in the [Game State with RxJS 5/Immutable.js] part of this series. First the function updates all scene objects by reading the Immutable.js state. Then it renders the scene and updates the score display, which is just a DOM element sitting on top of the WebGL canvas. We'll discuss the details in the [Updating scene objects and animation](#updating-scene-objects-and-animation) section.



## Lighting

three.js offers a few different lights. The one we'll be using are an ambient light, a hemisphere light and a directional light. The ambient light is the simplest option and brightens the whole scene. It does not have a direction nor can it cast any shadows.

~~~js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
ambientLight.color.setHSL(0.1, 1, 0.95);
scene.add(ambientLight);
~~~

The hemisphere light has two colors, one for the sky and one for the ground. The sky color will be used for the highest point of the hemisphere, directly on top of the scene. The sky color then fades to the ground color. We can use the hemisphere light to simulate outdoor conditions, but like the ambient light, it can not cast any shadows.

~~~ js
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
hemisphereLight.color.setHSL(0.6, 1, 0.95);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 0, 500);
scene.add(hemisphereLight);
~~~

This is where the third light, the directional light, comes in. It is our sun and casts shadows.

~~~js
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
directionalLight.color.setHSL(0.1, 1, 0.95);
directionalLight.position.set(-1, 1, 1);
directionalLight.position.multiplyScalar(50);
directionalLight.castShadow = true;
scene.add(directionalLight);
~~~

For the shadow map to work correctly we have to tweak a few settings.
 
~~~js
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 200;
~~~



## Adding objects via primitive geometries

Now that the scene's perfectly set up we want to populate it with 3D objects. Some of them can be created by using primitive geometries: boxes, circles, cylinders, planes and spheres.

There is a built-in `CircleGeometry`, but we just want a circle line, not a circle surface, for the ship's course. To achieve this we can use the `THREE.LineBasicMaterial` and build the geometry ourselves, by pushing vertices into a `THREE.Geometry`. The geometry and material are then combined to form a `THREE.Line` object.

~~~js
function circleFactory() {
    const segmentCount = 64;
    const radius = RADIUS;
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF, opacity: 0.1, transparent: true });

    for (let i = 0; i <= segmentCount; i++) {
        const theta = (i / segmentCount) * Math.PI * 2;
        geometry.vertices.push(
            new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0),
        );
    }

    return new THREE.Line(geometry, material);
}
~~~

The water mesh is just a simple plane. The material is what makes it interesting: A `THREE.ShadowMaterial` is transparent but receives shadows. This way the page's CSS gradient shines through the scene. For this to work we had to create the renderer with the `{ alpha: true }` setting in the [Scene setup](#scene-setup) section.

~~~js
function waterFactory() {
    const geometry = new THREE.PlaneBufferGeometry(500, 500);
    const material = new THREE.ShadowMaterial({ opacity: 0.25 });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    return plane;
}
~~~

Each coin mesh is a scaled `CylinderGeometry`. The `MeshPhongMaterial` has shininess and specular settings, ideal for glossy surfaces like metal. As the cylinder geometry is generated along the Y axis we have to rotate the coins, because my scene's up vector is on the Z axis.

~~~js
function coinFactory() {
    const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 0.5, 16),
        new THREE.MeshPhongMaterial({
            color: 0xffd800,
            shininess: 32,
            specular: 0xffff82,
        }),
    );
    cylinder.rotation.x = Math.PI / 2;
    cylinder.castShadow = true;
    return cylinder;
}
~~~

The cannonballs are just plain spheres with a shiny material, casting shadows.

~~~js
function cannonballFactory() {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshPhongMaterial({
            color: 0x23232d,
            shininess: 64,
            specular: 0x646478,
        }),
    );
    sphere.castShadow = true;
    return sphere;
}
~~~



## Adding objects via lazy-loading of 3D models

The ship and island are 3D models I've created in a 3D modeling software and exported as OBJ/MTL pairs. To load them you can use the `OBJLoader` and `MTLLoader` which are located in the examples folder of the official three.js repository. There's also a Collada loader, if you need animation support. I'll stick with OBJ for my static objects, as I don't need animations and virtually every software can read and write OBJ files.

The `MTLLoader` and `OBJLoader` both require a file path and a callback function. I wrap both of these callbacks in a promise, which gives me an easy to use `loadAsset()` function, which takes the name of the asset as an argument, and resolves to the fully loaded and decorated 3D model.

~~~js
function loadAsset(name) {
    return new Promise((resolve, reject) => {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('assets/');
        mtlLoader.load(`${name}.mtl`, (materials) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('assets/');
            objLoader.load(`${name}.obj`, object => resolve(object), undefined, xhr => reject(xhr));
        }, undefined, xhr => reject(xhr));
    });
}
~~~

The ship gets loaded via `loadAsset('ship')` and then added to an empty `THREE.Object3D()`. This way we can return the empty object immediately and start the game before the asset is fully loaded. With this lazy-loading of 3D models we could also render a placeholder object in the meantime, like a sphere or a model with less level of detail than the original. Most modern 3D games use such LOD rendering techniques.

As the ship has multiple shapes we need to traverse them and set each node to cast shadows. For the ship's sail we also want the materials to be rendered double-sided.

~~~js
function shipFactory() {
    const container = new THREE.Object3D();
    //container.add(wireframeSphereFactory(6));
    loadAsset('ship').then((ship) => {
        ship.traverse((node) => {
            node.castShadow = true;
            if (node.material) {
                node.material.side = THREE.DoubleSide;
            }
        });
        ship.scale.multiplyScalar(12);
        ship.rotation.set(Math.PI / 2, Math.PI, 0);
        container.add(ship);
    });
    return container;
}
~~~

The island is loaded in the same way as the ship, using the `loadAsset()` lazy-loading function.

~~~js
function islandFactory() {
    const container = new THREE.Object3D();
    loadAsset('island').then((island) => {
        island.scale.multiplyScalar(32);
        island.rotation.set(Math.PI / 2, 0, 0);
        island.position.set(0, 0, -8.5);
        island.traverse((node) => {
            node.castShadow = true;
        });
        container.add(island);
    });
    return container;
}
~~~



## Updating scene objects and animation

Now that we've populated our scene with various 3D objects we want to give life to them. 

~~~js
return (state) => {
    // Update all scene objects by reading the Immutable.js state...
    renderer.render(scene, camera);
    $score.innerHTML = state.get('score');
};
~~~

~~~js
if (!coins.children.length) {
    state.get('coins').forEach((coin) => {
        const mesh = coinFactory();
        const position = polarToCartesian(coin.get('angle'), coin.get('radius'));
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        coins.add(mesh);
    });
}
for (let i = 0; i < state.get('coins').size; i++) {
    coins.children[i].visible = !state.getIn(['coins', i, 'collected']);
}
~~~

~~~js
if (!cannonballs.children.length) {
    for (let i = 0; i < 25; i++) {
        cannonballs.add(cannonballFactory());
    }
}
for (let i = 0; i < cannonballs.children.length; i++) {
    cannonballs.children[i].visible = false;
}
for (let i = 0; i < state.get('cannonballs').size; i++) {
    const cannonball = cannonballs.children[i];
    if (!cannonball) {
        cannonballs.add(cannonballFactory());
    } else {
        const position = polarToCartesian(
            state.getIn(['cannonballs', i, 'angle'], 0),
            state.getIn(['cannonballs', i, 'radius'], 0),
        );
        cannonball.position.x = position.x;
        cannonball.position.y = position.y;
        cannonball.visible = true;
    }
}
~~~

~~~js
ship.rotation.z = state.getIn(['player', 'angle']) - (state.getIn(['player', 'direction']) > 0 ? 0 : Math.PI);
const position = polarToCartesian(state.getIn(['player', 'angle']), state.getIn(['player', 'radius']));
ship.position.x = position.x;
ship.position.y = position.y;
~~~



## Optional helpers

~~~js
function wireframeSphereFactory(size) {
    const geometry = new THREE.SphereBufferGeometry(size, size, size);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    return line;
}
~~~

~~~js
const axisHelper = new THREE.AxisHelper(10);
scene.add(axisHelper);
~~~

~~~js
camera.position.set(0, -100, 30);
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
~~~

~~~js
const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(cameraHelper);
~~~



## Using the render function

The render loop itself is an infinite loop calling itself at 60 frames per second using the `animationFrame` RxJS scheduler.

~~~js
game(stage, score).subscribe({
    next: (state) => {
        render(state);
        // Test the game's end conditions...
    },
    error: error => console.error(error),
    complete: () => start(progress.stage, progress.score),
});
~~~



## References

* [Corsair]
* [RxJS 5](http://reactivex.io/rxjs/)
* [Immutable.js](https://facebook.github.io/immutable-js/)
* [three.js](https://threejs.org/docs/)



[Corsair]: https://github.com/Lorti/corsair
[Functional Reactive Game Programming – RxJS 5, Immutable.js and three.js]: functional-reactive-game-programming-rxjs-5-immutable-js-and-three-js
[Game State with RxJS 5/Immutable.js]: game-state-with-rxjs-5-immutable-js

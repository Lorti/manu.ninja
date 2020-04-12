---
layout: layouts/post.njk
permalink: /25-real-world-applications-using-webgl/
description: Whenever I’ve tried to explain the fascination of WebGL I failed to think of examples apart from demos, experiments and games. Since then I’ve done research and collected 25 inspiring real-world applications using WebGL/WebVR.

title: 25+ Real-World Applications Using WebGL
date: 2018-06-17
categories: [coding, games]
tags: [business, interaction-design, three-js, webgl]
thumbnail: /images/webgl-examples/biodigital-human.jpg
---

Whenever I've tried to explain the fascination of WebGL I failed to think of examples apart from demos, experiments and games. Since then I've done research and collected 25 inspiring real-world applications using WebGL/WebVR.

If you're inclined to delve into 3D graphics on the web, and create something of your own, check out my [WebGL Examples](https://github.com/Lorti/webgl-examples), the popular [three.js](https://threejs.org/) and [A-Frame](https://aframe.io/) libraries, or the [Unity](https://unity3d.com/) and [PlayCanvas](https://playcanvas.com/) game engines.

What is WebGL, though?

<blockquote>

WebGL is a cross-platform, royalty-free web standard for a low-level 3D graphics API based on OpenGL ES, exposed to ECMAScript via the HTML5 &lt;canvas&gt; element.

WebGL brings plugin-free 3D to the web, implemented right into the browser. Major browser vendors Apple, Google, Microsoft, and Mozilla are members of the WebGL Working Group.

OpenGL ES is a cross-platform API for rendering advanced 2D/3D graphics on embedded and mobile systems. It consists of a well-defined subset of OpenGL suitable for low-power devices, such as appliances, phones or vehicles.

OpenGL ES is the “most widely deployed 3D graphics API in history”.

<a href="https://www.khronos.org/">The Khronos Group</a>

</blockquote>

## Maps

The most widely known example for WebGL is [Google Maps'](https://goo.gl/maps/1Q1YxF4zckJ2) terrain view. Any form of topographic map or spatial arrangement can greatly benefit from 3D representations.

[![Google Maps](/images/webgl-examples/google-maps.jpg)](https://goo.gl/maps/1Q1YxF4zckJ2)

## Medicine

Many complex three-dimensional objects, with overlapping and interweaving parts, are difficult to grasp. The prime example are living creatures. [BioDigital Human](https://www.biodigital.com/) brings to life thousands of medically accurate anatomy objects and health conditions in an interactive WebGL application.

[![BioDigital Human](/images/webgl-examples/biodigital-human.jpg)](https://www.biodigital.com/)

## Shops

3D graphics have a multitude of uses for web shops, ranging from simple product presentations, to product customization and realistic previews of different materials.

[ThreeKit](https://threekit.com/) builds product configurators to integrate into web shops. They offer both 360° images and full WebGL presentations.

[![ThreeKit](/images/webgl-examples/threekit.jpg)](https://threekit.com/)

[Xbox Design Lab](https://xboxdesignlab.xbox.com/en-US/customize) allows you to configure your custom Xbox Controller in the browser. The 3D preview does automatically focus on the part you're currently editing, but can also be rotated freely.

[![Xbox Design Lab](/images/webgl-examples/xbox.jpg)](https://xboxdesignlab.xbox.com/en-US/customize)

[Meisterschmuck](https://www.meisterschmuck.de/shop/trauringe/) offers a highly sophisticated 3D rendering of their wedding rings. Unfortunately, the complex shading can quickly exhaust your laptop or smartphone.

[![Meisterschmuck](/images/webgl-examples/meisterschmuck.jpg)](https://www.meisterschmuck.de/shop/trauringe/)

## Floorplanning

Floorplanning is one of many architectural use cases for 3D graphics, and is rapidly making it's transition from traditional desktop to easily distributable web applications.

[Archilogic](https://spaces.archilogic.com/) generates 3D models out of your existing floor plans. It then allows you to plan your interior by choosing from a library of furniture and materials.

[![Archilogic](/images/webgl-examples/archilogic.jpg)](https://spaces.archilogic.com/)

[Roomle](https://www.roomle.com/en/floorplanner) is more focused on the furniture itself and its configuration, but also allows you to furnish and decorate floor plans. Archilogic and Roomle both support interactive walkthroughs and WebVR (Virtual Reality) to explore your virtual home.

[![Roomle](/images/webgl-examples/roomle.jpg)](https://www.roomle.com/en/floorplanner)

## Architecture Visualization

The boundary between the various architectural solutions is fluid, as most provide a set of multiple features. Therefore I want to show you two ends of the spectrum, that is a service tailored for existing buildings and a service for planned buildings.

[Matterport](https://matterport.com/) scans your existing houses and apartments and transforms them into a 3D/VR walkthrough that mixes 360° images and actual models mapped with textures of the scanned pictures.

[![Matterport](/images/webgl-examples/matterport.jpg)](https://matterport.com/)

[Shapespark](https://www.shapespark.com/) offers real-time architecture visualization for planned or current projects, as a major improvement upon common prerendered still images.

[![Shapespark](/images/webgl-examples/shapespark.jpg)](https://www.shapespark.com/)

The [WebVR Showroom](http://showroom.littleworkshop.fr/) is not an actual client project of Little Workshop, but it shows a mixture of furniture customization and architecture visualization, to conclude the architecture examples.

[![WebVR Showroom by Little Workshop](/images/webgl-examples/little-workshop.jpg)](http://showroom.littleworkshop.fr/)

## Human Rights Activism

Non-governmental organizations have successfully used WebGL/WebVR without business goals in mind. [Fear of the Sky](http://www.360syria.com/), a project by Amnesty International and Syrian media activists, uses 360° images and Virtual Reality to create an immersive experience showing the devastation caused by barrel bombs in Syria.

[![Fear of the Sky](/images/webgl-examples/amnesty-international.jpg)](http://www.360syria.com/)

## Environmental Protection

Moving from human rights activism to environmental protection, [Save the Rainforest](http://rainforest.arkivert.no/), a project by the Rainforest Foundation Norway and public broadcaster NRK, allows visitors to explore the rainforest through WebGL and 360° images.

[![Save the Rainforest](/images/webgl-examples/regnskogfondet.jpg)](http://rainforest.arkivert.no/)

## 3D Printing Marketplaces

If you are a publisher of 3D models you want to present them in actual 3D, so people can see how clean and detailed your models are.

The [Thingiverse](https://www.thingiverse.com/) 3D printing platform, for example, has an interactive viewer for the user's models.

[![Thingiverse](/images/webgl-examples/thingiverse.jpg)](https://www.thingiverse.com/)

The large commercial players Pinshape and Sculpteo, however, use a streaming solution to render their interactive viewers on the server. I guess they worry about decompilation and theft of their models, and haven't found a secure solution yet. This brings me to the next company, who seems to have found an answer.

## 3D Model Marketplaces

The majority of 3D models is not used for printing, but for real-time applications.

[Sketchfab](https://sketchfab.com/) started as a real-time 3D viewer and model inspector, to allow artists to showcase their models appropriately, including all the shading and postprocessing features one might expect from modern game engines.

Sketchfab now also offers a store for artists to sell their models. Potential buyers have the confidence that the models work as advertised, as they are shown in real-time, not in screenshots, which are easy to polish.

[![Sketchfab](/images/webgl-examples/sketchfab.jpg)](https://sketchfab.com/)

## Game Engines

Games are the first WebGL example that comes to mind, which is why I just want to name the two most popular game engines for the web platform.

[Unity](https://beta.unity3d.com/jonas/AngryBots/) is the most popular game development platform, and offers a WebGL build option. Development is disconnected from any web technologies, though. They've also recently dropped their JavaScript support, focusing on their C# efforts.

[![Unity](/images/webgl-examples/unity.jpg)](https://beta.unity3d.com/jonas/AngryBots/)

[PlayCanvas](https://playcanvas.com/) is another open-source engine used to make games and interactive 3D content. In contrast to Unity, applications are written using HTML and JavaScript. This and the far smaller app size and loading time make it a popular alternative to Unity, especially for lower end and mobile devices.

[![PlayCanvas](/images/webgl-examples/playcanvas.jpg)](https://robostorm.io/)

## Magazines and Newspapers

The applicability of 3D graphics is not limited to highly interactive applications. They can also be used to enhance a magazine or newspaper article.

The [National Geographic](https://www.nationalgeographic.com/magazine/2017/06/nodosaur-3d-interactive-dinosaur-fossil/) magazine regularly uses 3D to enhance their articles, like they did with the Nodosaur dinosaur fossil. It is shown in different camera angles and with various annotations while scrolling, and can be explored freely at the end of the article.

[![National Geographic](/images/webgl-examples/national-geographic.jpg)](https://www.nationalgeographic.com/magazine/2017/06/nodosaur-3d-interactive-dinosaur-fossil/)

The [New York Times](https://www.nytimes.com/interactive/2015/01/09/sports/the-dawn-wall-el-capitan.html) famously used WebGL to convey the challenge of first ascent of El Capitan's Dawn Wall, a vertical sheet of mostly smooth granite that many believe is the hardest climb in the world.

[![New York Times](/images/webgl-examples/new-york-times.jpg)](https://www.nytimes.com/interactive/2015/01/09/sports/the-dawn-wall-el-capitan.html)

## 3D Modeling

In addition to advanced presentation of 3D models, scenes and walkthroughs, there are also digital content creation tools available on the web.

[SculptGL](https://stephaneginier.com/sculptgl/) is an online sculpting application similar to Pixologic ZBrush or Autodesk Mudbox. Sketchfab has forked the application and created the similar [Sculptfab](https://labs.sketchfab.com/sculptfab/).

[![SculptGL](/images/webgl-examples/sculptgl.jpg)](https://stephaneginier.com/sculptgl/)

Google's [SketchUp](https://app.sketchup.com/app?hl=en) is a 3D modeling software that's easy to learn for beginners and is available as a web-based version since November 2017.

[![SketchUp](/images/webgl-examples/sketchup.jpg)](https://app.sketchup.com/app?hl=en)

## CAD

To complete the 3D modeling options on the web there are also computer-aided design (CAD) applications for precise engineering.

[Onshape](https://www.onshape.com/) is a CAD solution delivered via SaaS (Software as a Service). The editor is using WebGL, with difficult processing and rendering being performed on their servers.

[![Onshape](/images/webgl-examples/onshape.jpg)](https://www.onshape.com/)

## Car Configuration

Next to construction and real-estate the automotive industry may have embraced WebGL the most.

Vossen, a manufacturer of luxury and performance wheels, offers the [Vossen3D](http://vossen3d.com/) configurator. It has an extensive library of wheels and cars to choose from. The underlying software is developed by [Andari Systems](http://realism.andarisystems.com/).

[![Vossen3D](/images/webgl-examples/andari-systems-vossen-3d.jpg)](http://vossen3d.com/)

Many studios try to appeal to large car manufacturers and sell configuration solutions, as [Xymatic](http://experiences.xymatic.com/car/) does with their BMW 7 series configurator, which is also optimized for smartphones.

[![Xymatic](/images/webgl-examples/xymatic-bmw.jpg)](http://experiences.xymatic.com/car/)

As WebGL implementations of complex shading advances, realistic depiction of car paint options becomes feasible, as in VisCircle's [VW Polo](https://partner.viscircle.com/VWPolo/) configurator.

[![VW Polo](/images/webgl-examples/vw-polo.jpg)](https://partner.viscircle.com/VWPolo/)

## Marketing

You don't have to think about configuration, however, if you want to understand WebGL's appeal for the automotive industry. Lots of marketing and product landing pages can be greatly enhanced with 3D graphics.

[Inside Renault Kadjar](http://kadjar-vr.littleworkshop.fr/), a collaboration between Renault, Little Workshop and Oculus, let's you explore and customize the car's interior using WebGL and WebVR.

[![Renault Kadjar](/images/webgl-examples/renault-kadjar.jpg)](http://kadjar-vr.littleworkshop.fr/)

Finally, WebGL isn't limited to building complex experiences. It can also be used in subtle ways to add style and visual fluff. For example, the [Transmit](https://panic.com/transmit/) product page features an interactive 3D version of the application's truck logo.

[![Transmit](/images/webgl-examples/transmit.jpg)](https://panic.com/transmit/)

---

Do you know other examples of real-world WebGL applications? Please post them in the comments, and if you enjoyed this article, [consider sharing it with your followers](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fmanu.ninja%2F25-real-world-applications-using-webgl&text=25%20Real-World%20Applications%20Using%20WebGL&url=https://manu.ninja/25-real-world-applications-using-webgl&via=manuelwieser).

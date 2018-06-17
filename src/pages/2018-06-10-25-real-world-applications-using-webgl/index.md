---
path: /25-real-world-applications-using-webgl
title: 25+ Real-World Applications Using WebGL
date: 2018-06-10
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

3D graphics have a wide array of uses for web shops, ranging from simple product presentations, to product customization and realistic shading of jewellery.

[ThreeKit](https://threekit.com/) offers services, creating web shop integrations of product presentations. 

[![ThreeKit](/images/webgl-examples/threekit.jpg)](https://threekit.com/)

[Xbox Design Lab](https://xboxdesignlab.xbox.com/en-US/customize) allows you to configure your custom Xbox Controller in the browser with a 3D preview of the final result. 

[![Xbox Design Lab](/images/webgl-examples/xbox.jpg)](https://xboxdesignlab.xbox.com/en-US/customize)

[Meisterschmuck](https://www.meisterschmuck.de/shop/trauringe/) offers a highly sophisticated 3D display of their wedding rings. Though the complex shading can quickly exhaust your laptop or smartphone.
 
[![Meisterschmuck](/images/webgl-examples/meisterschmuck.jpg)](https://www.meisterschmuck.de/shop/trauringe/)

## Floorplanning

Floorplanning is just one of many architectural use-cases for 3D graphics, and is rapidly making it's transition from traditional desktop to web applications. 

[Archilogic](https://spaces.archilogic.com/) generates 3D models out of floor plans and then allows you to plan your interiour by choosing from a library of furniture and materials.

[![Archilogic](/images/webgl-examples/archilogic.jpg)](https://spaces.archilogic.com/)

[Roomle](https://www.roomle.com/en/floorplanner) also allows you to furnish and decorate floor plans, but it's more focused on the furniture products and their configuration.

[![Roomle](/images/webgl-examples/roomle.jpg)](https://www.roomle.com/en/floorplanner)

Both services supports interactive walkthroughs and WebVR (Virtual Reality) to explore your virtual house or apartment.
 
## Architecture Visualization

The boundary between various architectural services is fluid. I want to show you two ends of the spectrum, a service for existing buildings and a service for not-yet existing buildings.
 
[Matterport](https://matterport.com/) scans your existing houses and rooms and transforms it into a walkthrough that mixes 360° images and 3D models mapped with textures of the scans.

[![Matterport](/images/webgl-examples/matterport.jpg)](https://matterport.com/)

[Shapespark](https://www.shapespark.com/) offers real-time architecture visualization for planned of ongoing projects, as an improvement upon common prerendered still images.

[![Shapespark](/images/webgl-examples/shapespark.jpg)](https://www.shapespark.com/)

The [WebVR Showroom by Little Workshop](http://showroom.littleworkshop.fr/) is not an actual client project of theirs, but shows a beautiful mixture of furniture customization and architecture visualization.

[![WebVR Showroom by Little Workshop](/images/webgl-examples/little-workshop.jpg)](http://showroom.littleworkshop.fr/)

## Human Rights Activism

Non-governmental organizations have used WebGL successfully without a business goal in mind. [Fear of the Sky](http://www.360syria.com/), a project by Amnesty International UK and Syrian media activists, uses 360° images and WebVR to create an interactive experience showing the devastation caused by barrel bombs in Syria.

[![Fear of the Sky](/images/webgl-examples/amnesty-international.jpg)](http://www.360syria.com/)

## Environmental Protection 

Going from human rights activism to environmental protection, [Save the Rainforest](http://rainforest.arkivert.no/), a project by the Rainforest Foundation Norway and public broadcaster NRK, allows visitors to explore the rainforest through WebGL and 360° images.

[![Save the Rainforest](/images/webgl-examples/regnskogfondet.jpg)](http://rainforest.arkivert.no/)

## 3D Printing Marketplaces

If you sell 3D models you might want to show them in actual 3D. [Thingiverse](https://www.thingiverse.com/) has an interactive viewer for all their user's 3D printing models.

[![Thingiverse](/images/webgl-examples/thingiverse.jpg)](https://www.thingiverse.com/)

The big commercial players Pinshape and Sculpteo, however, use a streaming solution to render the interactive viewer on the server. My guess is they worry about decompilation and theft of their models, and haven't found a safe solution yet. This brings us right to the next example.

## 3D Model Marketplaces

There are not only 3D models for printing, but also for real-time applications. [Sketchfab](https://sketchfab.com/) started as a realtime 3D viewer and model inspector, to allow artists to showcase their models appropriately, with all shading and postprocessing features one might expect from modern game engines. It now also has a store for artists to sell their models. Buyers have the confidence, that the models work as advertised, as they are shown in real-time, not in screenshots.

[![Sketchfab](/images/webgl-examples/sketchfab.jpg)](https://sketchfab.com/)

## Game Engines

Games are the easiest example to recollect, which is why I just want to name the two most popular game engines for the web, being [Unity](https://beta.unity3d.com/jonas/AngryBots/) and [PlayCanvas](https://playcanvas.com/). Both have been used for many free and commercial games.

[![Unity](/images/webgl-examples/unity.jpg)](https://beta.unity3d.com/jonas/AngryBots/)

[![PlayCanvas](/images/webgl-examples/playcanvas.jpg)](https://robostorm.io/)

## Magazines and Newspapers

The usefulness of 3D graphics is not limited to highly interactive applications. They can also be used to enhance a magazine or newspaper article.

The [National Geographic](https://www.nationalgeographic.com/magazine/2017/06/nodosaur-3d-interactive-dinosaur-fossil/) magazine regularly uses 3D to enhance their articles, like they did with the Nodosaur dinosaur fossil, which is shown in different views while scrolling, and can be explored freely at the end of the article.

[![National Geographic](/images/webgl-examples/national-geographic.jpg)](https://www.nationalgeographic.com/magazine/2017/06/nodosaur-3d-interactive-dinosaur-fossil/)

The [New York Times](https://www.nytimes.com/interactive/2015/01/09/sports/the-dawn-wall-el-capitan.html) famously used WebGL to convey the challenge of the 3,000-foot Dawn Wall, a vertical sheet of mostly smooth granite that many believe is the hardest climb in the world.

[![New York Times](/images/webgl-examples/new-york-times.jpg)](https://www.nytimes.com/interactive/2015/01/09/sports/the-dawn-wall-el-capitan.html)

## 3D Modeling

In addition to presenting 3D models and scenes, they're also digital content creation tools available on the web.

[SculptGL](https://stephaneginier.com/sculptgl/) is an online sculpting application similar to Pixologic ZBrush or Autodesk Mudbox. Sketchfab has forked the application and created the similar [Sculptfab](https://labs.sketchfab.com/sculptfab/).

[![SculptGL](/images/webgl-examples/sculptgl.jpg)](https://stephaneginier.com/sculptgl/)

Google's [SketchUp](https://app.sketchup.com/app?hl=en) is a 3D modeling software that's easy to learn for beginners and is available as a web-based version since November 2017.

[![SketchUp](/images/webgl-examples/sketchup.jpg)](https://app.sketchup.com/app?hl=en)

## CAD

[Onshape](https://www.onshape.com/) is a computer-aided design software system, delivered via SaaS (Software as a Service. The editor is using WebGL, with difficult processing and rendering being performed on their servers.

[![Onshape](/images/webgl-examples/onshape.jpg)](https://www.onshape.com/)

## Car Configuration

Apart from construction and real-estate, the automotive industry may have embraced WebGL the most.

Vossen, a manufacturer of luxury and performance wheels, offers a [Vossen3D](http://vossen3d.com/) online configurator. It has an extensive library of cars to choose from, and is developed by [Andari Systems](http://realism.andarisystems.com/).

[![Vossen3D](/images/webgl-examples/andari-systems-vossen-3d.jpg)](http://vossen3d.com/)

Many studios try to appeal to large car manufacturers and sell configuration platforms, as [Xymatic](http://experiences.xymatic.com/car/) did with their BMW 7 series car configurator.

[![Xymatic](/images/webgl-examples/xymatic-bmw.jpg)](http://experiences.xymatic.com/car/)

As WebGL implementations of shader's advance, realistic depiction of painting options becomes possible, as in VisCircle's [VW Polo](https://partner.viscircle.com/VWPolo/) configurator.

[![VW Polo](/images/webgl-examples/vw-polo.jpg)](https://partner.viscircle.com/VWPolo/)

## Marketing

You don't have to think about configuration, if you want to see the WebGL appeal for the automotive industry. Lots of marketing and product landing pages can be greatly enhanced with 3D graphics.

[Inside Renault Kadjar](http://kadjar-vr.littleworkshop.fr/), a collaboration between Renault, Little Workshop and Oculus, let's you explore and customize the car's interior.

[![Renault Kadjar](/images/webgl-examples/renault-kadjar.jpg)](http://kadjar-vr.littleworkshop.fr/)

WebGL isn't limited to building complex experiences. It can also be used in subtle ways to add a bit of style and interactivity. For example, the [Transmit](https://panic.com/transmit/) app has an interactive 3D logo on their product page.

[![Transmit](/images/webgl-examples/transmit.jpg)](https://panic.com/transmit/)

---

Do you know other examples of real-world WebGL applications? Please post them in the comments, and if you enjoyed this article, [consider sharing it with your followers](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fmanu.ninja%2F25-real-world-applications-using-webgl&text=25%20Real-World%20Applications%20Using%20WebGL&url=https://manu.ninja/25-real-world-applications-using-webgl&via=manuelwieser).

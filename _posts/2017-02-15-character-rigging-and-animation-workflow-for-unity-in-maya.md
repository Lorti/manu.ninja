---
layout: post
title:  Character Rigging and Animation Workflow for Unity in Maya
date:   2017-02-15
categories: [art, games]
thumbnail: /images/raptor.jpg
sharing: true
---

<style>
.Article-content img {
    max-width: calc(100% - 4 * 1.375em);
    max-height: 480px;
}
</style>

This article highlights a few pitfalls I’ve come across while animating a character in Autodesk Maya and exporting it in `.fbx` format to be used in real-time applications such as Unity. My learnings may be useful to you, so please read any of the three sections on rigging, animating or exporting you might find interesting.

I will talk about specific problems I had while creating my cartoon velociraptor. The following image taken from the Unity viewport shows you the creature character referred to in the examples.

![](/images/raptor.jpg)

## Rigging

The majority of real-time applications support

* solid animation (translation, scale, rotation),
* skeleton-based animation (models rigged with bones)
* and morph targets (transformed vertices), known as [Blend Shapes][] in Maya.

You should set a maximum of four influences when skinning via [Bind Smooth Skin][], as this is the most that Unity can handle. Sketchfab and other applications might handle less or more, but you should generally be safe if you use four influences.

If you use constraints and deformers specific to a certain application you have to make sure that the exporter treats them correctly when baking the animation. I have not thought about that at first and created parts of the raptor rig with [Cluster][] deformers. The drool meshes are parented to the lower jaw controller, but the lowermost vertices of the drool meshes were members of two point sets controlled by Clusters. 

![](/images/drool-joints-and-rig-controls.png)

This information does not get baked during the `.fbx` export, which I had only learned after animating the walk cycle. So I had do redo this part of the rig with joints. With the help of the [Component Editor][] you are able to precisely set your skin weights, not having to flimsily paint your weights.

![](/images/squash-and-strech-head-rig.png)

I had learned to stick to joints, even for more complex animations. An example are squash and stretch effects, like with the beret-wearing, big-headed character. His mouth can be shrunk and grown for an exaggerated animation, all achieved via joints.

## Animating

If the model has multiple animations, you can create different files in the format `raptor@idle.fbx` or `raptor@walk.fbx`. Unity automatically imports all four files and collects the animation clips.

For a better animation workflow in Maya and compatibility with Sketchfab all takes should be included in the same `.fbx` file. Why?

* Unity won’t pollute your workspace with animation files. 
* You don’t have to switch between different Maya instances, which can be daunting for your computer, or open a different file each time you want to tweak another animation clip.

![](https://docs.unity3d.com/uploads/Main/animation_at_naming.png)

You can manage your animation clips in the [Trax Editor][], a feature which has been long available in Maya, but was somehow missing from Maya 2016 LT. The [Time Editor][], which was introduced in Maya 2017 and serves a similar purpose, has thankfully made its way to Maya LT 2017.

![](/images/trax-editor.png)

Each clip holds the animation curves for a specific animation. You have to activate or deactivate a clip to see key ticks in the timeline and curves in the graph editor. Keys from other animation are hidden, allowing you to concentrate, use pre and post infinity cycles, and not having to reset your rig between clips, polluting your scene with curves and keys. This allows for a clean and hazzle-free animation experience.

![](/images/graph-editor.png)

## Exporting

Exporting your animations to `.fbx` can yield all sorts of problems, especially if your are stuck with older versions of Maya. Each time I had exported the raptor with the `.fbx` exporter in Maya 2012 I experienced some issues. The curves of both hands were not correctly resampled as euler interpolations during the animation baking process. This leads to animation glitches in Sketchfab. Unity can usually cleanup these curves, but you shouldn't count on it.

![](/images/resample-as-euler-interpolation-problems.png)

Instead of manually cleaning the curves after each export I got the change to use Maya 2016 for a while and use the updated `.fbx` exporter, which handles rotations correctly. Which is where I've also discovered the  [Game Exporter][] feature, a tool you should definitely use, as it allows you to specify the key ranges for your clips.

![](/images/game-exporter.png)

If you click on the cog in the lower right corner you'll open the usual `.fbx` settings. These haven't changed much since the first `.fbx` exporters, so the usual settings apply. You should check _Bake Animation_, _Resample All_, as well as _Deformed Models_ and _Skins_. Your animations should be exported correctly now, even if you uncheck all the other checkboxes present in the advanced settings.

<!-- ![](/images/advanced-settings.png) -->

As soon as the export was successful I've uploaded the raptor to Sketchfab, for showcasing the model and animations. If you are interested in using the raptor for your game visit [CGTrader][].  

<div class="FlexEmbed">
    <div class="FlexEmbed-ratio FlexEmbed-ratio--16by9">
        <iframe class="FlexEmbed-content" src="https://sketchfab.com/models/862273bcc4764dc39e86b88f46dd69ea/embed" frameborder="0" allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe>
    </div>
</div>

Hopefully some of these tips are helpful to you. Have you had similar or different problems with your rigs and animations? If so, please leave a comment with your tips, or,  if you have a problem with one of your rigs please feel free to ask, I'll be glad to help.



[Blend Shapes]: https://knowledge.autodesk.com/guidref/MAYAUL/2016/learn-explore/GUID-B8853C3F-2997-4DC2-95A0-7C43E45888E4]
[Cluster]: https://knowledge.autodesk.com/guidref/MAYAUL/2016/learn-explore/GUID-B7C96FEA-C415-4927-8E02-396F0E837DE2
[Component Editor]: https://knowledge.autodesk.com/guidref/MAYAUL/2015/learn-explore/Basics_Windows_and_Editors_Component_Editor
[Bind Smooth Skin]: https://knowledge.autodesk.com/guidref/MAYAUL/2016/learn-explore/GUID-8DBA9E62-3854-4348-A0AD-1F981ECEA54F]
[Trax Editor]: https://knowledge.autodesk.com/guidref/MAYAUL/2016/learn-explore/GUID-33C829F4-635C-4DEB-956C-6A54BEE1EC89]
[Time Editor]: https://knowledge.autodesk.com/guidref/MAYAUL/2017/learn-explore/GUID-E4B5DB7D-7351-4561-BD8B-60AC9D48DDF6]
[Game Exporter]: https://knowledge.autodesk.com/guidref/MAYAUL/2016/learn-explore/GUID-2DB6E7B0-04B8-4585-91E9-7D64B02D0338
[CGTrader]: https://www.cgtrader.com/3d-models/animals/dinosaur/velociraptor-16bc459b-4c90-4cce-ae1b-ddb6a84a71cf

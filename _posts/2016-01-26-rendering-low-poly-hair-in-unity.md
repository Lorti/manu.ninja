---
layout: post
title:  Rendering Low-Poly Hair in Unity
date:   2016-01-26
categories: [coding, games]
thumbnail: /images/unity-hair-rendering-thumbnail.jpg
---

You have modeled and textured hair for your low-poly character and want to drop it into Unity. After importing your mesh you play with the different rendering modes of the default material and come to the conclusion that they all give you unsatisfactory results. You then settle on the `Cutout` rendering mode and cringe while noticing the backface culling, causing most of your hair mesh to disappear.

![](/images/unity-low-poly-hair-cutout.jpg)

This was my experience a few days ago. Turns out, that Unity has no cutout with soft edges or a double-sided shader per default, apart from the foliage shaders. There is no well-hidden checkbox to turn off backface culling, like one might expect when coming a 3D modeling software. Luckily all the default shaders can be downloaded from the [Unity Download Archive](https://unity3d.com/get-unity/download/archive), to tinker with them.




## Modifying the Standard Shader for Double-Sided Rendering

There are many files in this package. To find the standard shader you have to locate the `Standard.shader` file in the `DefaultResourcesExtra` folder. The shader itself consists of two subshaders, made up of five and four passes respectively. You can get a clear overview by collapsing the code blocks.

~~~
Shader "Standard" {

    Properties { ... }

    SubShader {
        LOD 300

        // ------------------------------------------------------------------
        //  Base forward pass (directional light, emission, lightmaps, ...)
        Pass { ... }

        // ------------------------------------------------------------------
        //  Additive forward pass (one light per pass)
        Pass { ... }

        // ------------------------------------------------------------------
        //  Shadow rendering pass
        Pass { ... }

        // ------------------------------------------------------------------
        //  Deferred pass
        Pass { ... }

        // ------------------------------------------------------------------
        // Extracts information for lightmapping, GI (emission, albedo, ...)
        // This pass it not used during regular rendering.
        Pass { ... }
    }

    SubShader {
        LOD 150

        // ------------------------------------------------------------------
        //  Base forward pass (directional light, emission, lightmaps, ...)
        Pass { ... }

        // ------------------------------------------------------------------
        //  Additive forward pass (one light per pass)
        Pass { ... }

        // ------------------------------------------------------------------
        //  Shadow rendering pass
        Pass  { ... }

        // ------------------------------------------------------------------
        // Extracts information for lightmapping, GI (emission, albedo, ...)
        // This pass it not used during regular rendering.
        Pass { ... }
    }

}
~~~

The subshaders are essentially the same, but the second one can be used on weaker hardware, as indicated by the `LOD 150` line. The only difference is that the deferred pass is missing in the second subshader.

If you inspect one of the passes you see a Cg snippet with `#pragma` and `#include` commands. At first the pass seems simple, but the real magic happens in the included `UnityStandardCoreForward.cginc`, which itself includes between 350 and almost 700 lines.

The commands before the Cg snippet (`CGPROGRAM` until `ENDCG`) set up the rendering pass. This is where you can turn backface culling off via the command `Cull Off`. You can do this for each pass, which gives you a result similar to the image below.

~~~
Pass {
    Name "FORWARD"
    Tags { "LightMode" = "ForwardBase" }

    Blend [_SrcBlend] [_DstBlend]
    ZWrite [_ZWrite]

    Cull Off // This turns of backface culling for this pass.

    CGPROGRAM
    #pragma target 3.0
    #pragma exclude_renderers gles

    #pragma shader_feature _NORMALMAP
    #pragma shader_feature _ _ALPHATEST_ON _ALPHABLEND_ON _ALPHAPREMULTIPLY_ON
    #pragma shader_feature _EMISSION
    #pragma shader_feature _METALLICGLOSSMAP
    #pragma shader_feature ___ _DETAIL_MULX2
    #pragma shader_feature _PARALLAXMAP

    #pragma multi_compile_fwdbase
    #pragma multi_compile_fog

    #pragma vertex vertBase
    #pragma fragment fragBase
    #include "UnityStandardCoreForward.cginc"

    ENDCG
}
~~~

![](/images/unity-low-poly-hair-cull-off.jpg)




## The Lighting Is Wrong in This Approach

[Why is this a problem?](http://danielbrauer.com/files/rendering-double-sided-geometry.html)

> Every additional pass is another draw call, which means twice as many draw calls for double-sided shaders.

> Even if draw calls aren’t a problem, you’re still creating new shaders to render certain meshes in a way that doesn’t actually look different. Having a double-sided version of each shader you want to use for your single-sided objects means you waste the GPU’s time with state changes and shader compilation.

[double-sided rendering methods](http://forum.unity3d.com/threads/double-sided-material.21778/page-2#post-2352641)




## Softening the Alpha Cutoff with Fast Approximate Anti-Aliasing

[anti-aliasing](http://docs.unity3d.com/Manual/script-Antialiasing.html)
[Fast Approximate Anti-Aliasing](https://en.wikipedia.org/wiki/Fast_approximate_anti-aliasing)

![](/images/unity-low-poly-hair-fxaa.jpg)




## Creating Low-Poly Hair Strips in ZBrush

You can build your own hair strip brush following the [tutorial](http://www.3dartistonline.com/news/2015/04/how-do-i-create-real-time-hair-for-games/) by Tom Parker or just download my [hair strip brush](), if you are in a hurry.




## Conclusion

![](/images/unity-low-poly-hair-rendering.jpg)

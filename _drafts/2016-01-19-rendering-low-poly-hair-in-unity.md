---
layout: post
title:  Rendering Low-Poly Hair in Unity
date:   2016-01-19
categories:
  - coding
  - games
---

You have modeled and textured hair for your low-poly character and want to drop it into Unity. After importing your mesh you play with the different rendering modes of the default material and come to the conclusion that they all give you unsatisfactory results. You then settle on the `Cutout` rendering mode and cringe while noticing the backface culling, causing most of your hair mesh to disappear.

![](/images/unity-low-poly-hair-rendering.png)

This was my experience a few days ago.




## Modifying the Standard Shader for Double-Sided Rendering

[Unity Download Archive](https://unity3d.com/get-unity/download/archive)
`DefaultResourcesExtra`
`Standard.shader`

For each pass, the object geometry is rendered, so there must be at least one pass.

~~~ glsl
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

The commands before the Cg snippet (`CGPROGRAM` until `ENDCG`) set up the rendering pass. This is where you can turn backface culling off via the command `Cull Off`.

~~~ glsl
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

## The Lighting Is Wrong in This Approach

[Why is this a problem?](http://danielbrauer.com/files/rendering-double-sided-geometry.html)

> Every additional pass is another draw call, which means twice as many draw calls for double-sided shaders.

> Even if draw calls aren’t a problem, you’re still creating new shaders to render certain meshes in a way that doesn’t actually look different. Having a double-sided version of each shader you want to use for your single-sided objects means you waste the GPU’s time with state changes and shader compilation.

[double-sided rendering methods](http://forum.unity3d.com/threads/double-sided-material.21778/page-2#post-2352641)


## Softening the Alpha Cutoff with Fast Approximate Anti-Aliasing


## Creating Low-Poly Hair Strips in ZBrush

You can build your own hair strip brush following the [tutorial](http://www.3dartistonline.com/news/2015/04/how-do-i-create-real-time-hair-for-games/) by Tom Parker or just download my [hair strip brush](), if you are in a hurry.

![](/images/unity-low-poly-hair-rendering.png)


---
layout: post
title:  Rendering Low-poly Hair in Unity
date:   2016-01-19
categories: coding, games
---

~~~ cg
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

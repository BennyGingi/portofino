"use client";

/**
 * Scene — the cinematic Three.js backdrop for /v2.
 *
 * A glowing cast-metal "guardian" sculpture floating in deep space, lit by
 * sapphire light, with a slow starfield, breathing glow arcs and rising forge
 * sparks. Scroll orbits the camera ~270° and drifts the metal's colour from
 * warm bronze (hero) to deep sapphire (contact).
 *
 * Full-viewport fixed canvas behind all content. Single renderer, disposed on
 * unmount, render loop paused when the tab is hidden. Reduced motion renders a
 * single static frame; no WebGL shows a CSS gradient fallback.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// ── colours ──────────────────────────────────────────────────────────────────
const BRONZE = new THREE.Color("#b5793f");
const BRONZE_SHADOW = new THREE.Color("#6b3f1d");
const SAPPHIRE = new THREE.Color("#1d4ed8");
const SAPPHIRE_DEEP = new THREE.Color("#0b1e4f");
const RIM = new THREE.Color("#3b82f6");

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // Scene is a client-only (ssr:false) component, so this initializer runs on
  // the client where the WebGL probe is valid.
  const [fallback] = useState(() => typeof window !== "undefined" && !hasWebGL());

  useEffect(() => {
    if (fallback) return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#03060d");
    scene.fog = new THREE.FogExp2("#03060d", 0.028);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ── environment (metal reflections) ──────────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    // ── lights ────────────────────────────────────────────────────────────────
    const key = new THREE.DirectionalLight(0x9ec1ff, 2.6);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x1d4ed8, 40, 40);
    rim.position.set(-4, -1, -3);
    scene.add(rim);
    const warm = new THREE.PointLight(0xb5793f, 18, 30);
    warm.position.set(2, -2, 2);
    scene.add(warm);
    scene.add(new THREE.AmbientLight(0x20304f, 0.6));

    // ── sculpture material: liquid cast metal ────────────────────────────────
    const uniforms = {
      uTime: { value: 0 },
      uColorMix: { value: 0 }, // 0 bronze -> 1 sapphire
      uBronze: { value: BRONZE.clone() },
      uBronzeShadow: { value: BRONZE_SHADOW.clone() },
      uSapphire: { value: SAPPHIRE.clone() },
      uSapphireDeep: { value: SAPPHIRE_DEEP.clone() },
      uRim: { value: RIM.clone() },
    };

    const material = new THREE.MeshPhysicalMaterial({
      metalness: 1.0,
      roughness: 0.28,
      envMapIntensity: 1.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
      color: BRONZE.clone(),
    });

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          varying vec3 vPosW;
          varying vec3 vNrm;
          // iq simplex noise
          vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
          float snoise(vec3 v){
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 1.0/7.0;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }`
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = vec3(position);
          float n = snoise(normal * 1.6 + uTime * 0.18);
          float n2 = snoise(position * 2.4 - uTime * 0.12);
          float disp = (n * 0.5 + n2 * 0.5) * 0.11;
          transformed += normal * disp;
          vPosW = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vNrm = normalize(mat3(modelMatrix) * normal);`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uColorMix;
          uniform vec3 uBronze; uniform vec3 uBronzeShadow;
          uniform vec3 uSapphire; uniform vec3 uSapphireDeep; uniform vec3 uRim;
          varying vec3 vPosW;
          varying vec3 vNrm;`
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          vec3 warm = mix(uBronzeShadow, uBronze, 0.6);
          vec3 cool = mix(uSapphireDeep, uSapphire, 0.6);
          diffuseColor.rgb *= mix(warm, cool, uColorMix) * 1.2;`
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          vec3 viewDir = normalize(cameraPosition - vPosW);
          float fres = pow(1.0 - clamp(dot(viewDir, normalize(vNrm)), 0.0, 1.0), 2.4);
          vec3 rimCol = mix(uRim, uSapphire, uColorMix * 0.5);
          totalEmissiveRadiance += rimCol * fres * (0.9 + uColorMix * 0.8);`
        );
    };

    // ── sculpture mesh (procedural fallback; GLB swaps in if present) ─────────
    const group = new THREE.Group();
    scene.add(group);

    const procGeo = new THREE.TorusKnotGeometry(1.1, 0.4, isMobile ? 160 : 340, isMobile ? 24 : 48, 2, 3);
    let sculpture: THREE.Object3D = new THREE.Mesh(procGeo, material);
    group.add(sculpture);

    // Optional real model — only replaces the fallback if the file exists.
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(draco);
    gltfLoader.load(
      "/models/guardian.glb",
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2.6 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = material;
        });
        group.remove(sculpture);
        (sculpture as THREE.Mesh).geometry?.dispose?.();
        sculpture = model;
        group.add(model);
      },
      undefined,
      () => {
        /* no guardian.glb — keep procedural sculpture. Expected in the demo. */
      }
    );

    // ── starfield ─────────────────────────────────────────────────────────────
    const starCount = isMobile ? 600 : 1300;
    const starPos = new Float32Array(starCount * 3);
    const starSize = new Float32Array(starCount);
    const starPhase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const r = 14 + Math.random() * 24;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = r * Math.cos(ph);
      starSize[i] = Math.random() * 2 + 0.4;
      starPhase[i] = Math.random() * Math.PI * 2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhase, 1));
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize; attribute float aPhase; uniform float uTime;
        varying float vTw;
        void main(){
          vTw = 0.55 + 0.45 * sin(uTime * 1.5 + aPhase);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (300.0 / -mv.z) * vTw;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vTw;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vTw;
          gl_FragColor = vec4(vec3(0.8, 0.88, 1.0), a);
        }`,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── glow arcs (breathing sapphire rings behind the sculpture) ────────────
    const glowGeo = new THREE.PlaneGeometry(2, 2);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColorMix: uniforms.uColorMix, uAspect: { value: window.innerWidth / window.innerHeight } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform float uColorMix; uniform float uAspect;
        float ring(vec2 p, float r, float w){ return smoothstep(w, 0.0, abs(length(p) - r)); }
        void main(){
          vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
          float breathe = 0.5 + 0.5 * sin(uTime * 0.25);
          vec3 sap = vec3(0.11, 0.28, 0.85);
          vec3 col = vec3(0.0);
          col += sap * ring(p, 0.65 + breathe * 0.06, 0.22) * 0.5;
          col += sap * ring(p + vec2(0.3, 0.1), 1.05 + breathe * 0.1, 0.34) * 0.3;
          col += sap * ring(p - vec2(0.25, 0.2), 1.5 - breathe * 0.08, 0.5) * 0.18;
          col *= 0.7 + uColorMix * 0.6;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.frustumCulled = false;
    glow.renderOrder = -1;
    scene.add(glow);

    // ── forge sparks (rising embers around the base) ─────────────────────────
    const sparkCount = isMobile ? 100 : 300;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = new Float32Array(sparkCount);
    const sparkSeed = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 0.6 + Math.random() * 1.6;
      sparkPos[i * 3] = Math.cos(a) * rad;
      sparkPos[i * 3 + 1] = -2 + Math.random() * 3.5;
      sparkPos[i * 3 + 2] = Math.sin(a) * rad;
      sparkVel[i] = 0.4 + Math.random() * 0.9;
      sparkSeed[i] = Math.random();
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute("aSeed", new THREE.BufferAttribute(sparkSeed, 1));
    const sparkMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSeed; uniform float uTime; varying float vLife;
        void main(){
          vLife = fract(aSeed + uTime * 0.12);
          vec3 p = position;
          p.y = -2.0 + vLife * 4.0;
          p.x += sin(uTime + aSeed * 30.0) * 0.12;
          p.z += cos(uTime * 0.8 + aSeed * 22.0) * 0.12;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (1.0 - vLife) * 7.0 * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vLife;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * (1.0 - vLife);
          vec3 ember = mix(vec3(1.0, 0.55, 0.2), vec3(0.9, 0.2, 0.05), vLife);
          gl_FragColor = vec4(ember, a);
        }`,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // ── scroll + mouse state ──────────────────────────────────────────────────
    let scrollTarget = 0;
    let scrollP = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();

    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      glowMat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", onResize);

    const MAX_TILT = THREE.MathUtils.degToRad(2);

    const updateCamera = () => {
      const angle = scrollP * THREE.MathUtils.degToRad(270);
      const radius = lerp(6.0, 5.6, scrollP) - Math.sin(scrollP * Math.PI) * 0.8;
      const y = lerp(0.2, -0.3, scrollP) + Math.sin(scrollP * Math.PI) * 0.15;
      const baseX = Math.sin(angle) * radius;
      const baseZ = Math.cos(angle) * radius;
      // mouse parallax: tiny tilt
      camera.position.set(
        baseX + mouse.x * MAX_TILT * radius,
        y - mouse.y * MAX_TILT * radius,
        baseZ
      );
      camera.lookAt(0, 0, 0);
    };

    const applyColorMix = () => {
      uniforms.uColorMix.value = scrollP;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const renderOnce = () => {
      updateCamera();
      applyColorMix();
      renderer.render(scene, camera);
    };

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      scrollP = lerp(scrollP, scrollTarget, 0.07);
      mouse.x = lerp(mouse.x, mouseTarget.x, 0.05);
      mouse.y = lerp(mouse.y, mouseTarget.y, 0.05);
      uniforms.uTime.value = t;
      starMat.uniforms.uTime.value = t;
      glowMat.uniforms.uTime.value = t;
      sparkMat.uniforms.uTime.value = t;
      group.rotation.y = t * 0.08;
      stars.rotation.y = t * 0.01;
      updateCamera();
      applyColorMix();
      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        clock.start();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      // static, well-lit single frame
      scrollP = scrollTarget;
      uniforms.uTime.value = 0;
      starMat.uniforms.uTime.value = 0;
      glowMat.uniforms.uTime.value = 0;
      sparkMat.uniforms.uTime.value = 0;
      renderOnce();
    } else {
      animate();
    }

    // ── cleanup ───────────────────────────────────────────────────────────────
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      procGeo.dispose();
      (sculpture as THREE.Mesh).geometry?.dispose?.();
      material.dispose();
      starGeo.dispose();
      starMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      envRT.dispose();
      pmrem.dispose();
      draco.dispose();
      scene.environment = null;
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduced, fallback]);

  if (fallback) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 42%, rgba(29,78,216,0.28), rgba(3,6,13,0) 70%), radial-gradient(40% 30% at 55% 60%, rgba(181,121,63,0.18), rgba(3,6,13,0) 70%), #03060d",
        }}
      />
    );
  }

  return <div ref={mountRef} aria-hidden className="fixed inset-0 z-0" />;
}

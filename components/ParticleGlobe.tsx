"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

export interface ParticleGlobeProps {
    className?: string;
    style?: React.CSSProperties;
}

// ── shared constants ──────────────────────────────────────────────────────────
const TOTAL_PARTICLES = 5000;
const MAX_CONST_LINES = 800;
const CONST_ANGLE_THRESH = 0.18;
const AUTO_ROT_BASE = 0.0012;
const AUTO_ROT_AMP = 0.0003;
const HOVER_ROT_TARGET = 0.003;
const DEFAULT_ROT_TARGET = AUTO_ROT_BASE;
const MOUSE_LERP = 0.06;
const ROT_LERP = 0.04;
const OPACITY_LERP = 0.05;

const CITIES = [
    { name: "New York",    lat: 40.71,  lon: -74.00 },
    { name: "London",      lat: 51.51,  lon:  -0.13 },
    { name: "Tokyo",       lat: 35.68,  lon: 139.69 },
    { name: "Sydney",      lat: -33.87, lon: 151.21 },
    { name: "São Paulo",   lat: -23.55, lon: -46.63 },
    { name: "Mumbai",      lat: 19.08,  lon:  72.88 },
    { name: "Cairo",       lat: 30.04,  lon:  31.24 },
    { name: "Moscow",      lat: 55.75,  lon:  37.62 },
    { name: "Beijing",     lat: 39.91,  lon: 116.39 },
    { name: "Lagos",       lat:  6.52,  lon:   3.38 },
    { name: "Mexico City", lat: 19.43,  lon: -99.13 },
    { name: "Seoul",       lat: 37.57,  lon: 126.98 },
    { name: "Tel Aviv",    lat: 32.08,  lon:  34.78 },
] as const;

const ARC_PAIRS: [number, number][] = [
    [0, 1], [0, 2], [0, 4], [0, 12],
    [1, 2], [1, 7], [1, 3],
    [2, 8], [2, 11],
    [3, 2], [3, 11],
    [4, 0], [4, 5],
    [6, 1], [6, 5],
    [7, 8], [9, 1],
];

// ── helpers ───────────────────────────────────────────────────────────────────
function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    );
}

function randOnSphere(r: number): THREE.Vector3 {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    );
}

function buildArcPoints(a: THREE.Vector3, b: THREE.Vector3, radius: number, segments = 64): THREE.Vector3[] {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const lift = mid.length() === 0 ? radius * 1.35 : (radius * 1.35) / mid.length();
    mid.multiplyScalar(lift);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments, mt = 1 - t;
        pts.push(new THREE.Vector3(
            mt * mt * a.x + 2 * mt * t * mid.x + t * t * b.x,
            mt * mt * a.y + 2 * mt * t * mid.y + t * t * b.y,
            mt * mt * a.z + 2 * mt * t * mid.z + t * t * b.z,
        ));
    }
    return pts;
}

function makeLabelTexture(name: string, isLight: boolean): THREE.CanvasTexture {
    const W = 256, H = 64;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    ctx.font = "bold 22px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = isLight ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.55)";
    const tw = ctx.measureText(name).width + 16;
    ctx.beginPath();
    ctx.roundRect(W / 2 - tw / 2, H / 2 - 14, tw, 28, 6);
    ctx.fill();
    ctx.fillStyle = isLight ? "#005544" : "#00e5c8";
    ctx.fillText(name, W / 2, H / 2);
    return new THREE.CanvasTexture(c);
}

// ── LIGHT MODE: original particle globe (green/cyan) ─────────────────────────
function buildLightGlobe(
    pivot: THREE.Object3D,
    RADIUS: number,
    state: {
        mouseX: number; mouseY: number;
        targetMouseX: number; targetMouseY: number;
        rotSpeed: number; targetRotSpeed: number;
        particleOpacity: number; targetParticleOpacity: number;
        isHovered: boolean;
    },
    isMobile: () => boolean,
) {
    const CYAN     = 0x007A65;
    const CYAN_DIM = 0x005544;
    const ORANGE   = 0xff8c42;

    function buildShell(count: number, r: number, opacity: number, color: number, size: number): THREE.Points {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const v = randOnSphere(r);
            positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return new THREE.Points(geo, new THREE.PointsMaterial({
            color, size, transparent: true, opacity,
            sizeAttenuation: true, depthWrite: false,
            blending: THREE.AdditiveBlending,
        }));
    }

    const coreCount  = Math.floor(TOTAL_PARTICLES * 0.30);
    const surfCount  = Math.floor(TOTAL_PARTICLES * 0.50);
    const smallCount = Math.floor(surfCount * 0.60);
    const medCount   = Math.floor(surfCount * 0.25);
    const largeCount = surfCount - smallCount - medCount;
    const hazeCount  = TOTAL_PARTICLES - coreCount - surfCount;

    const coreShell = buildShell(coreCount,  RADIUS * 0.6, 0.20, CYAN_DIM, RADIUS * 0.008);
    const smallPts  = buildShell(smallCount, RADIUS,       0.50, CYAN,     RADIUS * 0.007);
    const medPts    = buildShell(medCount,   RADIUS,       0.70, CYAN,     RADIUS * 0.012);
    const largePts  = buildShell(largeCount, RADIUS,       1.00, ORANGE,   RADIUS * 0.020);
    const hazeShell = buildShell(hazeCount,  RADIUS * 1.1, 0.15, CYAN,     RADIUS * 0.006);
    pivot.add(coreShell, smallPts, medPts, largePts, hazeShell);

    // constellation lines
    const surfPos = smallPts.geometry.attributes.position;
    const dirs: THREE.Vector3[] = [];
    for (let i = 0; i < surfPos.count; i++) {
        dirs.push(new THREE.Vector3(surfPos.getX(i), surfPos.getY(i), surfPos.getZ(i)).normalize());
    }
    const linePts: number[] = [];
    let lc = 0;
    outer: for (let i = 0; i < dirs.length; i++) {
        for (let j = i + 1; j < dirs.length; j++) {
            if (Math.acos(Math.min(1, Math.max(-1, dirs[i].dot(dirs[j])))) < CONST_ANGLE_THRESH) {
                linePts.push(
                    surfPos.getX(i), surfPos.getY(i), surfPos.getZ(i),
                    surfPos.getX(j), surfPos.getY(j), surfPos.getZ(j),
                );
                if (++lc >= MAX_CONST_LINES) break outer;
            }
        }
    }
    const constGeo = new THREE.BufferGeometry();
    constGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
    pivot.add(new THREE.LineSegments(constGeo, new THREE.LineBasicMaterial({
        color: CYAN, transparent: true, opacity: 0.07,
        blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    // icosahedron wireframe
    pivot.add(new THREE.Mesh(
        new THREE.IcosahedronGeometry(RADIUS * 1.001, 4),
        new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.03 }),
    ));

    // atmosphere
    const makeAtmo = (r: number, op: number) => new THREE.Mesh(
        new THREE.SphereGeometry(r, 48, 48),
        new THREE.MeshBasicMaterial({
            color: CYAN, transparent: true, opacity: op,
            side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        }),
    );
    pivot.add(makeAtmo(RADIUS * 1.04, 0.04));
    pivot.add(makeAtmo(RADIUS * 1.12, 0.02));

    // cities
    interface CityMesh {
        dot: THREE.Mesh;
        rings: { mesh: THREE.Mesh; phase: number }[];
        label: THREE.Sprite | null;
        labelTex: THREE.CanvasTexture | null;
        phase: number;
    }
    const cityMeshes: CityMesh[] = CITIES.map((city) => {
        const pos = latLonToVec3(city.lat, city.lon, RADIUS);
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(RADIUS * 0.016, 16, 16),
            new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, blending: THREE.AdditiveBlending }),
        );
        dot.position.copy(pos);
        pivot.add(dot);

        const rings = [0, Math.PI].map((phaseOff) => {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(RADIUS * 0.008, RADIUS * 0.028, 32),
                new THREE.MeshBasicMaterial({
                    color: CYAN, transparent: true, opacity: 0,
                    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
                }),
            );
            ring.position.copy(pos);
            ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
            pivot.add(ring);
            return { mesh: ring, phase: phaseOff };
        });

        let label: THREE.Sprite | null = null;
        let labelTex: THREE.CanvasTexture | null = null;
        if (!isMobile()) {
            labelTex = makeLabelTexture(city.name, true);
            label = new THREE.Sprite(new THREE.SpriteMaterial({
                map: labelTex, transparent: true, opacity: 0,
                blending: THREE.NormalBlending, depthWrite: false,
            }));
            label.position.copy(pos.clone().multiplyScalar(1.14));
            label.scale.set(RADIUS * 0.55, RADIUS * 0.18, 1);
            pivot.add(label);
        }
        return { dot, rings, label, labelTex, phase: Math.random() * Math.PI * 2 };
    });

    // arcs
    ARC_PAIRS.forEach(([ai, bi]) => {
        const aPos = latLonToVec3(CITIES[ai].lat, CITIES[ai].lon, RADIUS);
        const bPos = latLonToVec3(CITIES[bi].lat, CITIES[bi].lon, RADIUS);
        const geo = new THREE.BufferGeometry().setFromPoints(buildArcPoints(aPos, bPos, RADIUS));
        pivot.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
            color: CYAN, transparent: true, opacity: 0.35,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })));
        pivot.add(new THREE.Line(geo.clone(), new THREE.LineBasicMaterial({
            color: 0x00b89a, transparent: true, opacity: 0.14,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })));
    });

    // animate callback
    return function animateLight(now: number, autoY: number) {
        pivot.rotation.y = autoY + state.mouseX;
        pivot.rotation.x = state.mouseY * 0.8;

        ([{ p: smallPts, b: 0.5 }, { p: medPts, b: 0.7 }, { p: largePts, b: 1.0 }] as const).forEach(({ p, b }) => {
            (p.material as THREE.PointsMaterial).opacity = state.particleOpacity * b;
        });

        const t = now * 0.001;
        cityMeshes.forEach((city) => {
            const pulse = (Math.sin(t * 1.2 + city.phase) + 1) * 0.5;
            (city.dot.material as THREE.MeshBasicMaterial).opacity = 0.6 + pulse * 0.4;
            city.rings.forEach((ring) => {
                const progress = ((t * 0.8 + city.phase + ring.phase) % (Math.PI * 2)) / (Math.PI * 2);
                ring.mesh.scale.setScalar(1 + progress * 3.5);
                (ring.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - progress) * 0.6);
            });
            if (city.label) {
                (city.label.material as THREE.SpriteMaterial).opacity = isMobile() ? 0 : pulse * 0.85;
            }
        });
    };
}

// ── DARK MODE: orbital rings atom design ─────────────────────────────────────
function buildDarkGlobe(
    pivot: THREE.Object3D,
    scene: THREE.Object3D,
    RADIUS: number,
) {
    const PRP = 0xa855f7;  // purple
    const CYN = 0x00ccff;  // cyan-blue
    const PNK = 0xff44aa;  // pink
    const WHT = 0xffffff;

    // glowing core sphere
    pivot.add(new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 0.32, 32, 32),
        new THREE.MeshBasicMaterial({ color: PRP, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending }),
    ));
    pivot.add(new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 0.36, 32, 32),
        new THREE.MeshBasicMaterial({ color: CYN, transparent: true, opacity: 0.06, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    ));

    // ghost icosahedron wireframe — very subtle
    pivot.add(new THREE.Mesh(
        new THREE.IcosahedronGeometry(RADIUS * 0.999, 3),
        new THREE.MeshBasicMaterial({ color: PRP, wireframe: true, transparent: true, opacity: 0.06 }),
    ));

    // atmosphere glow
    pivot.add(new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 1.05, 48, 48),
        new THREE.MeshBasicMaterial({ color: PRP, transparent: true, opacity: 0.04, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    ));
    pivot.add(new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 1.12, 48, 48),
        new THREE.MeshBasicMaterial({ color: CYN, transparent: true, opacity: 0.02, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    ));

    // sparse outer particle cloud
    const cloudArr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
        const v = randOnSphere(RADIUS * (1.08 + Math.random() * 0.18));
        cloudArr[i * 3] = v.x; cloudArr[i * 3 + 1] = v.y; cloudArr[i * 3 + 2] = v.z;
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(cloudArr, 3));
    pivot.add(new THREE.Points(cloudGeo, new THREE.PointsMaterial({
        color: PRP, size: RADIUS * 0.005, transparent: true, opacity: 0.18,
        sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })));

    // build a single orbital ring + its particles
    interface OrbitalRing {
        group: THREE.Object3D;
        particles: { mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>; angle: number; speed: number; radius: number }[];
    }

    function makeOrbitalRing(
        tiltX: number, tiltZ: number,
        radius: number, color: number,
        lineOpacity: number, particleCount: number,
        particleSize: number, speed: number,
    ): OrbitalRing {
        const group = new THREE.Object3D();
        group.rotation.x = tiltX;
        group.rotation.z = tiltZ;

        // ring line
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(radius * Math.cos(a), 0, radius * Math.sin(a)));
        }
        const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
        group.add(new THREE.Line(ringGeo, new THREE.LineBasicMaterial({
            color, transparent: true, opacity: lineOpacity,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })));
        // subtle white glow on top
        group.add(new THREE.Line(ringGeo.clone(), new THREE.LineBasicMaterial({
            color: WHT, transparent: true, opacity: lineOpacity * 0.2,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })));

        // orbiting particles
        const particles: OrbitalRing["particles"] = [];
        for (let i = 0; i < particleCount; i++) {
            const m = new THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>(
                new THREE.SphereGeometry(particleSize, 6, 6),
                new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }),
            );
            const angle = (i / particleCount) * Math.PI * 2;
            m.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
            group.add(m);
            particles.push({ mesh: m, angle, speed: speed * (0.9 + Math.random() * 0.2), radius });
        }

        pivot.add(group);
        return { group, particles };
    }

    const rings: OrbitalRing[] = [
        makeOrbitalRing(0,                0,              RADIUS,        PRP, 0.50, 55, RADIUS * 0.008,  0.8),
        makeOrbitalRing(Math.PI / 3,      0.2,            RADIUS * 0.95, CYN, 0.40, 40, RADIUS * 0.007, -0.6),
        makeOrbitalRing(Math.PI / 5,      Math.PI / 4,    RADIUS * 0.88, PNK, 0.30, 32, RADIUS * 0.009,  1.1),
        makeOrbitalRing(Math.PI * 0.7,    0.6,            RADIUS * 1.06, PRP, 0.22, 45, RADIUS * 0.006, -0.45),
        makeOrbitalRing(Math.PI * 0.15,   Math.PI * 0.6,  RADIUS * 0.80, CYN, 0.18, 28, RADIUS * 0.008,  0.9),
    ];

    // city arcs — thinner, satellite-path look
    ARC_PAIRS.slice(0, 9).forEach(([ai, bi], i) => {
        const aPos = latLonToVec3(CITIES[ai].lat, CITIES[ai].lon, RADIUS);
        const bPos = latLonToVec3(CITIES[bi].lat, CITIES[bi].lon, RADIUS);
        const geo = new THREE.BufferGeometry().setFromPoints(buildArcPoints(aPos, bPos, RADIUS * 1.08));
        const col = i % 2 === 0 ? PRP : CYN;
        pivot.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
            color: col, transparent: true, opacity: 0.35,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })));
    });

    // city dots
    interface CityDot { dot: THREE.Mesh; halo: THREE.Mesh; phase: number }
    const cityDots: CityDot[] = CITIES.map((city) => {
        const pos = latLonToVec3(city.lat, city.lon, RADIUS);
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(RADIUS * 0.018, 12, 12),
            new THREE.MeshBasicMaterial({ color: PNK, transparent: true, blending: THREE.AdditiveBlending }),
        );
        dot.position.copy(pos);
        pivot.add(dot);

        const halo = new THREE.Mesh(
            new THREE.RingGeometry(RADIUS * 0.022, RADIUS * 0.038, 32),
            new THREE.MeshBasicMaterial({ color: PRP, transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        halo.position.copy(pos);
        halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
        pivot.add(halo);

        return { dot, halo, phase: Math.random() * Math.PI * 2 };
    });

    let lastTime = performance.now();

    return function animateDark(now: number, autoY: number, mouseX: number, mouseY: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        // slow gentle rotation for the whole pivot
        pivot.rotation.y = autoY * 0.4 + mouseX * 0.5;
        pivot.rotation.x = mouseY * 0.4 + Math.sin(now * 0.0003) * 0.08;

        // advance each ring's particles
        rings.forEach((ring) => {
            ring.particles.forEach((p) => {
                p.angle += dt * p.speed;
                p.mesh.position.set(
                    p.radius * Math.cos(p.angle),
                    0,
                    p.radius * Math.sin(p.angle),
                );
                p.mesh.material.opacity = 0.5 + Math.abs(Math.sin(p.angle)) * 0.5;
            });
        });

        // pulse city dots
        const t = now * 0.001;
        cityDots.forEach((c) => {
            const pulse = (Math.sin(t * 1.3 + c.phase) + 1) * 0.5;
            (c.dot.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
            (c.halo.material as THREE.MeshBasicMaterial).opacity = 0.2 + pulse * 0.45;
            c.halo.scale.setScalar(1 + pulse * 0.25);
        });
    };
}

// ── component ─────────────────────────────────────────────────────────────────
export default function ParticleGlobe({ className, style }: ParticleGlobeProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        mouseX: 0, mouseY: 0,
        targetMouseX: 0, targetMouseY: 0,
        rotSpeed: DEFAULT_ROT_TARGET,
        targetRotSpeed: DEFAULT_ROT_TARGET,
        particleOpacity: 0.75,
        targetParticleOpacity: 0.75,
        isHovered: false,
    });
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const isLight = resolvedTheme === "light";
        const state = stateRef.current;

        const W = mount.clientWidth  || 500;
        const H = mount.clientHeight || 500;
        const RADIUS = Math.min(W, H) * 0.30;

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // scene / camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 10000);
        camera.position.z = RADIUS * 3.2;
        const pivot = new THREE.Object3D();
        scene.add(pivot);

        const isMobile = () => mount.clientWidth < 600;

        // build the correct design
        let animateFn: ((now: number, autoY: number) => void);

        if (isLight) {
            const lightAnim = buildLightGlobe(pivot, RADIUS, state, isMobile);
            animateFn = (now, autoY) => lightAnim(now, autoY);
        } else {
            const darkAnim = buildDarkGlobe(pivot, scene, RADIUS);
            animateFn = (now, autoY) => darkAnim(now, autoY, state.mouseX, state.mouseY);
        }

        // resize
        function resize() {
            const w = mount!.clientWidth  || 500;
            const h = mount!.clientHeight || 500;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // mouse
        const onMouseMove = (e: MouseEvent) => {
            const rect = mount!.getBoundingClientRect();
            state.targetMouseX = ((e.clientX - rect.left)  / rect.width  - 0.5) * 0.6;
            state.targetMouseY = ((e.clientY - rect.top)   / rect.height - 0.5) * -0.4;
        };
        const onMouseEnter = () => {
            state.isHovered = true;
            state.targetRotSpeed = HOVER_ROT_TARGET;
            state.targetParticleOpacity = 0.9;
        };
        const onMouseLeave = () => {
            state.isHovered = false;
            state.targetRotSpeed = DEFAULT_ROT_TARGET;
            state.targetParticleOpacity = 0.75;
        };
        mount.addEventListener("mousemove",  onMouseMove);
        mount.addEventListener("mouseenter", onMouseEnter);
        mount.addEventListener("mouseleave", onMouseLeave);

        // animation loop
        let autoY = 0;
        let last  = performance.now();
        let rafId = 0;

        function animate() {
            rafId = requestAnimationFrame(animate);
            const now   = performance.now();
            const delta = Math.min((now - last) / 1000, 0.05);
            last = now;

            state.mouseX    += (state.targetMouseX    - state.mouseX)    * MOUSE_LERP;
            state.mouseY    += (state.targetMouseY    - state.mouseY)    * MOUSE_LERP;
            state.rotSpeed  += (state.targetRotSpeed  - state.rotSpeed)  * ROT_LERP;
            state.particleOpacity += (state.targetParticleOpacity - state.particleOpacity) * OPACITY_LERP;

            const wobble = AUTO_ROT_BASE + AUTO_ROT_AMP * Math.sin(now * 0.0005);
            autoY += (state.isHovered ? state.rotSpeed : wobble) * delta * 60;

            animateFn(now, autoY);
            renderer.render(scene, camera);
        }

        // Reduced motion: render one static frame, no rotation loop.
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            animateFn(performance.now(), 0);
            renderer.render(scene, camera);
        } else {
            animate();
        }

        // cleanup
        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            mount.removeEventListener("mousemove",  onMouseMove);
            mount.removeEventListener("mouseenter", onMouseEnter);
            mount.removeEventListener("mouseleave", onMouseLeave);
            scene.traverse((obj) => {
                if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
                const mat = (obj as THREE.Mesh).material;
                if (mat) {
                    if (Array.isArray(mat)) {
                        mat.forEach((m) => m.dispose());
                    } else {
                        mat.dispose();
                    }
                }
            });
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, [resolvedTheme]);

    return (
        <div
            ref={mountRef}
            className={className}
            style={{ width: "100%", height: "100%", position: "relative", ...style }}
            aria-hidden="true"
        />
    );
}
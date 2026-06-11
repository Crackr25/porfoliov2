"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Shared scroll/mouse state written outside React renders to keep the
   r3f frame loop allocation-free. */
const pointer = { x: 0, y: 0 };
const scroll = { progress: 0 };

function useGlobalInputs() {
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            scroll.progress = max > 0 ? window.scrollY / max : 0;
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);
}

/* ---------------- Theme palettes ---------------- */

const palettes = {
    dark: {
        background: "#050208",
        fog: ["#050208", 12, 55] as [string, number, number],
        stars: ["#8b5cf6", "#06b6d4", "#d946ef", "#ffffff"],
        terrainA: "#8b5cf6",
        terrainB: "#06b6d4",
        terrainScrollTint: new THREE.Vector3(0.85, 0.3, 0.95),
        terrainOpacity: 0.35,
        additive: true,
        ambient: 0.25,
        dirColor: "#a78bfa",
        dirIntensity: 0.6,
    },
    cute: {
        background: "#fff7fb",
        fog: ["#fff7fb", 14, 60] as [string, number, number],
        stars: ["#f9a8d4", "#a5b4fc", "#7dd3fc", "#fbcfe8"],
        terrainA: "#f9a8d4",
        terrainB: "#a5b4fc",
        terrainScrollTint: new THREE.Vector3(0.49, 0.83, 0.99),
        terrainOpacity: 0.5,
        additive: false,
        ambient: 1.1,
        dirColor: "#fff0f7",
        dirIntensity: 1.2,
    },
};

type Palette = typeof palettes.dark;

/* ---------------- Starfield / sparkle drift ---------------- */

function Starfield({ count = 4000, palette }: { count?: number; palette: Palette }) {
    const ref = useRef<THREE.Points>(null);

    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const cols = palette.stars.map((c) => new THREE.Color(c));
        for (let i = 0; i < count; i++) {
            const r = 18 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
            positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            const c = cols[Math.floor(Math.random() * cols.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
            sizes[i] = Math.random() * 1.5 + 0.3;
        }
        return { positions, colors, sizes };
    }, [count, palette]);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
                uniforms: { uTime: { value: 0 } },
                vertexShader: /* glsl */ `
                    attribute float size;
                    varying vec3 vColor;
                    varying float vTwinkle;
                    uniform float uTime;
                    void main() {
                        vColor = color;
                        vec4 mv = modelViewMatrix * vec4(position, 1.0);
                        vTwinkle = 0.6 + 0.4 * sin(uTime * 1.5 + position.x * 5.0 + position.y * 3.0);
                        gl_PointSize = size * vTwinkle * (180.0 / -mv.z);
                        gl_Position = projectionMatrix * mv;
                    }
                `,
                fragmentShader: /* glsl */ `
                    varying vec3 vColor;
                    varying float vTwinkle;
                    void main() {
                        float d = length(gl_PointCoord - 0.5);
                        if (d > 0.5) discard;
                        float alpha = smoothstep(0.5, 0.0, d) * vTwinkle;
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `,
                vertexColors: true,
            }),
        [palette]
    );

    useFrame((state) => {
        material.uniforms.uTime.value = state.clock.elapsedTime;
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.015 + scroll.progress * Math.PI * 0.5;
        }
    });

    return (
        <points ref={ref} material={material}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
            </bufferGeometry>
        </points>
    );
}

/* ---------------- Wireframe terrain ---------------- */

function Terrain({ palette }: { palette: Palette }) {
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                wireframe: true,
                transparent: true,
                uniforms: {
                    uTime: { value: 0 },
                    uScroll: { value: 0 },
                    uColorA: { value: new THREE.Color(palette.terrainA) },
                    uColorB: { value: new THREE.Color(palette.terrainB) },
                    uTint: { value: palette.terrainScrollTint },
                    uOpacity: { value: palette.terrainOpacity },
                },
                vertexShader: /* glsl */ `
                    uniform float uTime;
                    uniform float uScroll;
                    varying float vElevation;
                    varying float vDist;

                    // 2D simplex-style noise (cheap hash version)
                    vec2 hash(vec2 p) {
                        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
                    }
                    float noise(vec2 p) {
                        const float K1 = 0.366025404;
                        const float K2 = 0.211324865;
                        vec2 i = floor(p + (p.x + p.y) * K1);
                        vec2 a = p - i + (i.x + i.y) * K2;
                        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                        vec2 b = a - o + K2;
                        vec2 c = a - 1.0 + 2.0 * K2;
                        vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
                        vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
                        return dot(n, vec3(70.0));
                    }

                    void main() {
                        vec3 pos = position;
                        float t = uTime * 0.15;
                        vec2 p = pos.xy * 0.12 + vec2(0.0, t + uScroll * 4.0);
                        float e = noise(p) * 1.6 + noise(p * 2.5) * 0.5;
                        // flatten a corridor down the middle
                        float corridor = smoothstep(0.0, 8.0, abs(pos.x));
                        e *= 0.25 + corridor * 1.4;
                        pos.z += e;
                        vElevation = e;
                        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                        vDist = -mv.z;
                        gl_Position = projectionMatrix * mv;
                    }
                `,
                fragmentShader: /* glsl */ `
                    uniform vec3 uColorA;
                    uniform vec3 uColorB;
                    uniform vec3 uTint;
                    uniform float uOpacity;
                    uniform float uScroll;
                    varying float vElevation;
                    varying float vDist;
                    void main() {
                        vec3 base = mix(uColorA, uColorB, clamp(vElevation * 0.4 + 0.5, 0.0, 1.0));
                        base = mix(base, uTint, uScroll * 0.6);
                        float fade = 1.0 - smoothstep(15.0, 55.0, vDist);
                        gl_FragColor = vec4(base, fade * uOpacity);
                    }
                `,
            }),
        [palette]
    );

    useFrame((state) => {
        material.uniforms.uTime.value = state.clock.elapsedTime;
        material.uniforms.uScroll.value = THREE.MathUtils.lerp(
            material.uniforms.uScroll.value,
            scroll.progress,
            0.05
        );
    });

    return (
        <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, -10]}>
            <planeGeometry args={[90, 90, 120, 120]} />
        </mesh>
    );
}

/* ---------------- Shared scroll-recede rig for the centerpiece ---------------- */

function useCenterpieceMotion(group: React.RefObject<THREE.Group | null>) {
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        group.current.rotation.x = Math.sin(t * 0.3) * 0.1 + pointer.y * 0.15;
        const target = scroll.progress;
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -4 - target * 14, 0.06);
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0.4 + target * 5, 0.06);
        const s = 1 - Math.min(target * 1.2, 0.65);
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.08));
    });
}

/* ---------------- Dark mode: crystal centerpiece ---------------- */

function Crystal() {
    const group = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Mesh>(null);
    useCenterpieceMotion(group);

    useFrame((state, delta) => {
        if (!group.current || !inner.current) return;
        group.current.rotation.y += delta * 0.25;
        group.current.rotation.z = pointer.x * 0.15;
        inner.current.rotation.x -= delta * 0.4;
        inner.current.rotation.z += delta * 0.3;
    });

    return (
        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
            <group ref={group} position={[0, 0.4, -4]}>
                <mesh>
                    <icosahedronGeometry args={[1.6, 1]} />
                    <meshStandardMaterial
                        color="#8b5cf6"
                        emissive="#5b21b6"
                        emissiveIntensity={0.6}
                        metalness={0.9}
                        roughness={0.15}
                        wireframe
                    />
                </mesh>
                <mesh ref={inner} scale={0.62}>
                    <icosahedronGeometry args={[1.6, 0]} />
                    <meshStandardMaterial
                        color="#06b6d4"
                        emissive="#0e7490"
                        emissiveIntensity={1.4}
                        metalness={0.6}
                        roughness={0.2}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
                <pointLight color="#8b5cf6" intensity={6} distance={12} />
            </group>
        </Float>
    );
}

/* ---------------- Cute mode: cat centerpiece ---------------- */

function Ear({ side }: { side: 1 | -1 }) {
    return (
        <group position={[side * 0.62, 0.85, 0]} rotation={[0, 0, side * -0.35]}>
            <mesh>
                <coneGeometry args={[0.32, 0.55, 4]} />
                <meshStandardMaterial color="#fda4af" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.04, 0.08]} scale={0.55}>
                <coneGeometry args={[0.32, 0.55, 4]} />
                <meshStandardMaterial color="#fbcfe8" roughness={0.9} />
            </mesh>
        </group>
    );
}

function Eye({ side, blink }: { side: 1 | -1; blink: React.RefObject<THREE.Mesh | null> }) {
    return (
        <mesh ref={side === 1 ? blink : undefined} position={[side * 0.42, 0.12, 0.93]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#4a3850" roughness={0.3} />
        </mesh>
    );
}

function Cat() {
    const group = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const tail = useRef<THREE.Group>(null);
    const leftEye = useRef<THREE.Mesh>(null);
    const rightEye = useRef<THREE.Mesh>(null);
    useCenterpieceMotion(group);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (head.current) {
            // head tracks the cursor like a curious cat
            head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, pointer.x * 0.6, 0.08);
            head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -pointer.y * 0.4, 0.08);
        }
        if (tail.current) {
            tail.current.rotation.z = Math.sin(t * 2.2) * 0.35 - 0.4;
        }
        // periodic blink
        const blink = Math.abs(Math.sin(t * 0.7)) > 0.985 ? 0.1 : 1;
        if (leftEye.current) leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, blink, 0.5);
        if (rightEye.current) rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, blink, 0.5);
    });

    return (
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
            <group ref={group} position={[0, 0.4, -4]}>
                {/* body */}
                <mesh position={[0, -1.15, -0.15]} scale={[1, 0.85, 1]}>
                    <sphereGeometry args={[1.05, 32, 32]} />
                    <meshStandardMaterial color="#fda4af" roughness={0.85} />
                </mesh>
                {/* chest patch */}
                <mesh position={[0, -1.05, 0.55]} scale={[0.55, 0.5, 0.45]}>
                    <sphereGeometry args={[1, 24, 24]} />
                    <meshStandardMaterial color="#fff1f2" roughness={0.9} />
                </mesh>
                {/* paws */}
                {[-0.45, 0.45].map((x) => (
                    <mesh key={x} position={[x, -1.85, 0.55]} scale={[0.28, 0.2, 0.32]}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color="#fff1f2" roughness={0.9} />
                    </mesh>
                ))}
                {/* tail */}
                <group ref={tail} position={[0.85, -1.5, -0.4]}>
                    <mesh position={[0.45, 0.3, 0]} rotation={[0, 0, -0.8]}>
                        <capsuleGeometry args={[0.16, 1.1, 8, 16]} />
                        <meshStandardMaterial color="#fda4af" roughness={0.85} />
                    </mesh>
                    <mesh position={[0.85, 0.78, 0]}>
                        <sphereGeometry args={[0.18, 16, 16]} />
                        <meshStandardMaterial color="#fff1f2" roughness={0.9} />
                    </mesh>
                </group>
                {/* head */}
                <group ref={head} position={[0, 0.2, 0]}>
                    <mesh>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="#fda4af" roughness={0.85} />
                    </mesh>
                    <Ear side={1} />
                    <Ear side={-1} />
                    <Eye side={1} blink={rightEye} />
                    <Eye side={-1} blink={leftEye} />
                    {/* muzzle + nose */}
                    <mesh position={[0, -0.18, 0.92]} scale={[0.42, 0.3, 0.25]}>
                        <sphereGeometry args={[1, 24, 24]} />
                        <meshStandardMaterial color="#fff1f2" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -0.05, 1.12]}>
                        <sphereGeometry args={[0.07, 12, 12]} />
                        <meshStandardMaterial color="#f472b6" roughness={0.4} />
                    </mesh>
                    {/* blush */}
                    {[-0.62, 0.62].map((x) => (
                        <mesh key={x} position={[x, -0.12, 0.78]} scale={[0.16, 0.09, 0.05]}>
                            <sphereGeometry args={[1, 12, 12]} />
                            <meshStandardMaterial color="#fb7185" transparent opacity={0.55} roughness={1} />
                        </mesh>
                    ))}
                </group>
                <pointLight color="#fff" intensity={2} distance={10} position={[0, 1, 3]} />
            </group>
        </Float>
    );
}

/* ---------------- Orbiters: tech shards (dark) / yarn & hearts (cute) ---------------- */

function Orbiters({ count = 14, cute }: { count?: number; cute: boolean }) {
    const group = useRef<THREE.Group>(null);
    const darkColors = ["#06b6d4", "#8b5cf6", "#d946ef"];
    const cuteColors = ["#f9a8d4", "#a5b4fc", "#7dd3fc", "#fcd34d"];
    const orbiters = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                radius: 3.2 + Math.random() * 4,
                speed: 0.15 + Math.random() * 0.3,
                offset: (i / count) * Math.PI * 2,
                y: (Math.random() - 0.5) * 3,
                scale: cute ? 0.16 + Math.random() * 0.2 : 0.1 + Math.random() * 0.22,
                color: (cute ? cuteColors : darkColors)[i % (cute ? cuteColors.length : darkColors.length)],
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [count, cute]
    );

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        group.current.children.forEach((child, i) => {
            const s = orbiters[i];
            const a = s.offset + t * s.speed;
            child.position.set(
                Math.cos(a) * s.radius,
                s.y + Math.sin(t * 0.8 + s.offset) * 0.4,
                Math.sin(a) * s.radius - 4
            );
            child.rotation.x = t * 0.5 + s.offset;
            child.rotation.y = t * 0.3;
        });
        group.current.position.z = -scroll.progress * 10;
        group.current.rotation.y = scroll.progress * Math.PI;
    });

    return (
        <group ref={group}>
            {orbiters.map((s, i) => (
                <mesh key={i} scale={s.scale}>
                    {cute ? (
                        // yarn balls: a sphere wrapped in two thin torus "threads"
                        <sphereGeometry args={[1, 16, 16]} />
                    ) : (
                        <octahedronGeometry args={[1, 0]} />
                    )}
                    <meshStandardMaterial
                        color={s.color}
                        emissive={cute ? "#000000" : s.color}
                        emissiveIntensity={cute ? 0 : 0.8}
                        metalness={cute ? 0.1 : 0.8}
                        roughness={cute ? 0.9 : 0.2}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ---------------- Camera rig ---------------- */

function CameraRig() {
    const { camera } = useThree();
    useFrame(() => {
        const targetX = pointer.x * 0.8;
        const targetY = 0.5 + pointer.y * 0.5 - scroll.progress * 1.5;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 - scroll.progress * 2, 0.04);
        camera.lookAt(0, 0.2 - scroll.progress * 1.2, -6);
    });
    return null;
}

/* ---------------- Scene root ---------------- */

export default function Scene({ cute = false }: { cute?: boolean }) {
    useGlobalInputs();
    const [degraded, setDegraded] = useState(false);
    const palette = cute ? palettes.cute : palettes.dark;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
            <Canvas
                key={cute ? "cute" : "dark"}
                camera={{ position: [0, 0.5, 6], fov: 60 }}
                dpr={[1, degraded ? 1.5 : 2]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <PerformanceMonitor onDecline={() => setDegraded(true)}>
                    <color attach="background" args={[palette.background]} />
                    <fog attach="fog" args={palette.fog} />
                    <ambientLight intensity={palette.ambient} />
                    <directionalLight position={[5, 8, 5]} intensity={palette.dirIntensity} color={palette.dirColor} />

                    <Starfield count={degraded ? 1800 : cute ? 2500 : 4000} palette={palette} />
                    <Terrain palette={palette} />
                    {cute ? <Cat /> : <Crystal />}
                    <Orbiters count={degraded ? 8 : 14} cute={cute} />
                    <CameraRig />

                    {!degraded && !cute && (
                        <EffectComposer>
                            <Bloom intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.9} mipmapBlur />
                            <Vignette eskil={false} offset={0.15} darkness={0.85} />
                        </EffectComposer>
                    )}
                </PerformanceMonitor>
            </Canvas>
        </div>
    );
}

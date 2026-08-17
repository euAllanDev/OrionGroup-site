"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VERTEX = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;

  void main() {
    vUv = uv;
    vec3 p = position;
    float waveA = sin(p.x * 1.25 + uTime * .48 + uScroll * 5.0) * .16;
    float waveB = cos(p.y * 1.6 - uTime * .31 + uScroll * 3.0) * .12;
    p.z += waveA + waveB;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;

  void main() {
    vec3 blue = vec3(.13, .40, 1.0);
    vec3 cyan = vec3(.32, .77, 1.0);
    vec3 violet = vec3(.54, .40, 1.0);
    float wave = sin(vUv.x * 8.0 + uTime * .2 + uScroll * 8.0) * .045;
    float band = 1.0 - smoothstep(.06, .32, abs(vUv.y - .5 + wave));
    float edges = smoothstep(0.0, .12, vUv.x) * smoothstep(0.0, .12, 1.0 - vUv.x);
    edges *= smoothstep(0.0, .12, vUv.y) * smoothstep(0.0, .12, 1.0 - vUv.y);
    vec3 color = mix(blue, cyan, vUv.x);
    color = mix(color, violet, smoothstep(.58, 1.0, vUv.x + sin(uTime * .15) * .05));
    gl_FragColor = vec4(color, band * edges * .11);
  }
`;

function FluidRibbon() {
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    material.current.uniforms.uScroll.value = window.scrollY / max;
  });

  return (
    <mesh position={[0.8, -0.4, -2.1]} rotation={[0.08, -0.12, -0.08]} scale={[2.65, 1.05, 1]}>
      <planeGeometry args={[4, 4, 50, 50]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const edgeBias = Math.random() > 0.48 ? 1 : -1;
      data[i3] = edgeBias * (1.9 + Math.random() * 3.5) + (Math.random() - 0.5) * 1.5;
      data[i3 + 1] = (Math.random() - 0.5) * 7.5;
      data[i3 + 2] = -1.2 + Math.random() * 2.4;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scroll = window.scrollY / max;
    points.current.rotation.z += delta * 0.018;
    points.current.rotation.y = THREE.MathUtils.damp(points.current.rotation.y, state.pointer.x * 0.07 + scroll * 0.3, 2.2, delta);
    points.current.position.y = THREE.MathUtils.damp(points.current.position.y, (0.5 - scroll) * 0.9, 2.5, delta);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6a9cff" size={0.028} transparent opacity={0.46} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function OrbitalGlyphs() {
  const group = useRef<THREE.Group>(null);
  const dotA = useRef<THREE.Mesh>(null);
  const dotB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = window.scrollY / max;
    group.current.rotation.z += delta * (0.025 + p * 0.035);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * 0.08, 3.2, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.08, 3.2, delta);

    if (dotA.current) {
      const t = state.clock.elapsedTime * 0.34;
      dotA.current.position.set(Math.cos(t) * 2.35, Math.sin(t) * 0.76, 0.1);
    }
    if (dotB.current) {
      const t = -state.clock.elapsedTime * 0.27 + 2.1;
      dotB.current.position.set(Math.cos(t) * 3.05, Math.sin(t) * 1.15, -0.2);
    }
  });

  return (
    <group ref={group} position={[0.85, 0.1, -0.9]} rotation={[0.08, 0.02, -0.1]}>
      <mesh scale={[1.45, 0.54, 1]}>
        <torusGeometry args={[1.7, 0.011, 8, 160]} />
        <meshBasicMaterial color="#8fb3ff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh scale={[1.55, 0.64, 1]} rotation={[0.15, 0.18, 0.4]}>
        <torusGeometry args={[2.0, 0.008, 8, 160]} />
        <meshBasicMaterial color="#a889ff" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <mesh ref={dotA}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshBasicMaterial color="#5a8dff" transparent opacity={0.72} />
      </mesh>
      <mesh ref={dotB}>
        <sphereGeometry args={[0.042, 20, 20]} />
        <meshBasicMaterial color="#9a7dff" transparent opacity={0.68} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <FluidRibbon />
      <Dust />
      <OrbitalGlyphs />
    </>
  );
}

export function MotionWorld() {
  return (
    <div className="motion-world" aria-hidden="true">
      <Canvas
        dpr={[1, 1.55]}
        camera={{ position: [0, 0, 5.4], fov: 43 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <Scene />
      </Canvas>
    </div>
  );
}

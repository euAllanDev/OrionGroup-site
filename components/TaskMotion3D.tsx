"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useSectionLoaded } from "./SectionLoadManager";

type Card = { x: number; y: number; z: number; rot: number; scale: number };

function FlowCards() {
  const group = useRef<THREE.Group>(null);
  const cards = useMemo<Card[]>(() => [
    { x: -1.5, y: 1.0, z: 0.0, rot: -0.25, scale: 1.0 },
    { x: 0.65, y: 1.25, z: -0.25, rot: 0.15, scale: 0.82 },
    { x: -0.4, y: -0.2, z: 0.22, rot: -0.08, scale: 0.92 },
    { x: 1.45, y: -0.7, z: -0.15, rot: 0.18, scale: 0.78 },
    { x: -1.2, y: -1.15, z: -0.32, rot: -0.14, scale: 0.72 },
  ], []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = window.scrollY / max;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.12, 3.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.08, 3.5, delta);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + p * 5) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.08, -0.08, -0.04]}>
      {cards.map((card, index) => (
        <group key={index} position={[card.x, card.y, card.z]} rotation={[0, 0, card.rot]} scale={card.scale}>
          <RoundedBox args={[1.45, 0.55, 0.12]} radius={0.12} smoothness={5}>
            <meshPhysicalMaterial
              color={index === 0 ? "#4aa9ff" : "#f8fbff"}
              roughness={0.24}
              clearcoat={1}
              clearcoatRoughness={0.15}
            />
          </RoundedBox>
          <mesh position={[-0.53, 0, 0.085]}>
            <sphereGeometry args={[0.075, 20, 20]} />
            <meshBasicMaterial color={index === 0 ? "#ffffff" : "#5c95ff"} />
          </mesh>
          <mesh position={[0.14, 0.06, 0.085]} scale={[0.5, 0.035, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={index === 0 ? "#e9f6ff" : "#93a9c6"} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.0, -0.08, 0.085]} scale={[0.7, 0.02, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={index === 0 ? "#d7efff" : "#c5d1e1"} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function TaskMotion3D({ sectionIndex }: { sectionIndex: number }) {
  const isLoaded = useSectionLoaded(sectionIndex);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="r3f-fill" aria-hidden="true">
      <Canvas
        frameloop={isLoaded && !shouldReduceMotion ? "always" : "never"}
        dpr={[1, 1.3]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={2.4} />
        <directionalLight position={[3, 4, 5]} intensity={3.4} />
        <pointLight position={[-2, 1, 3]} intensity={12} color="#6bdcff" distance={7} />
        <FlowCards />
      </Canvas>
    </div>
  );
}

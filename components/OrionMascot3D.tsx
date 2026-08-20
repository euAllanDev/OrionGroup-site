"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useSectionLoaded } from "./SectionLoadManager";

type MascotProps = {
  compact?: boolean;
  sleepy?: boolean;
};

type OrionMascot3DProps = MascotProps & {
  sectionIndex: number;
};

function MascotMesh({ compact = false, sleepy = false }: MascotProps) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const leftHand = useRef<THREE.Mesh>(null);
  const rightHand = useRef<THREE.Mesh>(null);
  const lastPointer = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetX = state.pointer.y * 0.14;
    const targetY = state.pointer.x * 0.21;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 5.8, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 5.8, delta);

    const pointerSpeed = state.pointer.distanceTo(lastPointer.current);
    lastPointer.current.copy(state.pointer);
    const stretch = THREE.MathUtils.clamp(pointerSpeed * 0.9, 0, 0.075);
    if (body.current) {
      body.current.scale.x = THREE.MathUtils.damp(body.current.scale.x, 1 + stretch, 8, delta);
      body.current.scale.y = THREE.MathUtils.damp(body.current.scale.y, 1 - stretch * 0.55, 8, delta);
    }

    const blinkPhase = state.clock.elapsedTime % 5.6;
    const blinking = blinkPhase > 5.28 && blinkPhase < 5.47;
    const blink = blinking ? 0.10 : sleepy ? 0.72 : 1;
    const eyeScaleY = THREE.MathUtils.damp(leftEye.current?.scale.y ?? blink, blink * 0.36, 18, delta);

    const eyeX = THREE.MathUtils.clamp(state.pointer.x * 0.055, -0.055, 0.055);
    const eyeY = THREE.MathUtils.clamp(state.pointer.y * 0.035, -0.035, 0.035);
    if (leftEye.current && rightEye.current) {
      leftEye.current.position.x = -0.34 + eyeX;
      rightEye.current.position.x = 0.34 + eyeX;
      leftEye.current.position.y = 0.14 + eyeY;
      rightEye.current.position.y = 0.14 + eyeY;
      leftEye.current.scale.y = eyeScaleY;
      rightEye.current.scale.y = eyeScaleY;
    }

    const handWave = Math.sin(state.clock.elapsedTime * 2.2) * 0.035;
    if (leftHand.current) leftHand.current.position.y = -0.18 + handWave;
    if (rightHand.current) rightHand.current.position.y = -0.18 - handWave;
  });

  const scale = compact ? 0.82 : 1;

  return (
    <Float speed={1.55} rotationIntensity={0.055} floatIntensity={0.45}>
      <group ref={group} scale={scale}>
        <mesh ref={body}>
          <sphereGeometry args={[1.05, 48, 48]} />
          <meshPhysicalMaterial
            color="#2e78ff"
            roughness={0.14}
            metalness={0.025}
            clearcoat={1}
            clearcoatRoughness={0.12}
            sheen={0.35}
            sheenColor="#9ec3ff"
          />
        </mesh>

        <mesh ref={leftHand} position={[-0.98, -0.18, 0.12]} scale={[0.31, 0.31, 0.31]}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshPhysicalMaterial color="#3d82ff" roughness={0.18} clearcoat={1} />
        </mesh>
        <mesh ref={rightHand} position={[0.98, -0.18, 0.12]} scale={[0.31, 0.31, 0.31]}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshPhysicalMaterial color="#3d82ff" roughness={0.18} clearcoat={1} />
        </mesh>

        <mesh ref={leftEye} position={[-0.34, 0.14, 0.96]} scale={[0.2, 0.36, 0.1]}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color="#071128" roughness={0.18} />
        </mesh>
        <mesh ref={rightEye} position={[0.34, 0.14, 0.96]} scale={[0.2, 0.36, 0.1]}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color="#071128" roughness={0.18} />
        </mesh>

        <mesh position={[-0.39, 0.31, 1.055]} scale={[0.047, 0.085, 0.045]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.29, 0.31, 1.055]} scale={[0.047, 0.085, 0.045]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </Float>
  );
}

export function OrionMascot3D({ sectionIndex, ...props }: OrionMascot3DProps) {
  const isLoaded = useSectionLoaded(sectionIndex);

  return (
    <div className="r3f-fill">
      <Canvas
        frameloop={isLoaded ? "always" : "never"}
        dpr={[1, 1.3]}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={2.2} />
        <directionalLight position={[3, 5, 5]} intensity={4.3} color="#ffffff" />
        <pointLight position={[-3, 1, 4]} intensity={20} color="#85baff" distance={8} />
        <pointLight position={[3, -2, 3]} intensity={13} color="#9b7cff" distance={7} />
        <MascotMesh {...props} />
      </Canvas>
    </div>
  );
}

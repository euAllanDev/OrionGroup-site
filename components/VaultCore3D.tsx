"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import { MutableRefObject, useMemo, useRef } from "react";
import { useInView } from "motion/react";
import * as THREE from "three";

type VaultCore3DProps = {
  progressRef: MutableRefObject<number>;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const range = (value: number, start: number, end: number) => clamp01((value - start) / (end - start));
const smooth = (value: number) => value * value * (3 - 2 * value);

const NODES: [number, number, number][] = [
  [0, 0, -1.75],
  [-1.28, 0.72, -1.9],
  [1.26, 0.8, -1.86],
  [-1.78, -0.32, -2.02],
  [1.76, -0.18, -1.98],
  [-0.86, -1.06, -1.82],
  [0.82, -1.06, -1.9],
  [-0.2, 1.35, -2.12],
  [0.54, 1.58, -2.22],
  [-2.18, 0.82, -2.2],
  [2.18, 0.82, -2.14],
  [-2.3, -1.0, -2.24],
  [2.32, -0.92, -2.22],
  [-0.08, -1.78, -2.08],
  [-1.2, 1.62, -2.3],
  [1.42, 1.64, -2.34],
  [0.06, 2.05, -2.48],
  [-1.78, -1.6, -2.34],
  [1.76, -1.56, -2.32],
];

const TASK_TARGETS: [number, number, number][] = NODES.map((_, index) => {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return [-1.95 + col * 1.28, 1.55 - row * 0.68, -2.0 - (col % 2) * 0.08];
});

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 5], [0, 6], [0, 7],
  [1, 3], [1, 7], [1, 9], [1, 14],
  [2, 4], [2, 8], [2, 10], [2, 15],
  [3, 5], [3, 11], [5, 13], [5, 17],
  [4, 6], [4, 12], [6, 13], [6, 18],
  [7, 8], [7, 14], [8, 15], [8, 16],
  [14, 16], [15, 16], [11, 17], [12, 18],
];

function LockBolt({ position, axis = "x", progressRef }: { position: [number, number, number]; axis?: "x" | "y"; progressRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useRef(new THREE.Vector3(...position));

  useFrame(() => {
    if (!ref.current) return;
    const unlock = smooth(range(progressRef.current, 0.19, 0.34));
    ref.current.position.copy(base.current);
    if (axis === "x") ref.current.position.x += Math.sign(position[0] || 1) * unlock * 0.36;
    else ref.current.position.y += Math.sign(position[1] || 1) * unlock * 0.36;
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={axis === "x" ? [0.42, 0.1, 0.12] : [0.1, 0.42, 0.12]} />
      <meshPhysicalMaterial color="#174dbe" roughness={0.25} clearcoat={1} transparent />
    </mesh>
  );
}

function VaultShell({ progressRef }: VaultCore3DProps) {
  const root = useRef<THREE.Group>(null);
  const doorPivot = useRef<THREE.Group>(null);
  const dial = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const p = progressRef.current;
    const approach = smooth(range(p, 0.0, 0.15));
    const dialTurn = smooth(range(p, 0.10, 0.25));
    const open = smooth(range(p, 0.24, 0.43));
    const enter = smooth(range(p, 0.42, 0.58));
    const disappear = smooth(range(p, 0.52, 0.64));

    if (root.current) {
      // Keep the physical vault stable and centered. The old version scaled the
      // model by ~4x while also moving the camera, which caused the clipping seen
      // in the browser recording. The push-in is now camera/portal driven.
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        state.pointer.x * 0.045 - 0.055 + open * 0.035,
        4.6,
        delta,
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -state.pointer.y * 0.032 + 0.018,
        4.6,
        delta,
      );
      const scale = 0.94 + approach * 0.12 + enter * 0.05;
      root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, scale, 5.2, delta));
      root.current.position.x = THREE.MathUtils.damp(root.current.position.x, 0, 5.2, delta);
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, -0.05 + approach * 0.03, 5.2, delta);
      root.current.position.z = THREE.MathUtils.damp(root.current.position.z, 0, 5.2, delta);

      root.current.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const material = object.material;
        const materials = Array.isArray(material) ? material : [material];
        materials.forEach((mat) => {
          if (!("opacity" in mat)) return;
          mat.transparent = true;
          mat.opacity = 1 - disappear;
          mat.depthWrite = disappear < 0.35;
        });
      });
      root.current.visible = disappear < 0.995;
    }

    if (dial.current) dial.current.rotation.z = -dialTurn * Math.PI * 5.4;
    if (doorPivot.current) doorPivot.current.rotation.y = -open * Math.PI * 0.62;
    if (core.current) {
      core.current.rotation.z += delta * (0.18 + enter * 0.32);
      core.current.scale.setScalar(0.72 + open * 0.2 + enter * 0.16);
    }
    if (innerRing.current) innerRing.current.rotation.z -= delta * 0.42;
  });

  return (
    <group ref={root} rotation={[0.04, -0.12, 0.015]}>
      <RoundedBox args={[2.75, 2.75, 1.36]} radius={0.3} smoothness={9} castShadow receiveShadow>
        <meshPhysicalMaterial color="#195fe7" roughness={0.2} metalness={0.04} clearcoat={1} clearcoatRoughness={0.1} transparent />
      </RoundedBox>

      <RoundedBox args={[2.24, 2.24, 0.24]} radius={0.24} smoothness={8} position={[0, 0, 0.79]}>
        <meshPhysicalMaterial color="#06152f" roughness={0.35} metalness={0.06} emissive="#0a2d81" emissiveIntensity={0.7} transparent />
      </RoundedBox>

      <group ref={core} position={[0, 0, 0.98]}>
        <mesh ref={innerRing} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.63, 0.035, 18, 100]} />
          <meshBasicMaterial color="#86d7ff" transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.39, 0.055, 18, 90]} />
          <meshBasicMaterial color="#8e79ff" transparent opacity={0.88} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.18, 36, 36]} />
          <meshPhysicalMaterial color="#ecf8ff" emissive="#68b8ff" emissiveIntensity={2.2} roughness={0.12} clearcoat={1} transparent />
        </mesh>
      </group>

      <pointLight position={[0, 0, 1.7]} intensity={26} color="#5fa9ff" distance={4.5} />

      <group ref={doorPivot} position={[-1.12, 0, 0.78]}>
        <group position={[1.12, 0, 0]}>
          <RoundedBox args={[2.22, 2.22, 0.2]} radius={0.22} smoothness={8} castShadow>
            <meshPhysicalMaterial color="#e6f1ff" roughness={0.18} metalness={0.03} clearcoat={1} clearcoatRoughness={0.08} transparent />
          </RoundedBox>
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.73, 0.73, 0.12, 64]} />
            <meshPhysicalMaterial color="#83b4ff" roughness={0.18} clearcoat={1} transparent />
          </mesh>
          <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.49, 0.065, 20, 72]} />
            <meshPhysicalMaterial color="#246bff" roughness={0.2} clearcoat={1} transparent />
          </mesh>
          <group ref={dial} position={[0, 0, 0.3]}>
            {[0, 1, 2].map((index) => (
              <RoundedBox key={index} args={[0.085, 0.82, 0.09]} radius={0.04} smoothness={5} rotation={[0, 0, (Math.PI * 2 * index) / 3]}>
                <meshPhysicalMaterial color="#1457d9" roughness={0.22} clearcoat={1} transparent />
              </RoundedBox>
            ))}
            <mesh>
              <sphereGeometry args={[0.13, 30, 30]} />
              <meshPhysicalMaterial color="#f8fcff" roughness={0.16} clearcoat={1} transparent />
            </mesh>
          </group>
          <LockBolt position={[-0.9, 0.72, 0.23]} axis="x" progressRef={progressRef} />
          <LockBolt position={[0.9, -0.72, 0.23]} axis="x" progressRef={progressRef} />
          <LockBolt position={[-0.72, -0.9, 0.23]} axis="y" progressRef={progressRef} />
          <LockBolt position={[0.72, 0.9, 0.23]} axis="y" progressRef={progressRef} />
        </group>
      </group>

      {[-0.72, 0.72].map((y) => (
        <mesh key={y} position={[-1.46, y, 0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.42, 28]} />
          <meshPhysicalMaterial color="#0e49bd" roughness={0.28} clearcoat={0.8} transparent />
        </mesh>
      ))}
    </group>
  );
}

function KnowledgeConstellation({ progressRef }: VaultCore3DProps) {
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lines = useRef<THREE.LineSegments>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dust = useRef<THREE.Points>(null);

  const linePositions = useMemo(() => new Float32Array(EDGES.length * 2 * 3), []);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  const dustPositions = useMemo(() => {
    const result = new Float32Array(170 * 3);
    for (let index = 0; index < 170; index += 1) {
      result[index * 3] = (Math.random() - 0.5) * 7.2;
      result[index * 3 + 1] = (Math.random() - 0.5) * 5.5;
      result[index * 3 + 2] = -1.5 - Math.random() * 3.0;
    }
    return result;
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    const reveal = smooth(range(p, 0.59, 0.75));
    const connect = smooth(range(p, 0.66, 0.88));
    const reorganize = smooth(range(p, 0.91, 0.995));

    if (group.current) {
      group.current.visible = p > 0.565;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.06 + Math.sin(state.clock.elapsedTime * 0.08) * 0.035, 2.3, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.035, 2.5, delta);
      const scale = 0.66 + reveal * 0.34;
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 4, delta));
    }

    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const nodeReveal = smooth(range(p, 0.60 + index * 0.006, 0.70 + index * 0.006));
      const source = NODES[index];
      const target = TASK_TARGETS[index];
      node.position.set(
        THREE.MathUtils.lerp(source[0], target[0], reorganize),
        THREE.MathUtils.lerp(source[1], target[1], reorganize),
        THREE.MathUtils.lerp(source[2], target[2], reorganize),
      );
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.25 + index * 0.7) * 0.08 * (1 - reorganize);
      node.scale.setScalar(nodeReveal * breathe);
      node.rotation.y += delta * 0.22;
      const halo = haloRefs.current[index];
      if (halo) {
        halo.position.copy(node.position);
        halo.scale.setScalar(nodeReveal * (1.25 + Math.sin(state.clock.elapsedTime * 1.0 + index) * 0.12));
      }
    });

    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    EDGES.forEach(([a, b], edgeIndex) => {
      const edgeReveal = smooth(range(p, 0.63 + edgeIndex * 0.006, 0.72 + edgeIndex * 0.006));
      const nodeA = nodeRefs.current[a];
      const nodeB = nodeRefs.current[b];
      if (!nodeA || !nodeB) return;
      const ax = nodeA.position.x;
      const ay = nodeA.position.y;
      const az = nodeA.position.z;
      const bx = THREE.MathUtils.lerp(ax, nodeB.position.x, edgeReveal);
      const by = THREE.MathUtils.lerp(ay, nodeB.position.y, edgeReveal);
      const bz = THREE.MathUtils.lerp(az, nodeB.position.z, edgeReveal);
      const offset = edgeIndex * 6;
      linePositions[offset] = ax;
      linePositions[offset + 1] = ay;
      linePositions[offset + 2] = az;
      linePositions[offset + 3] = bx;
      linePositions[offset + 4] = by;
      linePositions[offset + 5] = bz;
    });
    positionAttribute.needsUpdate = true;
    if (lineMaterial.current) lineMaterial.current.opacity = connect * (1 - reorganize * 0.42) * 0.58;

    const pulseEdges = [0, 9, 15, 22, 27];
    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return;
      const edge = EDGES[pulseEdges[index]];
      const from = nodeRefs.current[edge[0]];
      const to = nodeRefs.current[edge[1]];
      if (!from || !to) return;
      const t = (state.clock.elapsedTime * (0.18 + index * 0.018) + index * 0.21) % 1;
      pulse.position.lerpVectors(from.position, to.position, t);
      const active = smooth(range(p, 0.72, 0.84)) * (1 - reorganize);
      pulse.scale.setScalar(active * (0.72 + Math.sin(t * Math.PI) * 0.7));
    });

    if (dust.current) {
      dust.current.rotation.z += delta * 0.012;
      const material = dust.current.material as THREE.PointsMaterial;
      material.opacity = reveal * 0.36;
    }
  });

  return (
    <group ref={group} visible={false}>
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} color="#8ab8ff" transparent opacity={0} depthWrite={false} sizeAttenuation />
      </points>

      {NODES.map((position, index) => {
        const important = index === 0 || index === 1 || index === 2 || index === 7;
        const color = index % 5 === 0 ? "#a48aff" : index % 3 === 0 ? "#78ddff" : "#5e92ff";
        return (
          <group key={index}>
            <mesh ref={(node) => { nodeRefs.current[index] = node; }} position={position}>
              <sphereGeometry args={[important ? 0.11 : 0.068, 24, 24]} />
              <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={important ? 3.2 : 2.0} roughness={0.15} clearcoat={1} transparent />
            </mesh>
            <mesh ref={(halo) => { haloRefs.current[index] = halo; }} position={position}>
              <sphereGeometry args={[important ? 0.22 : 0.145, 20, 20]} />
              <meshBasicMaterial color={color} transparent opacity={important ? 0.07 : 0.035} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        );
      })}

      <lineSegments ref={lines} geometry={geometry}>
        <lineBasicMaterial ref={lineMaterial} color="#74a9ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} ref={(pulse) => { pulseRefs.current[index] = pulse; }}>
          <sphereGeometry args={[0.045, 18, 18]} />
          <meshBasicMaterial color={index % 2 ? "#a58cff" : "#d6f3ff"} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ progressRef }: VaultCore3DProps) {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, -1.9));

  useFrame((state, delta) => {
    const p = progressRef.current;
    const approach = smooth(range(p, 0.0, 0.18));
    const enter = smooth(range(p, 0.42, 0.60));
    const inside = smooth(range(p, 0.58, 0.76));
    const exitPrep = smooth(range(p, 0.91, 1));

    // A controlled camera push gives the feeling of entering the open door while
    // keeping the vault fully framed. The portal overlay handles the final wipe.
    const preEntryZ = THREE.MathUtils.lerp(6.35, 5.45, approach);
    const targetZ = THREE.MathUtils.lerp(preEntryZ, 4.18, enter) - inside * 0.18 + exitPrep * 0.08;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.6, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.025 * (1 - enter), 4.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, state.pointer.y * 0.02 * (1 - enter), 4.0, delta);
    cameraTarget.current.set(0, -0.04, THREE.MathUtils.lerp(0.25, -1.9, inside));
    state.camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 6, 5]} intensity={4.2} color="#ffffff" castShadow />
      <pointLight position={[-3, 1.5, 4]} intensity={14} color="#78b4ff" distance={8} />
      <pointLight position={[3, -2, 1]} intensity={11} color="#9678ff" distance={8} />
      <pointLight position={[0, 0, -1.4]} intensity={22} color="#4a8cff" distance={6} />
      <VaultShell progressRef={progressRef} />
      <KnowledgeConstellation progressRef={progressRef} />
    </>
  );
}

export function VaultCore3D({ progressRef }: VaultCore3DProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewRef, { margin: "360px" });

  return (
    <div ref={viewRef} className="r3f-fill">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.65]}
        shadows
        camera={{ position: [0, 0, 6.35], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}

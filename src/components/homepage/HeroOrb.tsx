"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

/**
 * HeroOrb — the real-WebGL evolution of the wireframe-orb signature
 * (DESIGN-ELEVATION §4.2 "one signature hero motion moment").
 *
 * Replaces the looping orb video with a live React-Three-Fiber scene:
 *  - a slowly rotating teal wireframe icosahedron (the orb),
 *  - three translucent "glass pane" quads staggered in Z that fan apart as
 *    the visitor scrolls (the reference sites' Z-space separation moment),
 *  - a camera dolly THROUGH the panes driven by the hero's scroll progress.
 *
 * Scroll drive: the parent passes motion's scrollYProgress as a MotionValue.
 * It is read imperatively inside useFrame (progress.get()) — zero React
 * re-renders on scroll; everything mutates three refs on the GPU frame loop.
 *
 * Resilience: rendered only behind next/dynamic (ssr:false) + WebGL check;
 * on `webglcontextlost` the component unmounts itself and the poster base
 * layer beneath simply shows through. Canvas fades in on mount so there is
 * never a flash over the poster.
 */

const TEAL = new THREE.Color("#2dd4bf");
const TEAL_DEEP = new THREE.Color("#0d9488");
const NAVY = new THREE.Color("#0f172a");

/** Per-pane resting Z and scroll-out direction (sign of X drift). */
const PANES: Array<{ z: number; dir: 1 | -1 }> = [
  { z: -1.5, dir: -1 },
  { z: -3.0, dir: 1 },
  { z: -4.5, dir: -1 },
];

function Scene({ progress }: { progress: MotionValue<number> }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const orbMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const paneRefs = useRef<Array<THREE.Mesh | null>>([]);
  const { camera } = useThree();

  /* eslint-disable react-hooks/immutability --
     R3F idiom: useFrame runs on the WebGL frame loop, outside React's render
     cycle. Mutating three.js objects (camera, meshes, materials) there is the
     documented react-three-fiber pattern; no React state is touched. */
  useFrame((_, delta) => {
    const p = progress.get(); // 0 at top → 1 when hero scrolled past

    // Camera dollies from z=8 through the pane stack to z=3.5.
    camera.position.z = 8 - p * 4.5;

    const orb = orbRef.current;
    if (orb) {
      orb.rotation.y += delta * 0.05;
      orb.rotation.x += delta * 0.02;
      const s = 1 + p * 0.15; // subtle grow as the camera closes in
      orb.scale.setScalar(s);
    }
    if (orbMatRef.current) {
      orbMatRef.current.opacity = 0.55 - p * 0.3;
    }

    PANES.forEach((pane, i) => {
      const mesh = paneRefs.current[i];
      if (!mesh) return;
      const stagger = 1 - i * 0.18; // nearest pane moves first
      mesh.position.x = pane.dir * p * 2.2 * stagger;
      mesh.position.z = pane.z - p * 1.5 * (i + 1) * 0.33;
      mesh.rotation.y = pane.dir * (0.15 + p * 0.25);
    });
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <fog attach="fog" args={[NAVY, 6, 14]} />
      <mesh ref={orbRef}>
        {/* detail 1 keeps the wireframe read while roughly quartering geometry
            generation + draw cost (longtask budget). */}
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial
          ref={orbMatRef}
          color={TEAL}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      {PANES.map((pane, i) => (
        <mesh
          key={pane.z}
          ref={(m) => {
            paneRefs.current[i] = m;
          }}
          position={[0, 0, pane.z]}
          rotation={[0, pane.dir * 0.15, 0]}
        >
          <planeGeometry args={[9, 6]} />
          <meshBasicMaterial
            color={TEAL_DEEP}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

export default function HeroOrb({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [visible, setVisible] = useState(false);
  // WebGL capability gate, probed lazily on first client render (this file is
  // only ever loaded via next/dynamic ssr:false, so document exists). Without
  // WebGL the component renders nothing and the poster base layer stays.
  const [failed, setFailed] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    const probe = document.createElement("canvas");
    return !(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  });

  if (failed) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              setFailed(true);
            },
            { once: true },
          );
          setVisible(true);
        }}
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}

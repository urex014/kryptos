'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Eye, Loader2, Sparkles, Box } from 'lucide-react';

interface ThreeRigCardViewerProps {
  modelUrl: string;
  onlineModelUrl?: string;
  rigName: string;
  tier: string;
  className?: string;
  compact?: boolean;
}

function create3DCPUModel(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CPU_Processor_Model';

  // 1. PCB Substrate (Green High-Density Dielectric Board)
  const pcbGeo = new THREE.BoxGeometry(2.8, 0.12, 2.8);
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.35,
    metalness: 0.2,
  });
  const pcb = new THREE.Mesh(pcbGeo, pcbMat);
  pcb.position.y = 0;
  group.add(pcb);

  // Gold alignment triangle (Pin 1 indicator)
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(0, 0);
  triangleShape.lineTo(0.35, 0);
  triangleShape.lineTo(0, 0.35);
  triangleShape.closePath();

  const triGeo = new THREE.ExtrudeGeometry(triangleShape, { depth: 0.02, bevelEnabled: false });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.15,
  });
  const triMesh = new THREE.Mesh(triGeo, goldMat);
  triMesh.rotation.x = Math.PI / 2;
  triMesh.position.set(-1.3, 0.07, -1.3);
  group.add(triMesh);

  // 2. Stepped Nickel Integrated Heat Spreader Base
  const ihsBaseGeo = new THREE.BoxGeometry(2.3, 0.08, 2.3);
  const ihsBaseMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    metalness: 0.9,
    roughness: 0.28,
  });
  const ihsBase = new THREE.Mesh(ihsBaseGeo, ihsBaseMat);
  ihsBase.position.y = 0.08;
  group.add(ihsBase);

  // 3. IHS Main Cap (Brushed Silver Nickel)
  const ihsCapGeo = new THREE.BoxGeometry(2.05, 0.14, 2.05);
  const ihsCapMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    metalness: 0.95,
    roughness: 0.2,
  });
  const ihsCap = new THREE.Mesh(ihsCapGeo, ihsCapMat);
  ihsCap.position.y = 0.18;
  group.add(ihsCap);

  // 4. Central Silicon Core Die
  const dieGeo = new THREE.BoxGeometry(1.2, 0.04, 1.2);
  const dieMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.92,
    roughness: 0.1,
  });
  const die = new THREE.Mesh(dieGeo, dieMat);
  die.position.y = 0.26;
  group.add(die);

  // Laser Etched Core Ring
  const badgeGeo = new THREE.RingGeometry(0.28, 0.38, 32);
  const badgeMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.rotation.x = -Math.PI / 2;
  badge.position.y = 0.285;
  group.add(badge);

  // Silicon Crystal Core
  const crystalGeo = new THREE.BoxGeometry(0.35, 0.02, 0.35);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    metalness: 0.5,
    roughness: 0.1,
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.y = 0.285;
  group.add(crystal);

  // 5. Ceramic SMD Decoupling Capacitors
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.5,
    metalness: 0.1,
  });

  const capPositions = [
    [-1.2, 0.08, -0.6],
    [-1.2, 0.08, -0.2],
    [-1.2, 0.08, 0.2],
    [-1.2, 0.08, 0.6],
    [1.2, 0.08, -0.6],
    [1.2, 0.08, -0.2],
    [1.2, 0.08, 0.2],
    [1.2, 0.08, 0.6],
    [-0.6, 0.08, -1.2],
    [-0.2, 0.08, -1.2],
    [0.2, 0.08, -1.2],
    [0.6, 0.08, -1.2],
    [-0.6, 0.08, 1.2],
    [-0.2, 0.08, 1.2],
    [0.2, 0.08, 1.2],
    [0.6, 0.08, 1.2],
  ];

  capPositions.forEach(([x, y, z]) => {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.18), capMat);
    cap.position.set(x, y, z);
    if (Math.abs(z) > 1.0) cap.rotation.y = Math.PI / 2;
    group.add(cap);
  });

  // 6. Bottom Gold LGA Contact Pads
  const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
  for (let row = -1.1; row <= 1.1; row += 0.3) {
    for (let col = -1.1; col <= 1.1; col += 0.3) {
      if (Math.abs(row) < 0.4 && Math.abs(col) < 0.4) continue;
      const pin = new THREE.Mesh(pinGeo, goldMat);
      pin.position.set(row, -0.07, col);
      group.add(pin);
    }
  }

  // Center Bottom SMD Matrix
  const centerPcbCapMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.4,
    metalness: 0.3,
  });
  for (let r = -0.25; r <= 0.25; r += 0.2) {
    for (let c = -0.25; c <= 0.25; c += 0.2) {
      const bCap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.12), centerPcbCapMat);
      bCap.position.set(r, -0.07, c);
      group.add(bCap);
    }
  }

  return group;
}

export function ThreeRigCardViewer({
  modelUrl,
  onlineModelUrl,
  rigName,
  tier,
  className,
  compact = false,
}: ThreeRigCardViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isWireframeRef = useRef(isWireframe);
  const isHoveredRef = useRef(isHovered);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    isWireframeRef.current = isWireframe;
  }, [isWireframe]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const handleResetCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleWireframe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWireframe((prev) => !prev);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 208;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Orbit Controls with mobile touch optimization
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // Keep card layout stable on scroll
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.3;
    controls.minPolarAngle = Math.PI / 4;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // 3. Hardware Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const orangeRimLight = new THREE.DirectionalLight(0xf97316, 2.8);
    orangeRimLight.position.set(-6, -2, -4);
    scene.add(orangeRimLight);

    const blueFillLight = new THREE.DirectionalLight(0x0284c7, 1.4);
    blueFillLight.position.set(4, -4, -4);
    scene.add(blueFillLight);

    // Subtle Hardware Pedestal Ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.68, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.35;
    scene.add(ringMesh);

    // 4. Model Loading via GLTFLoader or 3D CPU Generator
    const loader = new GLTFLoader();
    let loadedModel: THREE.Group | null = null;
    const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();

    const applyModel = (gltf: { scene: THREE.Group }) => {
      if (isDisposed) return;
      loadedModel = gltf.scene;

      // Compute bounding box and normalize scale & center
      const box = new THREE.Box3().setFromObject(loadedModel!);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2.8;
      const scale = targetSize / (maxDim || 1);

      loadedModel!.scale.set(scale, scale, scale);
      loadedModel!.position.x = -center.x * scale;
      loadedModel!.position.y = -center.y * scale - 0.1;
      loadedModel!.position.z = -center.z * scale;

      // Cache materials for wireframe toggling
      loadedModel!.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          originalMaterials.set(mesh, mesh.material);
        }
      });

      scene.add(loadedModel!);
      setIsLoading(false);
    };

    // Check if CPU model is requested
    const isCpuModel =
      modelUrl.toLowerCase().includes('cpu') ||
      (onlineModelUrl && onlineModelUrl.toLowerCase() === 'cpu');

    if (isCpuModel) {
      const cpuGroup = create3DCPUModel();
      applyModel({ scene: cpuGroup });
    } else {
      const tryLoad = (url: string, fallbackUrl?: string) => {
        loader.load(
          url,
          (gltf) => {
            applyModel(gltf);
          },
          undefined,
          (err) => {
            console.warn(`Failed loading model from ${url}`, err);
            if (fallbackUrl && fallbackUrl !== url) {
              console.log(`Attempting fallback to ${fallbackUrl}`);
              loader.load(
                fallbackUrl,
                (gltf) => applyModel(gltf),
                undefined,
                (fallbackErr) => {
                  console.error(`Fallback failed for ${fallbackUrl}`, fallbackErr);
                  if (!isDisposed) setHasError(true);
                }
              );
            } else {
              if (!isDisposed) setHasError(true);
            }
          }
        );
      };

      tryLoad(modelUrl, onlineModelUrl);
    }

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Faster auto-rotate on card hover
      controls.autoRotateSpeed = isHoveredRef.current ? 3.2 : 1.8;
      controls.update();

      // Toggle wireframe on meshes
      if (loadedModel) {
        const wireState = isWireframeRef.current;
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m: any) => {
                if (m && 'wireframe' in m) m.wireframe = wireState;
              });
            } else if (mesh.material && 'wireframe' in mesh.material) {
              (mesh.material as any).wireframe = wireState;
            }
          }
        });
      }

      // Pulse Pedestal Ring
      ringMesh.rotation.z = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || isDisposed) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 7. Cleanup
    return () => {
      isDisposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      controls.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      if (loadedModel) {
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }

      renderer.dispose();
    };
  }, [modelUrl, onlineModelUrl]);

  return (
    <div
      className={`relative overflow-hidden bg-[#07080c] border border-zinc-900 group/canvas cursor-grab active:cursor-grabbing touch-pan-y select-none ${
        className || 'w-full h-52'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Cyber Grid Background Accent */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ea580c15_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Top Left: 3D Live Badge */}
      <div className={`absolute top-2 left-2 flex items-center gap-1.5 border border-zinc-800 bg-zinc-950/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono text-zinc-300 pointer-events-none ${compact ? 'text-[9px] px-1.5' : ''}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
        <span className="font-bold text-orange-400">3D MODEL</span>
      </div>

      {/* Top Right: Interactive Controls (Wireframe / Reset Angle) */}
      {!compact && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWireframe}
            title={isWireframe ? 'Solid Surface' : 'Hologram Wireframe'}
            className={`p-1.5 border text-xs transition-colors cursor-pointer ${
              isWireframe
                ? 'border-orange-500 bg-orange-600/30 text-orange-400'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="h-3 w-3" />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset 3D View"
            className="p-1.5 border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080c]/90 font-mono text-xs text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-orange-500 mb-1" />
          {!compact && (
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">
              LOADING 3D ASSET...
            </span>
          )}
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080c] font-mono text-xs text-zinc-500">
          <Box className="h-6 w-6 text-zinc-600 mb-1" />
          <span className="text-[10px]">3D Offline</span>
        </div>
      )}

      {/* Bottom Hint */}
      {!compact && (
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 pointer-events-none">
          <span className="uppercase text-[9px] tracking-wider text-zinc-600">
            {tier} ASIC
          </span>
          <span className="hidden group-hover/canvas:inline text-orange-500/80 animate-fadeIn">
            Drag to Rotate 360°
          </span>
        </div>
      )}
    </div>
  );
}

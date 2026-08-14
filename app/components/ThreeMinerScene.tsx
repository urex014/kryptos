'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeMinerScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Master Group for 3D Rig Cluster
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Quantum Core (Nested Icosahedrons & Wireframes)
    const coreGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    const innerCoreGeo = new THREE.OctahedronGeometry(1.6, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    masterGroup.add(innerCoreMesh);

    // 2. Orbital Hashing Node Rings (ASIC Module Blocks)
    const nodeCount = 14;
    const nodeGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.8, 0.5, 1.2);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.8,
    });
    const boxFillMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.4,
      metalness: 0.8,
    });

    const nodes: THREE.Mesh[] = [];
    const radius = 6.2;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 2) * 1.5;
      const z = Math.sin(angle) * radius;

      const nodeMesh = new THREE.Mesh(boxGeo, boxFillMat);
      const wireframe = new THREE.LineSegments(boxEdges, edgeMat);
      nodeMesh.add(wireframe);

      nodeMesh.position.set(x, y, z);
      nodeMesh.lookAt(0, 0, 0);

      nodeGroup.add(nodeMesh);
      nodes.push(nodeMesh);
    }
    masterGroup.add(nodeGroup);

    // 3. Cryptographic Particle Cloud (Hash Stream)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOrange = new THREE.Color(0xf97316);
    const colorAmber = new THREE.Color(0xd97706);
    const colorWhite = new THREE.Color(0xf4f4f5);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 3.5 + Math.random() * 8.0;

      positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = dist * Math.cos(phi);

      const rColor = Math.random();
      const col =
        rColor > 0.6 ? colorOrange : rColor > 0.2 ? colorAmber : colorWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // 4. Subtle Orbital Traces (Geometric Coordinate Grid)
    const ringGeo = new THREE.RingGeometry(5.9, 6.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x431407,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 2.3;
    masterGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.x = -Math.PI / 3;
    ringMesh2.rotation.y = Math.PI / 4;
    masterGroup.add(ringMesh2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf97316, 80, 50);
    pointLight1.position.set(5, 8, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xea580c, 60, 40);
    pointLight2.position.set(-8, -5, -6);
    scene.add(pointLight2);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      masterGroup.rotation.y = elapsedTime * 0.15 + mouseX * 1.2;
      masterGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1 - mouseY * 1.2;

      coreMesh.rotation.x = -elapsedTime * 0.25;
      coreMesh.rotation.z = elapsedTime * 0.3;

      innerCoreMesh.rotation.y = elapsedTime * 0.5;
      innerCoreMesh.rotation.x = Math.cos(elapsedTime * 0.4) * 0.3;

      nodeGroup.rotation.y = -elapsedTime * 0.12;

      // Animate individual node modules
      nodes.forEach((n, idx) => {
        n.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
      });

      particleSystem.rotation.y = elapsedTime * 0.06;
      particleSystem.rotation.z = Math.sin(elapsedTime * 0.08) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      coreGeo.dispose();
      coreMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      boxGeo.dispose();
      boxEdges.dispose();
      boxFillMat.dispose();
      edgeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[420px] lg:min-h-[560px] cursor-grab active:cursor-grabbing"
    />
  );
}

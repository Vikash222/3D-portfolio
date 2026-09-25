import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Cpu, Eye, Compass } from 'lucide-react';

export default function Interactive3DCore() {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 380;
    const height = currentMount.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group to hold all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core Sphere (Glowing Inner Heart)
    const innerGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.8,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerCore);

    // 2. Translucent Faceted Crystal Shell (Icosahedron)
    const crystalGeo = new THREE.IcosahedronGeometry(4.2, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.7,
      ior: 1.5,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    mainGroup.add(crystalMesh);

    // Wireframe Cage for the Crystal
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const wireMesh = new THREE.Mesh(crystalGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Three Gyroscopic Orbital Rings (Torus)
    // Ring 1 (XY inclination) - Crimson Red
    const ringGeo1 = new THREE.TorusGeometry(5.8, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    // Ring 2 (YZ inclination) - Pure White / Platinum
    const ringGeo2 = new THREE.TorusGeometry(6.6, 0.07, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xcccccc,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    mainGroup.add(ring2);

    // Ring 3 (Equatorial) - Rose Carmine
    const ringGeo3 = new THREE.TorusGeometry(7.4, 0.06, 16, 100);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.x = -Math.PI / 4;
    mainGroup.add(ring3);

    // 4. Orbiting Satellites (Tech nodes)
    const satellites = [];
    const satColors = [0xef4444, 0xffffff, 0xdc2626, 0xf87171];
    for (let i = 0; i < 4; i++) {
      const satGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.8,
        metalness: 0.8,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      satellites.push({
        mesh: sat,
        radius: 6.2 + (i % 2) * 1.0,
        speed: 0.015 + i * 0.005,
        angle: (i * Math.PI) / 2,
        yOffset: (i - 1.5) * 1.5,
      });
      mainGroup.add(sat);
    }

    // 5. Surrounding Tech Particle Cloud
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 6.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.22,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 2.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xef4444, 4, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      rotationVelocityX = deltaY * 0.005;
      rotationVelocityY = deltaX * 0.005;

      mainGroup.rotation.x += rotationVelocityX;
      mainGroup.rotation.y += rotationVelocityY;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvasDom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Inertia & Auto Rotation
      if (!isDragging) {
        if (autoRotate) {
          mainGroup.rotation.y += 0.008;
          mainGroup.rotation.x += 0.003;
        } else {
          mainGroup.rotation.x += rotationVelocityX;
          mainGroup.rotation.y += rotationVelocityY;
          rotationVelocityX *= 0.94;
          rotationVelocityY *= 0.94;
        }
      }

      // Internal rotations
      crystalMesh.rotation.y += 0.006;
      crystalMesh.rotation.x -= 0.004;
      wireMesh.rotation.y += 0.006;
      wireMesh.rotation.x -= 0.004;

      ring1.rotation.z += 0.012;
      ring2.rotation.x += 0.015;
      ring3.rotation.y += 0.01;

      // Orbit satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2) * sat.yOffset;
      });

      particleSystem.rotation.y -= 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      canvasDom.removeEventListener('mousedown', onPointerDown);
      canvasDom.removeEventListener('touchstart', onPointerDown);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      innerGeo.dispose();
      innerMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-gradient-to-b from-slate-900 via-[#0a1128] to-slate-950 flex flex-col items-center justify-center p-3 select-none">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative"
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
        <div className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-blue-500/30 text-blue-300 text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 pointer-events-auto">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Interactive 3D Core</span>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold border transition-all cursor-pointer pointer-events-auto flex items-center gap-1 shadow-md ${
            autoRotate
              ? 'bg-red-600/90 text-white border-red-400/40 shadow-red-500/30'
              : 'bg-slate-900/90 text-slate-300 border-white/10'
          }`}
          title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
        >
          <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span className="text-[11px]">{autoRotate ? 'Spinning' : 'Paused'}</span>
        </button>
      </div>

      {/* Bottom Floating Interaction Hint */}
      <div className="absolute bottom-3 inset-x-3 pointer-events-none z-10">
        <div className="p-3 rounded-2xl bg-[#0e0609]/90 backdrop-blur-xl border border-red-500/30 shadow-2xl flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-400/40 text-red-300 flex items-center justify-center">
              <Compass className="w-4 h-4 animate-pulse text-red-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                Full 360&deg; Orbit Control
              </div>
              <div className="text-xs font-semibold text-white">
                Drag with mouse or finger to spin
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">WebGL 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
}

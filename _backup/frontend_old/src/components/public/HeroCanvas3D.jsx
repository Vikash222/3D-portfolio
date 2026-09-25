import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for background floating 3D tech structures
    const bgGroup = new THREE.Group();
    scene.add(bgGroup);

    // 1. Floating 3D Torus Knot (Complex Cyber Architecture)
    const knotGeo = new THREE.TorusKnotGeometry(6.5, 1.3, 100, 16);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.25,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.42,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotMesh.position.set(-6, 2, -4);
    bgGroup.add(knotMesh);

    // Wireframe overlay on Torus Knot for crisp tech aesthetic
    const knotWireMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const knotWire = new THREE.Mesh(knotGeo, knotWireMat);
    knotWire.position.copy(knotMesh.position);
    bgGroup.add(knotWire);

    // 2. Floating 3D Geometric Polyhedron on Right Side
    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0e7490,
      emissiveIntensity: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(12, -4, -6);
    bgGroup.add(icoMesh);

    // 3. Golden Core Octahedron
    const octGeo = new THREE.OctahedronGeometry(3.5, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(12, -4, -6);
    bgGroup.add(octMesh);

    // 4. Stardust Particles Cloud
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 55;
      particlePositions[i + 1] = (Math.random() - 0.5) * 45;
      particlePositions[i + 2] = (Math.random() - 0.5) * 35;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.28,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    bgGroup.add(particleSystem);

    // High-Spec Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2563eb, 4.5, 80);
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.5, 80);
    pointLight2.position.set(-15, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf59e0b, 2.5, 60);
    pointLight3.position.set(0, 10, -10);
    scene.add(pointLight3);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth - 0.5) * 2;
      mouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize listener
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
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      knotMesh.rotation.x += 0.003;
      knotMesh.rotation.y += 0.004;
      knotWire.rotation.x = knotMesh.rotation.x;
      knotWire.rotation.y = knotMesh.rotation.y;

      icoMesh.rotation.x -= 0.002;
      icoMesh.rotation.y += 0.003;
      octMesh.rotation.x += 0.004;
      octMesh.rotation.y -= 0.003;

      particleSystem.rotation.y += 0.0008;
      particleSystem.rotation.x = targetY * 0.1;

      // Parallax shift
      bgGroup.position.x = targetX * 1.5;
      bgGroup.position.y = -targetY * 1.5;

      camera.position.x += (targetX * 2.2 - camera.position.x) * 0.03;
      camera.position.y += (-targetY * 2.2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      knotGeo.dispose();
      knotMat.dispose();
      knotWireMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      octGeo.dispose();
      octMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

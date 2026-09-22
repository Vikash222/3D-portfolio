import React, { useEffect, useRef } from 'react';

/**
 * GalaxyBackground
 * Full-page cosmic starfield & rotating spiral galaxy animation.
 * Features:
 * - Fixed full-page background with zero lag (optimized 2D canvas)
 * - Rotating logarithmic spiral galaxy with nebula glow
 * - 1,200+ multi-depth twinkling stars with natural chromatic variation
 * - Realistic shooting stars (meteors) with luminous fading trails
 * - Smooth mouse parallax and window scroll depth
 */
export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    // Scroll parallax
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;

    // 1. STARFIELD SETUP (1,200 multi-depth stars)
    const STAR_COUNT = Math.min(1200, Math.floor((width * height) / 1200));
    const stars = [];
    const starColors = [
      'rgba(255, 255, 255, ',   // Pure White
      'rgba(254, 226, 226, ',   // Crisp Rose White
      'rgba(254, 202, 202, ',   // Soft Ruby Silver
      'rgba(252, 165, 165, ',   // Carmine White
      'rgba(239, 68, 68, ',     // Vibrant Red
      'rgba(255, 255, 255, ',   // High-Intensity White
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random(); // 0 (far) to 1 (close)
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseSize: z * 1.8 + 0.4,
        colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSpikes: z > 0.88, // Only closest brightest stars get cross-spikes
      });
    }

    // 2. ROTATING SPIRAL GALAXY PARTICLES
    const GALAXY_PARTICLES = 650;
    const galaxyStars = [];
    const numArms = 3;
    const armTwist = 3.5;
    const maxGalaxyRadius = Math.min(width, height) * 0.45;

    for (let i = 0; i < GALAXY_PARTICLES; i++) {
      const arm = i % numArms;
      const armOffset = (arm * 2 * Math.PI) / numArms;
      const r = Math.pow(Math.random(), 1.6) * maxGalaxyRadius;
      const theta = armOffset + (r / maxGalaxyRadius) * armTwist + (Math.random() - 0.5) * 0.55;

      galaxyStars.push({
        distance: r,
        angle: theta,
        speed: 0.0006 + (1 - r / maxGalaxyRadius) * 0.0012, // Keplerian rotation
        size: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.7 + 0.25,
        color:
          r < maxGalaxyRadius * 0.25
            ? 'rgba(255, 255, 255, '
            : r < maxGalaxyRadius * 0.65
            ? 'rgba(239, 68, 68, '
            : 'rgba(244, 63, 94, ',
      });
    }

    // 3. SHOOTING STARS (METEORS)
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 1.2;
      const startY = Math.random() * height * 0.4;
      const length = Math.random() * 90 + 70;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 degrees diagonal
      const speed = Math.random() * 14 + 10;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        life: 1.0,
        decay: Math.random() * 0.018 + 0.012,
        size: Math.random() * 1.5 + 1.2,
      });
    };

    // Event Handlers
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // RENDER LOOP
    let time = 0;

    const render = () => {
      time += 1;

      // Smooth damping for mouse & scroll parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.05;

      const parallaxX = (mouseX - width / 2) * 0.02;
      const parallaxY = (mouseY - height / 2) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // A. Deep Cosmic Nebula Glows
      const galaxyCenterX = width * 0.72 + parallaxX * 0.8;
      const galaxyCenterY = height * 0.38 + parallaxY * 0.8;

      // Deep radial glow behind the galaxy core
      const coreGradient = ctx.createRadialGradient(
        galaxyCenterX,
        galaxyCenterY,
        5,
        galaxyCenterX,
        galaxyCenterY,
        maxGalaxyRadius * 1.2
      );
      coreGradient.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
      coreGradient.addColorStop(0.35, 'rgba(225, 29, 72, 0.12)');
      coreGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.04)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(galaxyCenterX, galaxyCenterY, maxGalaxyRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Ambient left-side subtle nebula
      const leftNebula = ctx.createRadialGradient(
        width * 0.18,
        height * 0.65,
        10,
        width * 0.18,
        height * 0.65,
        width * 0.35
      );
      leftNebula.addColorStop(0, 'rgba(220, 38, 38, 0.14)');
      leftNebula.addColorStop(0.5, 'rgba(244, 63, 94, 0.06)');
      leftNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = leftNebula;
      ctx.beginPath();
      ctx.arc(width * 0.18, height * 0.65, width * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // B. Render Rotating Spiral Galaxy
      ctx.save();
      ctx.translate(galaxyCenterX, galaxyCenterY);
      // Tilt galaxy slightly for 3D perspective
      ctx.scale(1.0, 0.65);

      for (let i = 0; i < galaxyStars.length; i++) {
        const gs = galaxyStars[i];
        gs.angle += gs.speed;

        const gx = Math.cos(gs.angle) * gs.distance;
        const gy = Math.sin(gs.angle) * gs.distance;
        const currentAlpha = gs.alpha * (0.8 + 0.2 * Math.sin(time * 0.02 + i));

        ctx.fillStyle = gs.color + currentAlpha + ')';
        ctx.beginPath();
        ctx.arc(gx, gy, gs.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // C. Render Multi-Depth Starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Depth-based parallax offsets
        const sx = (s.x + parallaxX * (s.z * 1.5) + width) % width;
        // Scroll parallax: closer stars move faster when scrolling
        const sy = (s.y - (scrollY * s.z * 0.15) % height + height) % height;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase);
        const alpha = Math.max(0.08, Math.min(1.0, s.baseAlpha + twinkle * 0.35));
        const size = s.baseSize * (1 + twinkle * 0.15);

        ctx.fillStyle = s.colorPrefix + alpha + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        // Cross-spike flares on bright foreground stars
        if (s.hasSpikes && alpha > 0.65) {
          ctx.strokeStyle = s.colorPrefix + (alpha * 0.4) + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          // Horizontal flare
          ctx.moveTo(sx - size * 3, sy);
          ctx.lineTo(sx + size * 3, sy);
          // Vertical flare
          ctx.moveTo(sx, sy - size * 3);
          ctx.lineTo(sx, sy + size * 3);
          ctx.stroke();
        }
      }

      // D. Render & Update Shooting Stars
      const now = Date.now();
      if (now - lastShootingStarTime > 2800 + Math.random() * 3000) {
        spawnShootingStar();
        lastShootingStarTime = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];
        meteor.x += meteor.dx;
        meteor.y += meteor.dy;
        meteor.life -= meteor.decay;

        if (meteor.life <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = meteor.x - (meteor.dx / Math.hypot(meteor.dx, meteor.dy)) * meteor.length;
        const tailY = meteor.y - (meteor.dy / Math.hypot(meteor.dx, meteor.dy)) * meteor.length;

        const grad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.6, `rgba(239, 68, 68, ${meteor.life * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${meteor.life * 0.95})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = meteor.size;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        // Bright sparkling head
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.life})`;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #080d22 0%, #030611 60%, #020308 100%)',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reduced motion preference check
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const colors = ["#ffffff", "#f3ce7a", "#ffb3c6", "#e0b0ff"];

    // Initialize 120 stars for desktop, 60 for mobile
    const starCount = window.innerWidth < 768 ? 50 : 110;
    const stars: Star[] = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      maxAlpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Shooting star system
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };

    const spawnShootingStar = () => {
      if (prefersReducedMotion) return;
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 8 + 6,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        active: true,
      };
    };

    let nextShootingStarTimer = setTimeout(spawnShootingStar, 4000);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Soft Radial Nebula Glowing Orbs
      const nebula1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        20,
        width * 0.2,
        height * 0.3,
        450
      );
      nebula1.addColorStop(0, "rgba(255, 42, 95, 0.08)");
      nebula1.addColorStop(1, "rgba(6, 1, 5, 0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        30,
        width * 0.8,
        height * 0.7,
        400
      );
      nebula2.addColorStop(0, "rgba(243, 206, 122, 0.06)");
      nebula2.addColorStop(1, "rgba(6, 1, 5, 0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Render Twinkling Stars
      stars.forEach((star) => {
        if (!prefersReducedMotion) {
          star.alpha += star.pulseSpeed;
          if (star.alpha > star.maxAlpha || star.alpha < 0.1) {
            star.pulseSpeed = -star.pulseSpeed;
          }
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for larger stars
        if (star.size > 1.4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.color;
        }
        ctx.restore();
      });

      // Render Shooting Star
      if (shootingStar.active && !prefersReducedMotion) {
        ctx.save();
        ctx.strokeStyle = "rgba(243, 206, 122, " + shootingStar.alpha + ")";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.stroke();
        ctx.restore();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.015;

        if (shootingStar.alpha <= 0) {
          shootingStar.active = false;
          nextShootingStarTimer = setTimeout(
            spawnShootingStar,
            Math.random() * 6000 + 4000
          );
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(nextShootingStarTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}

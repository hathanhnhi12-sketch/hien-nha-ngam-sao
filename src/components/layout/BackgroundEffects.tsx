import React, { useEffect, useRef } from 'react';
import { SkyBackgroundTheme, ThemeMode } from '../../types';

interface BackgroundEffectsProps {
  skyTheme: SkyBackgroundTheme;
  theme: ThemeMode;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ skyTheme, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = window.innerWidth < 768 ? 65 : 130;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.8 ? '#FEF08A' : Math.random() > 0.6 ? '#93C5FD' : '#FFFFFF'
    }));

    // Shooting stars
    const shootingStars: { x: number; y: number; length: number; speed: number; angle: number; opacity: number; active: boolean }[] = [];
    const spawnShootingStar = () => {
      if (shootingStars.filter(s => s.active).length < 2 && Math.random() < 0.015) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
          active: true
        });
      }
    };

    // Fireflies / Floating particles
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Gradient sky background based on theme and skyTheme
      let grad = ctx.createLinearGradient(0, 0, 0, height);
      const isDark = theme === 'dark';

      if (isDark) {
        switch (skyTheme) {
          case 'milkyway':
            grad.addColorStop(0, '#0F0C29');
            grad.addColorStop(0.5, '#302B63');
            grad.addColorStop(1, '#24243E');
            break;
          case 'aurora':
            grad.addColorStop(0, '#051923');
            grad.addColorStop(0.4, '#003554');
            grad.addColorStop(0.7, '#006466');
            grad.addColorStop(1, '#0b132b');
            break;
          case 'firefly':
            grad.addColorStop(0, '#081c15');
            grad.addColorStop(0.5, '#1b4332');
            grad.addColorStop(1, '#0d1b2a');
            break;
          case 'cafe':
            grad.addColorStop(0, '#1a1423');
            grad.addColorStop(0.5, '#2b1e3a');
            grad.addColorStop(1, '#1b1924');
            break;
          case 'rain':
            grad.addColorStop(0, '#0d1b2a');
            grad.addColorStop(0.6, '#1b263b');
            grad.addColorStop(1, '#0f172a');
            break;
          case 'snow':
            grad.addColorStop(0, '#0a1128');
            grad.addColorStop(0.6, '#1c2541');
            grad.addColorStop(1, '#1e293b');
            break;
          case 'night':
            grad.addColorStop(0, '#030712');
            grad.addColorStop(0.5, '#0B132B');
            grad.addColorStop(1, '#111827');
            break;
          default: // 'default'
            grad.addColorStop(0, '#070E22');
            grad.addColorStop(0.45, '#0E1A38');
            grad.addColorStop(0.85, '#171E42');
            grad.addColorStop(1, '#1E1B3F');
        }
      } else {
        // Light Celestial Mode (bright, fresh, soft pastel celestial)
        switch (skyTheme) {
          case 'milkyway':
            grad.addColorStop(0, '#E0E7FF');
            grad.addColorStop(0.5, '#EDE9FE');
            grad.addColorStop(1, '#F3E8FF');
            break;
          case 'aurora':
            grad.addColorStop(0, '#E0F2FE');
            grad.addColorStop(0.5, '#D1FAE5');
            grad.addColorStop(1, '#EFF6FF');
            break;
          case 'cafe':
            grad.addColorStop(0, '#FEF3C7');
            grad.addColorStop(0.5, '#FFFBEB');
            grad.addColorStop(1, '#F5F3FF');
            break;
          default:
            grad.addColorStop(0, '#EEF6FF');
            grad.addColorStop(0.4, '#F4F0FF');
            grad.addColorStop(0.8, '#FAF5FF');
            grad.addColorStop(1, '#FFF9EC');
        }
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle nebula glow or aurora
      if (skyTheme === 'aurora') {
        ctx.save();
        ctx.filter = 'blur(40px)';
        ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.08)';
        ctx.beginPath();
        ctx.ellipse(width * 0.4 + Math.sin(time) * 40, height * 0.25, width * 0.5, height * 0.15, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw glowing Moon
      const moonX = width * 0.82;
      const moonY = height * 0.16;
      const moonRadius = isDark ? 36 : 30;

      // Moon aura
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3.5);
      moonGlow.addColorStop(0, isDark ? 'rgba(254, 240, 138, 0.35)' : 'rgba(253, 230, 138, 0.4)');
      moonGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Moon body (Crescent moon styling)
      ctx.fillStyle = isDark ? '#FEF9C3' : '#FDE68A';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Shadow overlay for lovely crescent effect
      ctx.fillStyle = isDark ? '#0E1A38' : '#EEF6FF';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.38, moonY - moonRadius * 0.25, moonRadius * 0.92, 0, Math.PI * 2);
      ctx.fill();

      // Draw Stars
      stars.forEach(star => {
        star.alpha += Math.sin(time * 5 + star.x) * star.twinkleSpeed;
        const currentAlpha = Math.max(0.1, Math.min(0.9, star.alpha));

        ctx.fillStyle = isDark
          ? star.color === '#FEF08A' ? `rgba(254, 240, 138, ${currentAlpha})` : `rgba(255, 255, 255, ${currentAlpha})`
          : `rgba(99, 102, 241, ${currentAlpha * 0.45})`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn & Draw Shooting Stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) continue;

        ctx.save();
        ctx.strokeStyle = `rgba(254, 240, 138, ${s.opacity})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
        ctx.stroke();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        if (s.opacity <= 0 || s.x > width || s.y > height) {
          s.active = false;
          shootingStars.splice(i, 1);
        }
      }

      // Draw Fireflies / floating stardust
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = (Math.sin(p.pulse) * 0.5 + 0.5) * (isDark ? 0.7 : 0.35);
        ctx.fillStyle = skyTheme === 'firefly'
          ? `rgba(163, 230, 53, ${currentAlpha})`
          : `rgba(253, 224, 71, ${currentAlpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gentle cloud silhouettes at the bottom
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(width * 0.2, height + 10, width * 0.4, 60, 0, 0, Math.PI * 2);
      ctx.ellipse(width * 0.7, height + 20, width * 0.5, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [skyTheme, theme]);

  return (
    <canvas
      ref={canvasRef}
      id="stargazing-sky-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

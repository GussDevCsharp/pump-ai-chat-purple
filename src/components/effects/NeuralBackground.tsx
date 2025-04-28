import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    type Point = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      sizeOffset: number;
      sizeVelocity: number;
      isNew?: boolean;
      creationTime?: number;
    };

    let points: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      baseSize: Math.random() * 2 + 1,
      sizeOffset: Math.random() * Math.PI * 2,
      sizeVelocity: 0.02 + Math.random() * 0.02,
    }));

    const createNeuron = (x: number, y: number) => {
      const newPoint: Point = {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 0, // Start with size 0 to animate growth
        baseSize: Math.random() * 2 + 1,
        sizeOffset: Math.random() * Math.PI * 2,
        sizeVelocity: 0.02 + Math.random() * 0.02,
        isNew: true,
        creationTime: Date.now(),
      };
      points.push(newPoint);

      // Remove oldest point if we have too many
      if (points.length > 70) {
        points.shift();
      }
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault(); // Prevent default behavior
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createNeuron(x, y);
    };

    canvas.addEventListener('click', handleClick);

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Set background color based on theme
      ctx.fillStyle = isDark ? '#000000' : 'rgb(255, 253, 243)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();
      points.forEach((point, i) => {
        // Handle new point animation
        if (point.isNew) {
          const age = currentTime - (point.creationTime || 0);
          if (age < 1000) { // Animation duration: 1 second
            point.size = (age / 1000) * point.baseSize;
          } else {
            point.size = point.baseSize;
            point.isNew = false;
          }
        } else {
          // Regular size animation for established points
          point.sizeOffset += point.sizeVelocity;
          point.size = Math.max(0.1, point.baseSize + Math.sin(point.sizeOffset) * (point.baseSize * 0.5));
        }

        // Update position
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Draw connections with theme-aware colors
        points.forEach((otherPoint, j) => {
          if (i === j) return;

          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const averageSize = Math.max(0.1, (point.size + otherPoint.size) / 2);
            const opacity = (1 - distance / 150) * 0.15 * (averageSize / 2);
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = isDark 
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(126, 28, 198, ${opacity})`;
            ctx.lineWidth = averageSize * 0.2;
            ctx.stroke();
          }
        });

        // Draw points with theme-aware colors
        ctx.beginPath();
        const safeRadius = Math.max(0.1, point.size);
        ctx.arc(point.x, point.y, safeRadius, 0, Math.PI * 2);
        const opacity = 0.3 + (safeRadius / 4) * 0.2;
        ctx.fillStyle = isDark 
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(126, 28, 198, ${opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
    };
  }, [isDark]); // Added isDark to dependency array

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'auto' }}
    />
  );
};

export default NeuralBackground;

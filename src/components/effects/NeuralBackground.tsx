import React, { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas para tela cheia
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Define click ripple properties
    type Ripple = {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    };

    let ripples: Ripple[] = [];

    // Handle mouse click
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create new ripple
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: 150,
        alpha: 0.6,
      });
    });

    // Points setup
    type Point = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      initialSize: number;
      targetSize: number;
      sizeChangeSpeed: number;
    };

    // Create points with additional size animation properties
    const points: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 2,
      initialSize: 1 + Math.random() * 2,
      targetSize: 1 + Math.random() * 2,
      sizeChangeSpeed: 0.05
    }));

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgb(255, 253, 243)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      ripples = ripples.filter(ripple => {
        ripple.radius += 2;
        ripple.alpha *= 0.98;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(89, 20, 141, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Remove ripple when it's too large or transparent
        return ripple.radius < ripple.maxRadius && ripple.alpha > 0.1;
      });

      // Update and draw points
      points.forEach((point, i) => {
        // Move points
        point.x += point.vx;
        point.y += point.vy;

        // Check for ripple influence
        ripples.forEach(ripple => {
          const dx = point.x - ripple.x;
          const dy = point.y - ripple.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ripple.radius + 50 && distance > ripple.radius - 50) {
            point.targetSize = point.initialSize * 2;
          } else {
            point.targetSize = point.initialSize;
          }
        });

        // Animate point size
        point.size += (point.targetSize - point.size) * point.sizeChangeSpeed;

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Draw connections
        points.forEach((otherPoint, j) => {
          if (i === j) return;

          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `rgba(89, 20, 141, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(89, 20, 141, 0.6)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', window.onresize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full cursor-pointer"
      style={{ zIndex: 0 }}
    />
  );
};

export default NeuralBackground;

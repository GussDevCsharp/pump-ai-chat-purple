
import React, { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    };

    const points: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      baseSize: Math.random() * 2 + 1,
      sizeOffset: Math.random() * Math.PI * 2,
      sizeVelocity: 0.02 + Math.random() * 0.02,
    }));

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgb(255, 253, 243)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      points.forEach((point, i) => {
        // Atualiza posição
        point.x += point.vx;
        point.y += point.vy;

        // Simula efeito de profundidade com tamanho oscilante
        point.sizeOffset += point.sizeVelocity;
        
        // Correção: Garantir que o tamanho nunca seja negativo
        // Usar Math.max para garantir um mínimo de 0.1 para o raio
        point.size = Math.max(0.1, point.baseSize + Math.sin(point.sizeOffset) * (point.baseSize * 0.5));

        // Rebate nas bordas
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Desenha conexões com efeito de profundidade
        points.forEach((otherPoint, j) => {
          if (i === j) return;

          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            // Usar Math.max para garantir que averageSize seja sempre positivo
            const averageSize = Math.max(0.1, (point.size + otherPoint.size) / 2);
            const opacity = (1 - distance / 150) * 0.15 * (averageSize / 2);
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `rgba(126, 28, 198, ${opacity})`;
            ctx.lineWidth = averageSize * 0.2;
            ctx.stroke();
          }
        });

        // Desenha pontos com tamanho variável
        ctx.beginPath();
        // Garantir que o raio seja sempre positivo
        const safeRadius = Math.max(0.1, point.size);
        ctx.arc(point.x, point.y, safeRadius, 0, Math.PI * 2);
        const opacity = 0.3 + (safeRadius / 4) * 0.2;
        ctx.fillStyle = `rgba(126, 28, 198, ${opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default NeuralBackground;

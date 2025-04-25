
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

    // Pontos que representam os neurônios
    type Point = {
      x: number;
      y: number;
      vx: number;
      vy: number;
    };

    // Criar pontos iniciais
    const points: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    // Função de animação
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpar canvas com fundo levemente transparente para criar rastro
      ctx.fillStyle = 'rgba(255, 253, 243, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar pontos
      points.forEach((point, i) => {
        // Mover pontos
        point.x += point.vx;
        point.y += point.vy;

        // Rebater nas bordas
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Desenhar conexões
        points.forEach((otherPoint, j) => {
          if (i === j) return;

          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `rgba(126, 28, 198, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });

        // Desenhar pontos
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(126, 28, 198, 0.5)';
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

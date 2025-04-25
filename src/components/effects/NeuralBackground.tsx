
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
      size: number; // Adicionando tamanho dinâmico
    };

    // Criar pontos iniciais com tamanhos variados
    const points: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 2, // Tamanho entre 1 e 3
    }));

    // Função de animação
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpar canvas completamente em cada frame (sem transparência)
      ctx.fillStyle = 'rgb(255, 253, 243)';
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
            ctx.strokeStyle = `rgba(89, 20, 141, ${0.15 * (1 - distance / 150)})`; // Cor mais escura para as linhas
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });

        // Desenhar pontos com tamanho variável
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(89, 20, 141, 0.6)'; // Cor mais escura para os pontos
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

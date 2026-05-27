import React, { useEffect, useRef } from 'react';

const Hero3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Sphere points configuration
    const numLatitudes = 14;
    const numLongitudes = 20;
    let angleX = 0;
    let angleY = 0;

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.0008; // time in seconds
      const sphereRadius = Math.min(width, height) * 0.28;

      // Slowly rotate
      angleX = t * 0.12;
      angleY = t * 0.16;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // We will project 3D points and store them
      const projectedPoints = [];

      for (let i = 0; i <= numLatitudes; i++) {
        const theta = (i * Math.PI) / numLatitudes;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        projectedPoints[i] = [];

        for (let j = 0; j < numLongitudes; j++) {
          const phi = (j * 2 * Math.PI) / numLongitudes;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          // Add organic morphing/distortion effect using trigonometric waves over time
          const morph = 1 + 0.14 * Math.sin(4 * theta + t * 2.2) * Math.cos(4 * phi - t * 1.8);
          const r = sphereRadius * morph;

          // 3D Coordinates
          const x3d = r * sinTheta * cosPhi;
          const y3d = r * cosTheta;
          const z3d = r * sinTheta * sinPhi;

          // Rotation around Y axis
          let x1 = x3d * cosY - z3d * sinY;
          let z1 = x3d * sinY + z3d * cosY;

          // Rotation around X axis
          let y2 = y3d * cosX - z1 * sinX;
          let z2 = y3d * sinX + z1 * cosX;

          // Perspective Projection
          const fov = 800;
          const perspective = fov / (fov + z2);
          const x2d = width / 2 + x1 * perspective;
          const y2d = height / 2 + y2 * perspective;

          projectedPoints[i][j] = { x: x2d, y: y2d, depth: z2 };
        }
      }

      // Draw wireframe grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.8;

      // Draw latitude lines
      for (let i = 0; i <= numLatitudes; i++) {
        ctx.beginPath();
        for (let j = 0; j <= numLongitudes; j++) {
          const p = projectedPoints[i][j % numLongitudes];
          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Draw longitude lines
      for (let j = 0; j < numLongitudes; j++) {
        ctx.beginPath();
        for (let i = 0; i <= numLatitudes; i++) {
          const p = projectedPoints[i][j];
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
};

export default Hero3D;

import React, { useRef, useEffect, useState } from 'react';
import { 
  Observer, 
  Horizon, 
  Equator, 
  Body, 
  IdentifyConstellation 
} from 'astronomy-engine';
import { BRIGHT_STARS } from '../lib/stars';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface StarMapProps {
  date: Date;
  lat: number;
  lon: number;
  onSelectObject?: (name: string) => void;
}

export const StarMap: React.FC<StarMapProps> = ({ date, lat, lon, onSelectObject }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;

    ctx.clearRect(0, 0, width, height);

    const observer = new Observer(lat, lon, 0);

    // Draw Background Circle (Sky)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#020408';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Compass Points
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('N', centerX, centerY - radius - 10);
    ctx.fillText('S', centerX, centerY + radius + 20);
    ctx.fillText('E', centerX + radius + 15, centerY + 4);
    ctx.fillText('W', centerX - radius - 15, centerY + 4);

    // Helper: Project Alt/Az to X/Y
    // Stereographic projection centered at Zenith
    const project = (alt: number, az: number) => {
      if (alt < 0) return null; // Below horizon
      
      // Distance from center: scale 90-alt to 0-radius
      const r = radius * ((90 - alt) / 90);
      const angle = (az - 90) * (Math.PI / 180); // Adjust to North=Up
      
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    };

    // 1. Draw Stars
    BRIGHT_STARS.forEach(star => {
      const hor = Horizon(date, observer, star.ra, star.dec, 'normal');
      const pos = project(hor.altitude, hor.azimuth);
      
      if (pos) {
        const starRadius = Math.max(0.5, 3 - star.mag);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, starRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'white';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw Label for very bright stars
        if (star.mag < 1.0) {
          ctx.font = '8px Inter';
          ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
          ctx.fillText(star.name, pos.x, pos.y + 8);
        }
      }
    });

    // 2. Draw Planets
    const planets = [
      { body: Body.Sun, name: 'Sol', color: '#fbbf24' },
      { body: Body.Moon, name: 'Lua', color: '#e2e8f0' },
      { body: Body.Mercury, name: 'Mercúrio', color: '#94a3b8' },
      { body: Body.Venus, name: 'Vênus', color: '#fcd34d' },
      { body: Body.Mars, name: 'Marte', color: '#f87171' },
      { body: Body.Jupiter, name: 'Júpiter', color: '#fde047' },
      { body: Body.Saturn, name: 'Saturno', color: '#a78bfa' }
    ];

    planets.forEach(p => {
      const equ = Equator(p.body, date, observer, true, true);
      const hor = Horizon(date, observer, equ.ra, equ.dec, 'normal');
      const pos = project(hor.altitude, hor.azimuth);

      if (pos) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillStyle = p.color;
        ctx.fillText(p.name, pos.x, pos.y - 8);
      }
    });

    // 3. Draw Grid (Azimuth/Altitude)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
    ctx.lineWidth = 1;
    // Circles of Altitude
    [30, 60].forEach(alt => {
      const r = radius * ((90 - alt) / 90);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    // Lines of Azimuth
    for (let a = 0; a < 360; a += 45) {
      const angle = a * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();
    }
  };

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [date, lat, lon]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 p-3 bg-black/40 border border-celestial-border rounded-sm backdrop-blur-sm z-10 hidden md:block">
        <h3 className="text-[10px] font-bold text-celestial-accent uppercase tracking-widest mb-2 flex items-center gap-2">
          <Star size={12} /> Legenda do Firmamento
        </h3>
        <div className="space-y-1 text-[9px] font-mono text-celestial-muted">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"></div>
             <span>Estrelas de Alta Magnitude</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_5px_#fbbf24]"></div>
             <span>Planetas e Luminares</span>
          </div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600} 
        className="max-w-full max-h-full cursor-crosshair opacity-90 hover:opacity-100 transition-opacity"
      />

      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-celestial-muted/50 uppercase">
        Stereographic Projection Center: Zenith
      </div>
    </div>
  );
};

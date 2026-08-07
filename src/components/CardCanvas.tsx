'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';

interface CardCanvasProps {
  userImage: string;
}

export default function CardCanvas({ userImage }: CardCanvasProps) {
  const [activeTab, setActiveTab] = useState<'frame' | 'idcard'>('frame');
  const [name, setName] = useState('Ankan Mahanti');
  const [role, setRole] = useState('Full Stack Builder');
  const [builderTitle, setBuilderTitle] = useState('Byte Alchemist');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Random fun titles generator for Format B
  const funTitles = [
    'Byte Alchemist',
    'Neural Architect',
    'Full-Stack Artisan',
    'Goa Hacker',
    'Code Craftsman',
    'Async Wizard',
  ];

  const generateRandomTitle = () => {
    const random = funTitles[Math.floor(Math.random() * funTitles.length)];
    setBuilderTitle(random);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = userImage;

    img.onload = () => {
      if (activeTab === 'frame') {
        // --- FORMAT A: PFP FRAME (1080x1080) ---
        canvas.width = 1080;
        canvas.height = 1080;

        // Draw User Photo
        ctx.drawImage(img, 0, 0, 1080, 1080);

        // Cyberpunk / Goa Dark Gradient Border Overlay
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, '#06b6d4'); // Cyan
        gradient.addColorStop(0.5, '#10b981'); // Emerald
        gradient.addColorStop(1, '#3b82f6'); // Blue

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, 1040, 1040);

        // Dark Bottom Banner for Branding
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 920, 1080, 160);

        // HH GOA 2026 Text Branding
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HH GOA 2026', 540, 985);

        ctx.fillStyle = '#22d3ee';
        ctx.font = '500 28px Inter, sans-serif';
        ctx.fillText('BUILDER EDITION • #FrameInGoa', 540, 1030);

      } else {
        // --- FORMAT B: BUILDER ID CARD (1080x1350) ---
        canvas.width = 1080;
        canvas.height = 1350;

        // Background - Dark Cyberpunk Card
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 1080, 1350);

        // Neon Glow Card Border
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(1, '#10b981');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 16;
        ctx.strokeRect(30, 30, 1020, 1290);

        // Header Text
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HACKER HOUSE GOA 2026', 540, 110);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText('OFFICIAL BUILDER PASS', 540, 150);

        // Photo Container Frame
        const photoSize = 500;
        const photoX = (1080 - photoSize) / 2;
        const photoY = 200;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 30);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        // Photo Outline
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 30);
        ctx.stroke();

        // User Details
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px Inter, sans-serif';
        ctx.fillText(name || 'Anonymous Builder', 540, 790);

        ctx.fillStyle = '#10b981';
        ctx.font = '600 32px Inter, sans-serif';
        ctx.fillText(role || 'Developer', 540, 840);

        // Builder Badge Box
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(190, 890, 700, 100, 20);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 34px Inter, sans-serif';
        ctx.fillText(`⚡ ${builderTitle}`, 540, 952);

        // Footer Branding
        ctx.fillStyle = '#64748b';
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText('#FrameInGoa • HH GOA 2026', 540, 1220);
      }
    };
  }, [userImage, activeTab, name, role, builderTitle]);

  // Download Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `HH_Goa_2026_${activeTab === 'frame' ? 'PFP' : 'IDCard'}.png`;
    link.click();
  };

  // Share to X (Twitter) Handler
  const handleShareToX = () => {
    const text = encodeURIComponent(
      `I'm ready for HH Goa 2026! 🚀 Check out my Builder Pass.\n\n#FrameInGoa @HackerHouseGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl">
      {/* Tab Selector */}
      <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-full">
        <button
          onClick={() => setActiveTab('frame')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
            activeTab === 'frame'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Format A: PFP Frame
        </button>
        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
            activeTab === 'idcard'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Format B: Builder ID Card
        </button>
      </div>

      {/* ID Card Customizable Fields (Format B Only) */}
      {activeTab === 'idcard' && (
        <div className="w-full space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-left">
          <div>
            <label className="text-xs font-medium text-slate-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400">Role / Tech Stack</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-400">Builder Title</label>
              <button
                onClick={generateRandomTitle}
                className="text-xs text-cyan-400 flex items-center space-x-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Randomize Title</span>
              </button>
            </div>
            <input
              type="text"
              value={builderTitle}
              onChange={(e) => setBuilderTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Canvas Live Preview */}
      <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>

      {/* Download and Share Buttons */}
      <div className="flex w-full space-x-3 pt-2">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>
        <button
          onClick={handleShareToX}
          className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
        >
          <Share2 className="w-4 h-4" />
          <span>Share to X</span>
        </button>
      </div>
    </div>
  );
}
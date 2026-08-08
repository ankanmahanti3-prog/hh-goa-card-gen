'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CardCanvasProps {
  userImage: string;
}

const THEMES = [
  { id: 'cyberpunk', name: 'Sunset Cyberpunk', primary: '#06b6d4', secondary: '#f43f5e', bg: '#090d16' },
  { id: 'emerald', name: 'Emerald Palms', primary: '#10b981', secondary: '#3b82f6', bg: '#061412' },
  { id: 'matrix', name: 'Neon Matrix', primary: '#22c55e', secondary: '#a855f7', bg: '#020d08' },
  { id: 'goa', name: 'Goa Golden Hour', primary: '#eab308', secondary: '#f97316', bg: '#120a05' },
];

const STACK_OPTIONS = ['Full-Stack', 'AI / ML', 'Web3 / Solana', 'Rust', 'UI / UX', 'DevOps'];

const FUN_TITLES = [
  'Susegad Vibe Compiler',
  'Async Architect',
  'Terminal Wizard',
  'Neural Alchemist',
  'Code Craftsman',
  'Goa Hacker',
];

export default function CardCanvas({ userImage }: CardCanvasProps) {
  const [activeTab, setActiveTab] = useState<'frame' | 'idcard'>('idcard');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [name, setName] = useState('Ankan Mahanti');
  const [handle, setHandle] = useState('@ankanmahanti');
  const [selectedStacks, setSelectedStacks] = useState<string[]>(['Full-Stack', 'AI / ML']);
  const [builderTitle, setBuilderTitle] = useState('Susegad Vibe Compiler');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleStack = (stack: string) => {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack].slice(0, 3)
    );
  };

  const randomizeTitle = () => {
    const random = FUN_TITLES[Math.floor(Math.random() * FUN_TITLES.length)];
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

        // User Image
        ctx.drawImage(img, 0, 0, 1080, 1080);

        // Gradient Frame Overlay
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, selectedTheme.primary);
        gradient.addColorStop(1, selectedTheme.secondary);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 36;
        ctx.strokeRect(18, 18, 1044, 1044);

        // Bottom Banner Overlay
        ctx.fillStyle = 'rgba(9, 13, 22, 0.88)';
        ctx.fillRect(0, 880, 1080, 200);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HACKER HOUSE GOA 2026', 540, 950);

        ctx.fillStyle = selectedTheme.primary;
        ctx.font = '600 30px Inter, sans-serif';
        ctx.fillText('#FrameInGoa • BUILDER EDITION', 540, 1000);

      } else {
        // --- FORMAT B: BUILDER ID CARD (1080x1350) ---
        canvas.width = 1080;
        canvas.height = 1350;

        // Background
        ctx.fillStyle = selectedTheme.bg;
        ctx.fillRect(0, 0, 1080, 1350);

        // Neon Glow Border
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
        gradient.addColorStop(0, selectedTheme.primary);
        gradient.addColorStop(1, selectedTheme.secondary);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 14;
        ctx.strokeRect(24, 24, 1032, 1302);

        // Header Title
        ctx.fillStyle = selectedTheme.primary;
        ctx.font = 'bold 42px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HACKER HOUSE GOA 2026', 540, 100);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 24px Inter, sans-serif';
        ctx.fillText('OFFICIAL BUILDER PASS • 28 - 31 OCT 2026', 540, 140);

        // Photo Frame
        const photoSize = 480;
        const photoX = (1080 - photoSize) / 2;
        const photoY = 180;

        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(photoX, photoY, photoSize, photoSize, 24);
        } else {
          ctx.rect(photoX, photoY, photoSize, photoSize);
        }
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        // Photo Border
        ctx.strokeStyle = selectedTheme.primary;
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(photoX, photoY, photoSize, photoSize, 24);
        } else {
          ctx.rect(photoX, photoY, photoSize, photoSize);
        }
        ctx.stroke();

        // Builder Name & Handle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px Inter, sans-serif';
        ctx.fillText(name || 'Anonymous Builder', 540, 740);

        ctx.fillStyle = selectedTheme.primary;
        ctx.font = '500 28px Inter, sans-serif';
        ctx.fillText(handle || '@builder', 540, 785);

        // Fun Title Badge Box
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(140, 825, 800, 80, 16);
        } else {
          ctx.rect(140, 825, 800, 80);
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 30px Inter, sans-serif';
        ctx.fillText(`⚡ ${builderTitle}`, 540, 875);

        // Tech Stack Badges
        if (selectedStacks.length > 0) {
          const totalWidth = selectedStacks.length * 200;
          let startX = (1080 - totalWidth) / 2 + 100;

          selectedStacks.forEach((stack) => {
            ctx.fillStyle = selectedTheme.primary;
            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(startX - 90, 940, 180, 48, 12);
            } else {
              ctx.rect(startX - 90, 940, 180, 48);
            }
            ctx.fill();

            ctx.fillStyle = '#090d16';
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.fillText(stack, startX, 971);

            startX += 200;
          });
        }

        // Footer Metadata & Hashtags
        ctx.fillStyle = '#64748b';
        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('BUILDER ID: #2026-GOA-HKR', 540, 1220);
        ctx.fillText('#FrameInGoa • LESS NOISE. MORE SIGNAL.', 540, 1260);
      }
    };
  }, [userImage, activeTab, selectedTheme, name, handle, selectedStacks, builderTitle]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `HH_Goa_2026_${activeTab === 'frame' ? 'PFP' : 'Pass'}.png`;
    link.click();
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      `Just generated my official Builder Pass for Hacker House Goa 2026! 🚀\n\nSee you in Goa! #FrameInGoa @HackerHouseGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl">
      {/* Format Switcher */}
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition ${
            activeTab === 'idcard'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Format B: Builder ID Pass
        </button>
        <button
          onClick={() => setActiveTab('frame')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition ${
            activeTab === 'frame'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Format A: PFP Frame
        </button>
      </div>

      {/* Customization Options */}
      {activeTab === 'idcard' && (
        <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800/80 text-left">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1. Choose Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition ${
                    selectedTheme.id === theme.id
                      ? 'border-cyan-400 bg-slate-900 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span>{theme.name}</span>
                  </div>
                  {selectedTheme.id === theme.id && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Builder Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Twitter / X Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Builder Title Randomizer */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-400">Builder Title</label>
              <button
                onClick={randomizeTitle}
                className="text-xs text-cyan-400 flex items-center space-x-1 hover:underline font-medium"
              >
                <span>✨ Randomize Title</span>
              </button>
            </div>
            <input
              type="text"
              value={builderTitle}
              onChange={(e) => setBuilderTitle(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Tech Stack Selectors */}
          <div>
            <label className="text-xs font-semibold text-slate-400">
              Primary Tech Stack (Select up to 3)
            </label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STACK_OPTIONS.map((stack) => {
                const active = selectedStacks.includes(stack);
                return (
                  <button
                    key={stack}
                    onClick={() => toggleStack(stack)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      active
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {stack}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Canvas Live Preview */}
      <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>

      {/* Export Actions */}
      <div className="flex w-full space-x-3">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-bold text-sm transition shadow-lg"
        >
          ⬇ Download Pass
        </button>
        <button
          onClick={handleShareToX}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-slate-950 font-bold text-sm transition shadow-lg"
        >
          🚀 Share to X
        </button>
      </div>
    </div>
  );
}
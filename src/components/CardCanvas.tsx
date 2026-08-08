'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CardCanvasProps {
  userImage: string;
  activeStep: number;
  setActiveStep: (step: number) => void;
  renderUploadSlot: React.ReactNode;
  onUploadClick: () => void;
}

const THEMES = [
  { id: 'emerald', name: 'Emerald Goa Palms', primary: '#10b981', secondary: '#f59e0b', bg: '#041c14' },
  { id: 'goa', name: 'Sunset Gold', primary: '#fbbf24', secondary: '#ef4444', bg: '#1c0c04' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', primary: '#06b6d4', secondary: '#ec4899', bg: '#090d16' },
];

export default function CardCanvas({
  userImage,
  activeStep,
  setActiveStep,
  renderUploadSlot,
}: CardCanvasProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [name, setName] = useState('Ankan Mahanti');
  const [role, setRole] = useState('Student / Builder');
  const [handle, setHandle] = useState('@ankanmahanti');
  const [autoId, setAutoId] = useState('HHG26-ANK-8F3A');
  const [validationError, setValidationError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate Unique ID
  const regenerateId = () => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().slice(0, 4);
    const prefix = name ? name.substring(0, 3).toUpperCase() : 'HKR';
    setAutoId(`HHG26-${prefix}-${randomHex}`);
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
      // 1080 x 1350 Standard ID Pass Ratio
      canvas.width = 1080;
      canvas.height = 1350;

      // Background
      ctx.fillStyle = selectedTheme.bg;
      ctx.fillRect(0, 0, 1080, 1350);

      // Outer Neon Frame
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, selectedTheme.primary);
      gradient.addColorStop(1, selectedTheme.secondary);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 16;
      ctx.strokeRect(24, 24, 1032, 1302);

      // Header Banner
      ctx.fillStyle = selectedTheme.primary;
      ctx.font = 'bold 44px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌴 HACKER HOUSE GOA 2026 🌴', 540, 100);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText('OFFICIAL BUILDER CREDENTIAL', 540, 145);

      // Photo Frame
      const photoSize = 460;
      const photoX = (1080 - photoSize) / 2;
      const photoY = 190;

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

      ctx.strokeStyle = selectedTheme.primary;
      ctx.lineWidth = 6;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 24);
      } else {
        ctx.rect(photoX, photoY, photoSize, photoSize);
      }
      ctx.stroke();

      // Name & Handle
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px Inter, sans-serif';
      ctx.fillText(name || 'Ankan Mahanti', 540, 730);

      ctx.fillStyle = selectedTheme.primary;
      ctx.font = '500 28px Inter, sans-serif';
      ctx.fillText(handle || '@builder', 540, 775);

      // Role Pill Box
      ctx.fillStyle = 'rgba(6, 44, 32, 0.9)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(190, 815, 700, 70, 14);
      } else {
        ctx.rect(190, 815, 700, 70);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(`⚡ ${role || 'Builder'}`, 540, 860);

      // Verification QR Placeholder Box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(450, 930, 180, 180);

      // Simulated QR pattern grid
      ctx.fillStyle = '#041c14';
      ctx.fillRect(470, 950, 40, 40);
      ctx.fillRect(570, 950, 40, 40);
      ctx.fillRect(470, 1050, 40, 40);
      ctx.fillRect(530, 990, 30, 30);
      ctx.fillRect(570, 1030, 20, 20);

      // ID Badge Details
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(`ID: ${autoId}`, 540, 1160);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText('SCAN QR TO VERIFY CREDENTIAL', 540, 1200);
      ctx.fillText('#FrameInGoa • LESS NOISE. MORE SIGNAL.', 540, 1240);
    };
  }, [userImage, selectedTheme, name, role, handle, autoId]);

  const handleDownload = () => {
    if (!name.trim()) {
      setValidationError('Please enter a name before exporting.');
      return;
    }
    setValidationError('');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${autoId}_Builder_Pass.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Form Controls (Steps 1 & 2) */}
      <div className="lg:col-span-6 space-y-4">
        {activeStep === 1 && (
          <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl shadow-xl">
            {renderUploadSlot}
            <button
              onClick={() => setActiveStep(2)}
              className="w-full mt-4 py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
            >
              Continue to Details →
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl shadow-xl space-y-4 text-left">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step 2: Builder Credentials
            </h3>

            <div>
              <label className="text-xs font-semibold text-emerald-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ankan Mahanti"
                className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-emerald-300">Role / Stack</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Student / Builder"
                  className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-emerald-300">Twitter / X</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@handle"
                  className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Auto Generated ID Field */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-emerald-300">System Credential ID</label>
                <button
                  onClick={regenerateId}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  ↻ Refresh ID
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={autoId}
                className="w-full mt-1 bg-emerald-900/30 border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 cursor-not-allowed"
              />
            </div>

            {/* Theme Picker */}
            <div>
              <label className="text-xs font-semibold text-emerald-300">Visual Style</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-2 rounded-xl border text-xs font-medium transition ${
                      selectedTheme.id === theme.id
                        ? 'border-amber-400 bg-emerald-900 text-white'
                        : 'border-emerald-900 bg-emerald-950/40 text-emerald-300/70'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveStep(3)}
              className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-sm mt-2"
            >
              Preview Generated Pass →
            </button>
          </div>
        )}

        {(activeStep === 3 || activeStep === 4) && (
          <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider text-left">
              Step {activeStep}: Actions & Export
            </h3>

            {validationError && (
              <p className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-lg border border-red-800">
                ⚠️ {validationError}
              </p>
            )}

            <button
              onClick={handleDownload}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg hover:opacity-90 transition"
            >
              ⬇ Export Printable Pass (PNG)
            </button>

            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Just verified my official Builder Pass for Hacker House Goa 2026! ID: ${autoId} 🌴🚀 #FrameInGoa`
                );
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
              }}
              className="w-full py-3 bg-emerald-900 border border-emerald-700 text-amber-300 font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
            >
              🚀 Share Credential on X
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full py-2 text-xs text-emerald-400 hover:underline"
            >
              ← Edit Details
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Live Card Hero Showcase (Always Visible) */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-emerald-950">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>
        <p className="text-[11px] text-emerald-300/60 mt-2 font-mono">
          Credential Verified • Live Canvas Render
        </p>
      </div>
    </div>
  );
}
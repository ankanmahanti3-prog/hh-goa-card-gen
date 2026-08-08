'use client';

import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface CardCanvasProps {
  userImage: string;
  activeStep: number;
  setActiveStep: (step: number) => void;
  renderUploadSlot: React.ReactNode;
}

const THEMES = [
  { id: 'emerald', name: 'Emerald Palms', primary: '#10b981', secondary: '#f59e0b', bg: '#022c22' },
  { id: 'goa', name: 'Goa Sunset', primary: '#fbbf24', secondary: '#ef4444', bg: '#1c0c04' },
  { id: 'cyberpunk', name: 'Cyber Matrix', primary: '#06b6d4', secondary: '#ec4899', bg: '#090d16' },
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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const regenerateId = () => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().slice(0, 4);
    const prefix = name ? name.trim().substring(0, 3).toUpperCase() : 'HKR';
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

    img.onload = async () => {
      // High-Res Render Canvas (1080 x 1350)
      canvas.width = 1080;
      canvas.height = 1350;

      // Deep Background
      ctx.fillStyle = selectedTheme.bg;
      ctx.fillRect(0, 0, 1080, 1350);

      // Subtle Decorative Goa Coastline Waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(950, 100, 100 + i * 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer Glow Border
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
      gradient.addColorStop(0, selectedTheme.primary);
      gradient.addColorStop(1, selectedTheme.secondary);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 18;
      ctx.strokeRect(24, 24, 1032, 1302);

      // Event Branding Header
      ctx.fillStyle = selectedTheme.primary;
      ctx.font = '900 46px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌴 HACKER HOUSE GOA 2026 🌴', 540, 95);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('OFFICIAL DIGITAL BUILDER PASS', 540, 138);

      // Photo Frame & Clipping
      const photoSize = 460;
      const photoX = (1080 - photoSize) / 2;
      const photoY = 175;

      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 28);
      } else {
        ctx.rect(photoX, photoY, photoSize, photoSize);
      }
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Photo Border Accent
      ctx.strokeStyle = selectedTheme.primary;
      ctx.lineWidth = 6;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(photoX, photoY, photoSize, photoSize, 28);
      } else {
        ctx.rect(photoX, photoY, photoSize, photoSize);
      }
      ctx.stroke();

      // Builder Name (Dominant Typography)
      const displayName = name.trim().length > 22 ? `${name.trim().substring(0, 20)}...` : name.trim() || 'Ankan Mahanti';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 58px Inter, sans-serif';
      ctx.fillText(displayName, 540, 715);

      // Twitter / X Handle
      ctx.fillStyle = selectedTheme.primary;
      ctx.font = '600 28px Inter, sans-serif';
      ctx.fillText(handle.trim() || '@builder', 540, 760);

      // Role Pill Box
      ctx.fillStyle = 'rgba(6, 44, 32, 0.95)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(190, 800, 700, 68, 16);
      } else {
        ctx.rect(190, 800, 700, 68);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(`⚡ ${role.trim() || 'Builder'}`, 540, 844);

      // Dynamic QR Code Rendering for Live Verification Engine
      const verifyUrl = `${window.location.origin}?verify=${autoId}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
      try {
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 170 });
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => (qrImg.onload = resolve));
        ctx.drawImage(qrImg, 455, 915, 170, 170);
      } catch {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(455, 915, 170, 170);
      }

      // Credential Metadata Footer
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 26px Inter, sans-serif';
      ctx.fillText(`BUILDER ID: ${autoId}`, 540, 1140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText('SCAN TO VERIFY', 540, 1180);
      ctx.fillText('#FrameInGoa • LESS NOISE. MORE SIGNAL.', 540, 1220);
    };
  // Note: Removed `handle` from dependencies to eliminate unnecessary redraws when typing handles
  }, [userImage, selectedTheme, name, role, autoId]);

  // Fast memory-efficient toBlob() download handler
  const handleDownload = () => {
    if (!name.trim()) {
      setValidationError('Please enter your full name before downloading.');
      return;
    }
    setValidationError('');

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${autoId}_HackerHouse_Goa_Pass.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShareToX = () => {
    const shareText = encodeURIComponent(
      `Just generated my official Builder Pass for Hacker House Goa 2026! 🌴🚀\n\nGenerate yours here: https://hh-goa-card-gen-eight.vercel.app/\n\n#FrameInGoa @HackerHouseGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  };

  return (
    <div className="w-full">
      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-emerald-950 border-2 border-emerald-500/80 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-amber-400">CREDENTIAL VERIFIED</h3>
            <p className="text-xs text-emerald-200">Hacker House Goa 2026 Official Builder Pass</p>
            <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs space-y-2 border border-emerald-800">
              <div><span className="text-slate-400">Name:</span> <strong className="text-white">{name}</strong></div>
              <div><span className="text-slate-400">Role:</span> <strong className="text-amber-400">{role}</strong></div>
              <div><span className="text-slate-400">Builder ID:</span> <strong className="text-emerald-400 font-mono">{autoId}</strong></div>
              <div><span className="text-slate-400">Status:</span> <strong className="text-emerald-400">🟢 Active & Verified Attendee</strong></div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          {activeStep === 1 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl">
              {renderUploadSlot}
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full mt-4 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg"
              >
                Continue to Details →
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 2: Builder Credentials
              </h3>

              <div>
                <label className="text-xs font-semibold text-emerald-300">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankan Mahanti"
                  className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
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
                    className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-300">Twitter / X</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-emerald-300">System Builder ID</label>
                  <button
                    type="button"
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
                  className="w-full mt-1 bg-emerald-900/30 border border-emerald-800/60 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-300">Visual Theme</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                        selectedTheme.id === theme.id
                          ? 'border-amber-400 bg-emerald-900 text-white'
                          : 'border-emerald-900 bg-emerald-950/40 text-emerald-300/70 hover:text-emerald-100'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg mt-2"
              >
                Preview Builder Pass →
              </button>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 3: Preview Pass
              </h3>

              <p className="text-xs text-emerald-200/80">
                Review your official pass on the right. You can verify the QR credential before downloading or sharing.
              </p>

              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="w-full py-3 bg-emerald-900/90 border border-emerald-700 text-emerald-300 font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
              >
                🔐 Verify Credential
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg"
              >
                Continue to Download & Share →
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full py-2 text-xs text-emerald-400 hover:underline text-center block"
              >
                ← Edit Details
              </button>
            </div>
          )}

          {activeStep === 4 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 4: Download & Share
              </h3>

              {validationError && (
                <p className="text-xs text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800">
                  ⚠️ {validationError}
                </p>
              )}

              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-extrabold rounded-xl text-base shadow-xl hover:opacity-95 transition"
              >
                ⬇ Download High-Res Pass (PNG)
              </button>

              <button
                type="button"
                onClick={handleShareToX}
                className="w-full py-3.5 bg-amber-400/10 border border-amber-400/40 text-amber-300 font-bold rounded-xl text-xs hover:bg-amber-400/20 transition flex items-center justify-center space-x-2"
              >
                <span>𝕏 Share to X (#FrameInGoa)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="w-full py-2 text-xs text-emerald-400 hover:underline text-center block"
              >
                ← Back to Preview
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Hero Preview Showcase */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start">
          <div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.15)] bg-emerald-950">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>
          <div className="flex items-center space-x-2 mt-3 text-xs text-emerald-300/80 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verifiable Pass Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
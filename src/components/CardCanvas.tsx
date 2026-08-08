'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';

interface CardCanvasProps {
  userImage: string | null;
  activeStep: number;
  setActiveStep: (step: number) => void;
  renderUploadSlot: React.ReactNode;
  canAccessStep: (step: number) => boolean;
}

const THEMES = [
  { id: 'emerald', name: 'EMERALD PALMS', primary: '#10b981', secondary: '#f59e0b', bg: '#022c22' },
  { id: 'goa', name: 'GOA SUNSET', primary: '#fbbf24', secondary: '#ef4444', bg: '#1c0c04' },
  { id: 'cyberpunk', name: 'CYBER MATRIX', primary: '#06b6d4', secondary: '#ec4899', bg: '#090d16' },
];

export default function CardCanvas({
  userImage,
  activeStep,
  setActiveStep,
  renderUploadSlot,
  canAccessStep,
}: CardCanvasProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('BUILDER');
  const [autoId, setAutoId] = useState('HHG26-ANK-8F3A');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const regenerateId = () => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().slice(0, 4);
    const prefix = name ? name.trim().substring(0, 3).toUpperCase() : 'HKR';
    setAutoId(`HHG26-${prefix}-${randomHex}`);
  };

  // Pre-render QR code independently to prevent expensive re-draws during typing
  useEffect(() => {
    let cancelled = false;
    const generateQR = async () => {
      try {
        const verifyUrl = `${window.location.origin}?verify=${autoId}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
        const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 170 });
        if (!cancelled) setQrDataUrl(qr);
      } catch {
        if (!cancelled) setQrDataUrl('');
      }
    };
    generateQR();
    return () => {
      cancelled = true;
    };
  }, [autoId, name, role]);

  const renderCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1350;

    // Background
    ctx.fillStyle = selectedTheme.bg;
    ctx.fillRect(0, 0, 1080, 1350);

    // Left Geometric Pattern Strip
    ctx.fillStyle = 'rgba(255, 213, 46, 0.08)';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(30, 80 + i * 80, 20, 40);
    }

    // Outer Glow Frame
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, selectedTheme.primary);
    gradient.addColorStop(1, selectedTheme.secondary);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 18;
    ctx.strokeRect(24, 24, 1032, 1302);

    // Header Title
    ctx.fillStyle = selectedTheme.primary;
    ctx.font = '900 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HACKER HOUSE GOA', 540, 95);

    // Date & Location Pill
    ctx.fillStyle = '#FFD52E';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('28—31 OCT 2026 • GOA, INDIA', 540, 138);

    // Photo Box Specifications
    const photoSize = 460;
    const photoX = (1080 - photoSize) / 2;
    const photoY = 175;

    const drawTextAndDetails = () => {
      // Name Typography
      const displayName = name.trim().length > 22 ? `${name.trim().substring(0, 20)}...` : name.trim() || 'YOUR NAME HERE';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 58px Inter, sans-serif';
      ctx.fillText(displayName.toUpperCase(), 540, 715);

      // Twitter / X Handle
      ctx.fillStyle = selectedTheme.primary;
      ctx.font = '600 28px Inter, sans-serif';
      ctx.fillText(handle.trim() || '@handle', 540, 760);

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

      const displayRole = role.trim() ? `${role.trim().toUpperCase()} • ${title}` : `${title} ⚡`;
      ctx.fillStyle = '#FFD52E';
      ctx.font = 'bold 26px Inter, sans-serif';
      ctx.fillText(displayRole, 540, 844);

      // Draw QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 455, 915, 170, 170);
        };
        qrImg.src = qrDataUrl;
      }

      // Metadata Footer
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 26px Inter, sans-serif';
      ctx.fillText(`ID: ${autoId}`, 540, 1140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText('SCAN TO VERIFY', 540, 1180);
      ctx.fillText('LESS NOISE. MORE SIGNAL.', 540, 1220);
    };

    if (userImage) {
      const img = new Image();
      img.onload = () => {
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

        ctx.strokeStyle = selectedTheme.primary;
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(photoX, photoY, photoSize, photoSize, 28);
        } else {
          ctx.rect(photoX, photoY, photoSize, photoSize);
        }
        ctx.stroke();

        drawTextAndDetails();
      };
      img.onerror = () => {
        drawTextAndDetails();
      };
      img.src = userImage;
    } else {
      // Empty-State Placeholder
      ctx.fillStyle = 'rgba(6, 44, 32, 0.6)';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.strokeStyle = selectedTheme.primary;
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText('PHOTO REQUIRED', 540, photoY + photoSize / 2);

      drawTextAndDetails();
    }
  }, [userImage, selectedTheme, name, role, handle, title, autoId, qrDataUrl]);

  // Debounce canvas redraws (150ms) to ensure smooth typing performance
  useEffect(() => {
    const timer = window.setTimeout(() => {
      renderCard();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [renderCard]);

  const handleDownload = () => {
    if (!name.trim()) {
      setValidationError('Please enter your full name before downloading.');
      return;
    }
    if (!userImage) {
      setValidationError('Please upload and crop a photo first.');
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
      `Just generated my Builder ID Card for Hacker House Goa 2026! 🌴🚀\n\nCreate yours: https://hh-goa-card-gen-eight.vercel.app/\n\n#FrameInGoa @HackerHouseGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {/* Pass Preview Details Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-emerald-950 border-2 border-emerald-500/80 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-amber-400">PASS DETAILS & PREVIEW</h3>
            <p className="text-xs text-emerald-200">Hacker House Goa 2026 Credential</p>
            <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs space-y-2 border border-emerald-800">
              <div><span className="text-slate-400">Name:</span> <strong className="text-white">{name || 'Not provided'}</strong></div>
              <div><span className="text-slate-400">Role:</span> <strong className="text-amber-400">{role || 'Builder'}</strong></div>
              <div><span className="text-slate-400">Title:</span> <strong className="text-amber-300">{title}</strong></div>
              <div><span className="text-slate-400">Builder ID:</span> <strong className="text-emerald-400 font-mono">{autoId}</strong></div>
              <div><span className="text-slate-400">Status:</span> <strong className="text-emerald-400">🟢 Active Builder Pass</strong></div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          {activeStep === 1 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl">
              {renderUploadSlot}
              <button
                type="button"
                disabled={!userImage}
                onClick={() => canAccessStep(2) && setActiveStep(2)}
                className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition shadow-lg ${
                  userImage
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-emerald-900/60 text-emerald-600 cursor-not-allowed'
                }`}
              >
                Continue to Details →
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 2: Builder Details
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
                <label className="text-xs font-semibold text-emerald-300">Builder Title</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 bg-emerald-900/60 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="BUILDER">⚡ BUILDER</option>
                  <option value="CODE WIZARD">🪄 CODE WIZARD</option>
                  <option value="AI EXPLORER">🤖 AI EXPLORER</option>
                  <option value="PROTOCOL ARCHITECT">🌐 PROTOCOL ARCHITECT</option>
                </select>
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
                disabled={!name.trim()}
                onClick={() => canAccessStep(3) && setActiveStep(3)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-lg mt-2 ${
                  name.trim()
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-emerald-900/60 text-emerald-600 cursor-not-allowed'
                }`}
              >
                Preview Builder Pass →
              </button>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-emerald-950/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 3: Pass Preview
              </h3>

              <p className="text-xs text-emerald-200/80">
                Review your generated pass on the right before exporting or sharing.
              </p>

              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="w-full py-3 bg-emerald-900/90 border border-emerald-700 text-emerald-300 font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
              >
                🔍 Inspect Pass Details
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg"
              >
                Continue to Export →
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

        {/* Right Column: Hero Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start">
          <div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.15)] bg-emerald-950">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>
          <div className="flex items-center space-x-2 mt-3 text-xs text-emerald-300/80 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pass Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
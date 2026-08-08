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
  { id: 'emerald', name: 'EMERALD', primary: '#10b981', secondary: '#f59e0b', bg: '#022c22' },
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
  const [location, setLocation] = useState('Bankura, India');
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('CODE WIZARD ⚡');
  const [autoId, setAutoId] = useState('HHG26-ANK-8F3A');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Full-Stack', 'Next.js']);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const availableTags = ['Full-Stack', 'Frontend', 'Backend', 'AI / ML', 'Web3', 'Design'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const regenerateId = () => {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().slice(0, 4);
    const prefix = name ? name.trim().substring(0, 3).toUpperCase() : 'ANK';
    setAutoId(`HHG26-${prefix}-${randomHex}`);
  };

  useEffect(() => {
    let cancelled = false;
    const generateQR = async () => {
      try {
        const verifyUrl = `${window.location.origin}?verify=${autoId}&name=${encodeURIComponent(name || 'Ankan Mahanti')}&role=${encodeURIComponent(role || 'Student / Builder')}`;
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

    // Left Pattern Strip Accent
    ctx.fillStyle = 'rgba(255, 213, 46, 0.12)';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(30, 80 + i * 80, 20, 40);
    }

    // Outer Glow Border
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, selectedTheme.primary);
    gradient.addColorStop(1, selectedTheme.secondary);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 18;
    ctx.strokeRect(24, 24, 1032, 1302);

    // Title Branding
    ctx.fillStyle = selectedTheme.primary;
    ctx.font = '900 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HACKER HOUSE GOA 2026', 540, 95);

    // Pink Identity Pill Banner
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(340, 118, 400, 44, 22);
    } else {
      ctx.rect(340, 118, 400, 44);
    }
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px Inter, sans-serif';
    ctx.fillText('OFFICIAL BUILDER PASS', 540, 146);

    // Photo Box Specifications
    const photoSize = 440;
    const photoX = (1080 - photoSize) / 2;
    const photoY = 185;

    const drawTextAndDetails = () => {
      // Name
      const displayName = name.trim().length > 22 ? `${name.trim().substring(0, 20)}...` : name.trim() || 'ANKAN MAHANTI';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 58px Inter, sans-serif';
      ctx.fillText(displayName.toUpperCase(), 540, 710);

      // Handle
      ctx.fillStyle = selectedTheme.primary;
      ctx.font = '600 28px Inter, sans-serif';
      ctx.fillText(handle.trim() || '@ankanmahanti', 540, 755);

      // Hot Pink Builder Title Badge Box
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(240, 785, 600, 64, 18);
      } else {
        ctx.rect(240, 785, 600, 64);
      }
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px Inter, sans-serif';
      ctx.fillText(title.toUpperCase(), 540, 828);

      // Role & Location Stack Details
      ctx.fillStyle = '#FFD52E';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ROLE', 100, 930);
      ctx.fillStyle = '#ffffff';
      ctx.fillText((role.trim() || 'Student / Builder').toUpperCase(), 100, 965);

      ctx.fillStyle = '#FFD52E';
      ctx.fillText('LOCATION', 100, 1020);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(location.toUpperCase(), 100, 1055);

      ctx.fillStyle = '#10b981';
      ctx.fillText('BUILDER ID', 100, 1110);
      ctx.fillStyle = '#FFD52E';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(autoId, 100, 1145);

      // Draw QR Code in Right Corner
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 780, 920, 200, 200);
          ctx.fillStyle = '#FFD52E';
          ctx.font = 'bold 18px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SCAN TO VERIFY', 880, 1150);
        };
        qrImg.src = qrDataUrl;
      }

      // Footer Slogan
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOA, INDIA • 28 — 31 OCT 2026 • #FrameInGoa', 540, 1220);
      ctx.fillText('LESS NOISE. MORE SIGNAL.', 540, 1255);
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
      ctx.fillStyle = 'rgba(6, 44, 32, 0.6)';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.strokeStyle = selectedTheme.primary;
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PHOTO REQUIRED', 540, photoY + photoSize / 2);

      drawTextAndDetails();
    }
  }, [userImage, selectedTheme, name, role, location, handle, title, autoId, qrDataUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      renderCard();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [renderCard]);

  const handleDownload = () => {
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Inspection Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03291e] border-2 border-emerald-500/80 p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h3 className="text-xl font-black text-amber-400">PASS DETAILS & PREVIEW</h3>
            <div className="bg-[#011710] p-4 rounded-2xl text-left text-xs space-y-2 border border-emerald-800">
              <div><span className="text-emerald-400/60 font-bold">Name:</span> <strong className="text-white">{name || 'Ankan Mahanti'}</strong></div>
              <div><span className="text-emerald-400/60 font-bold">Role:</span> <strong className="text-amber-400">{role || 'Student / Builder'}</strong></div>
              <div><span className="text-emerald-400/60 font-bold">Title:</span> <strong className="text-pink-400">{title}</strong></div>
              <div><span className="text-emerald-400/60 font-bold">Builder ID:</span> <strong className="text-emerald-400 font-mono">{autoId}</strong></div>
              <div><span className="text-emerald-400/60 font-bold">Status:</span> <strong className="text-emerald-400">🟢 Active Builder Pass</strong></div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-3 bg-amber-400 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-300 transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Left Form Controls Panel */}
      <div className="lg:col-span-5 space-y-4">
        {activeStep === 1 && (
          <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl">
            {renderUploadSlot}
            <button
              type="button"
              disabled={!userImage}
              onClick={() => canAccessStep(2) && setActiveStep(2)}
              className={`w-full mt-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                userImage
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg'
                  : 'bg-emerald-950 text-emerald-700 cursor-not-allowed border border-emerald-900'
              }`}
            >
              Continue to Details →
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              02 / YOUR DETAILS
            </h3>

            <div>
              <label className="text-xs font-bold text-emerald-300">FULL NAME *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ankan Mahanti"
                className="w-full mt-1.5 bg-[#011710] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-emerald-300">ROLE / STACK *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Student / Builder"
                  className="w-full mt-1.5 bg-[#011710] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-300">LOCATION</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bankura, India"
                  className="w-full mt-1.5 bg-[#011710] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300">TWITTER / X HANDLE</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@ankanmahanti"
                className="w-full mt-1.5 bg-[#011710] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300">TECH STACK TAGS (PICK UP TO 3)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      selectedTags.includes(tag)
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-[#011710] text-emerald-400/80 border-emerald-800 hover:border-emerald-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-900/80">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">
                03 / BUILDER IDENTITY
              </h3>

              <div>
                <label className="text-xs font-bold text-emerald-300">BUILDER TITLE</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1.5 bg-[#011710] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value="CODE WIZARD ⚡">CODE WIZARD ⚡</option>
                  <option value="FULL-STACK BUILDER 🚀">FULL-STACK BUILDER 🚀</option>
                  <option value="AI EXPLORER 🤖">AI EXPLORER 🤖</option>
                  <option value="PROTOCOL ARCHITECT 🌐">PROTOCOL ARCHITECT 🌐</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-emerald-300">SYSTEM BUILDER ID</label>
                <button
                  type="button"
                  onClick={regenerateId}
                  className="text-xs text-amber-400 hover:underline font-bold"
                >
                  ↻ REFRESH ID
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={autoId}
                className="w-full mt-1.5 bg-[#011710]/60 border border-emerald-900 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              onClick={() => canAccessStep(3) && setActiveStep(3)}
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg mt-2"
            >
              Preview Builder Pass →
            </button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              03 / PASS PREVIEW
            </h3>

            <p className="text-xs text-emerald-200/80">
              Review your generated pass on the right before exporting or sharing.
            </p>

            <button
              type="button"
              onClick={() => setShowVerificationModal(true)}
              className="w-full py-3 bg-emerald-900/80 border border-emerald-700 text-emerald-300 font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
            >
              🔍 Inspect Pass Details
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
            >
              Continue to Export →
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="w-full py-2 text-xs text-emerald-400 hover:underline text-center block font-bold"
            >
              ← Edit Details
            </button>
          </div>
        )}

        {activeStep === 4 && (
          <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              04 / DOWNLOAD & SHARE
            </h3>

            {validationError && (
              <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-800">
                ⚠️ {validationError}
              </p>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-4 bg-amber-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-xl hover:bg-amber-300 transition"
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
              className="w-full py-2 text-xs text-emerald-400 hover:underline text-center block font-bold"
            >
              ← Back to Preview
            </button>
          </div>
        )}
      </div>

      {/* Right Canvas Showcase Panel */}
      <div className="lg:col-span-7 flex flex-col items-center justify-start">
        <div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_60px_rgba(251,191,36,0.18)] bg-[#011710]">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>
        <div className="flex items-center space-x-2 mt-4 text-xs text-emerald-300/80 font-mono bg-[#03291e] border border-emerald-800 px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE PREVIEW • 1080×1350 High-Res Pass</span>
        </div>
      </div>
    </div>
  );
}
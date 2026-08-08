'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [verifyData, setVerifyData] = useState<{ id: string; name: string; role: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live Clock Engine
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verifyId = params.get('verify');
      const verifyName = params.get('name');
      const verifyRole = params.get('role');

      if (verifyId && verifyName) {
        setVerifyData({
          id: verifyId,
          name: decodeURIComponent(verifyName),
          role: verifyRole ? decodeURIComponent(verifyRole) : 'Builder',
        });
      }
    }
  }, []);

  const handleImageSelected = (objectUrl: string) => {
    setSelectedImage((previous) => {
      if (previous && previous.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return objectUrl;
    });

    setCroppedImage((previous) => {
      if (previous && previous.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
  };

  const handleCropComplete = (croppedUrl: string) => {
    setCroppedImage(croppedUrl);
    setActiveStep(2);
  };

  const handleReset = () => {
    if (selectedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage);
    }
    if (croppedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(croppedImage);
    }
    setSelectedImage(null);
    setCroppedImage(null);
    setActiveStep(1);
  };

  const canAccessStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return !!croppedImage || !!selectedImage;
    if (step === 3 || step === 4) return !!croppedImage;
    return false;
  };

  return (
    <main className="min-h-screen relative bg-[#01140f] text-slate-100 flex flex-col items-center justify-start font-mono selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Ambient Background Glow Orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0 animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="fixed top-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0 animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* 2. Low-Opacity Repeating Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-repeat bg-center mix-blend-screen z-0"
        style={{ backgroundImage: "url('/goa-beach-illustration.png')", backgroundSize: '600px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#01140f]/80 via-[#01140f]/60 to-[#01140f]/90 z-0" />

      {/* Verification Overlay Modal */}
      {verifyData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#03291e] border-2 border-emerald-400/80 p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-[0_0_80px_rgba(16,185,129,0.3)]">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-emerald-400/40">
              ✓
            </div>
            <div>
              <h2 className="text-2xl font-black text-amber-400 tracking-tight">CREDENTIAL VERIFIED</h2>
              <p className="text-xs text-emerald-300/80 mt-1">Hacker House Goa 2026 System</p>
            </div>
            <div className="bg-[#011710] p-5 rounded-2xl text-left text-xs space-y-3 border border-emerald-800/80">
              <div><span className="text-emerald-400/60 uppercase text-[10px] block">Name</span> <strong className="text-white text-base block">{verifyData.name}</strong></div>
              <div><span className="text-emerald-400/60 uppercase text-[10px] block">Role</span> <strong className="text-amber-400 text-sm block">{verifyData.role}</strong></div>
              <div><span className="text-emerald-400/60 uppercase text-[10px] block">Builder ID</span> <strong className="text-emerald-400 text-sm block">{verifyData.id}</strong></div>
              <div className="pt-2 border-t border-emerald-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <strong className="text-emerald-400 font-bold">Verified Attendee Credential</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setVerifyData(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full py-3.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-300 transition"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

      {/* Official Graphical Header Banner */}
      <div className="relative z-10 w-full bg-[#01120d]/90 backdrop-blur-md border-b border-emerald-900/60 px-4 py-5 text-center shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Subheading Banner */}
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-3">
              <img src="/hacker-house-logo.png" alt="Hacker House" className="h-10 sm:h-12 w-auto object-contain" />
              <img src="/goa-hindi-badge.png" alt="Goa" className="h-10 sm:h-12 w-auto object-contain" />
              <span className="px-2 py-0.5 bg-pink-600/20 text-pink-400 border border-pink-500/40 text-[10px] font-bold rounded tracking-wider">
                #FrameInGoa
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
              BUILDER IDENTITY STUDIO
            </h1>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-4">
            
            {/* Pure CSS Chunky Live Doodle Clock Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center leading-none px-2 select-none">
              <span 
                style={{ fontFamily: "'Kalam', cursive" }} 
                className="text-2xl sm:text-[26px] font-bold text-[#FFD52E] tracking-tight leading-none"
              >
                {currentTime || '10:49 PM'}
              </span>
              <span 
                style={{ fontFamily: "'Kalam', cursive" }}
                className="text-[13px] font-bold text-[#FFD52E] tracking-widest uppercase -mt-0.5"
              >
                STUDIO
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-amber-300 bg-emerald-950/90 px-4 py-2.5 rounded-xl border border-emerald-800/80 shadow-lg">
              <span>📍 GOA, INDIA</span>
              <span>•</span>
              <span>📅 28 — 31 OCT 2026</span>
            </div>
          </div>

        </div>
      </div>

      {/* Yellow Ticker Ribbon */}
      <div className="relative z-10 w-full bg-amber-400 text-slate-950 py-2 px-4 font-black text-xs uppercase tracking-widest overflow-hidden whitespace-nowrap shadow-md">
        <div className="flex justify-around items-center gap-8">
          <span>⚡ BUILD IN SUN</span>
          <span>•</span>
          <span>🌴 LESS NOISE. MORE SIGNAL.</span>
          <span>•</span>
          <span>🚀 SHIP FROM PARADISE</span>
          <span>•</span>
          <span>⚡ BUILD IN SUN</span>
        </div>
      </div>

      {/* Step Wizard Bar */}
      <div className="relative z-10 w-full max-w-6xl px-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#011710]/90 backdrop-blur-md p-2 rounded-2xl border border-emerald-800/80 shadow-2xl">
          {[
            { step: 1, label: '01 PHOTO', sub: 'Upload & Crop' },
            { step: 2, label: '02 DETAILS', sub: 'Your Information' },
            { step: 3, label: '03 PREVIEW', sub: 'Verify & Review' },
            { step: 4, label: '04 EXPORT', sub: 'Download & Share' },
          ].map((item) => {
            const accessible = canAccessStep(item.step);
            return (
              <button
                key={item.step}
                type="button"
                disabled={!accessible}
                onClick={() => accessible && setActiveStep(item.step)}
                className={`py-3 px-3 text-left rounded-xl transition ${
                  activeStep === item.step
                    ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                    : accessible
                    ? 'text-emerald-300/80 hover:bg-emerald-900/40 hover:text-white cursor-pointer'
                    : 'text-emerald-800/40 cursor-not-allowed'
                }`}
              >
                <div className="font-black text-xs">{item.label}</div>
                <div className="text-[10px] opacity-80">{item.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Workstation Grid */}
      <div className="relative z-10 w-full max-w-6xl p-4 my-2">
        <CardCanvas
          userImage={croppedImage}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          canAccessStep={canAccessStep}
          renderUploadSlot={
            <div className="space-y-4">
              {!selectedImage && (
                <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
                    01 / BUILDER PHOTO *
                  </h3>
                  <ImageUploader onImageSelected={handleImageSelected} />
                </div>
              )}

              {selectedImage && !croppedImage && (
                <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
                    01 / CROP & ADJUST PHOTO
                  </h3>
                  <ImageCropper
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleReset}
                  />
                </div>
              )}

              {croppedImage && (
                <div className="flex justify-between items-center bg-emerald-950/90 p-4 rounded-xl border border-emerald-800 backdrop-blur-md">
                  <span className="text-xs text-emerald-300 font-bold">✓ Photo Uploaded & Cropped</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-amber-400 underline font-bold"
                  >
                    Change Photo
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 border-t border-emerald-900/60 mt-8 text-xs text-emerald-400/70 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-[#011710]/90 backdrop-blur-md rounded-xl border border-emerald-900 shadow-lg">
            <div className="font-bold text-white mb-0.5">🛡️ VERIFIABLE</div>
            <div>Unique ID + QR Link</div>
          </div>
          <div className="p-3 bg-[#011710]/90 backdrop-blur-md rounded-xl border border-emerald-900 shadow-lg">
            <div className="font-bold text-white mb-0.5">🔒 100% LOCAL</div>
            <div>Browser-only processing</div>
          </div>
          <div className="p-3 bg-[#011710]/90 backdrop-blur-md rounded-xl border border-emerald-900 shadow-lg">
            <div className="font-bold text-white mb-0.5">⚡ FAST ENGINE</div>
            <div>High-res 1080×1350 canvas</div>
          </div>
          <div className="p-3 bg-[#011710]/90 backdrop-blur-md rounded-xl border border-emerald-900 shadow-lg">
            <div className="font-bold text-white mb-0.5">🌴 GOA 2026</div>
            <div>Ship From Paradise</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/60 border-t border-emerald-900/40 pt-4">
          <div>© 2026 Hacker House Goa. All rights reserved.</div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0 font-bold text-amber-400">
            <span>Design • Build • Ship from Paradise 🌴</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
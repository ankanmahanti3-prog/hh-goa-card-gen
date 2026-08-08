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
    <main className="min-h-screen bg-[#021812] text-slate-100 flex flex-col items-center justify-start font-mono selection:bg-amber-400 selection:text-slate-950">
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

      {/* Hero Header Studio Banner */}
      <div className="w-full bg-[#01120d] border-b border-emerald-900/60 px-4 py-6 text-center space-y-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-400 tracking-tighter">HACKER HOUSE <span className="text-pink-500">GOA</span></span>
              <span className="px-2 py-0.5 bg-pink-600/20 text-pink-400 border border-pink-500/40 text-[10px] font-bold rounded">#FrameInGoa</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">BUILDER IDENTITY STUDIO</h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-amber-300 bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-800/80">
            <span>📍 GOA, INDIA</span>
            <span>•</span>
            <span>📅 28 — 31 OCT 2026</span>
          </div>
        </div>
      </div>

      {/* Event Yellow Ticker Ribbon */}
      <div className="w-full bg-amber-400 text-slate-950 py-2 px-4 font-black text-xs uppercase tracking-widest overflow-hidden whitespace-nowrap shadow-md">
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
      <div className="w-full max-w-6xl px-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#011710] p-2 rounded-2xl border border-emerald-800/80">
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
                    ? 'bg-amber-400 text-slate-950 shadow-lg'
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
      <div className="w-full max-w-6xl p-4 my-2">
        <CardCanvas
          userImage={croppedImage}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          canAccessStep={canAccessStep}
          renderUploadSlot={
            <div className="space-y-4">
              {!selectedImage && (
                <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
                    01 / BUILDER PHOTO *
                  </h3>
                  <ImageUploader onImageSelected={handleImageSelected} />
                </div>
              )}

              {selectedImage && !croppedImage && (
                <div className="bg-[#03291e]/90 border border-emerald-800 p-6 rounded-2xl">
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
                <div className="flex justify-between items-center bg-emerald-950 p-4 rounded-xl border border-emerald-800">
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

      {/* Trust Badges Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-8 border-t border-emerald-900/60 mt-8 text-xs text-emerald-400/70">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-[#011710] rounded-xl border border-emerald-900">
            <div className="font-bold text-white mb-0.5">🛡️ VERIFIABLE</div>
            <div>Unique ID + QR Link</div>
          </div>
          <div className="p-3 bg-[#011710] rounded-xl border border-emerald-900">
            <div className="font-bold text-white mb-0.5">🔒 100% LOCAL</div>
            <div>Browser-only processing</div>
          </div>
          <div className="p-3 bg-[#011710] rounded-xl border border-emerald-900">
            <div className="font-bold text-white mb-0.5">⚡ FAST ENGINE</div>
            <div>High-res 1080×1350 canvas</div>
          </div>
          <div className="p-3 bg-[#011710] rounded-xl border border-emerald-900">
            <div className="font-bold text-white mb-0.5">🌴 GOA 2026</div>
            <div>Ship From Paradise</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
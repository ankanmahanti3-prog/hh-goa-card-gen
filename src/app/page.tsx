'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [verifyData, setVerifyData] = useState<{ id: string; name: string; role: string } | null>(null);

  // Parse QR scan verification link parameters
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

  const handleImageSelected = (dataUrl: string) => {
    setSelectedImage(dataUrl);
    setCroppedImage(null); // Clear previous crop if re-uploading
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl);
    setActiveStep(2); // Automatically advance wizard to 02 DETAILS
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setActiveStep(1);
  };

  return (
    <main className="min-h-screen relative bg-gradient-to-b from-[#011a14] via-[#03362a] to-[#01120e] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Verification Portal Modal when QR Scanned */}
      {verifyData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-emerald-950 border-2 border-emerald-400 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-amber-400">CREDENTIAL VERIFIED</h2>
            <p className="text-xs text-emerald-200">Hacker House Goa 2026 Verification Portal</p>
            <div className="bg-slate-900/90 p-5 rounded-2xl text-left text-xs space-y-2.5 border border-emerald-800/80">
              <div><span className="text-slate-400">Name:</span> <strong className="text-white text-sm block">{verifyData.name}</strong></div>
              <div><span className="text-slate-400">Role:</span> <strong className="text-amber-400 block">{verifyData.role}</strong></div>
              <div><span className="text-slate-400">Builder ID:</span> <strong className="text-emerald-400 font-mono block">{verifyData.id}</strong></div>
              <div><span className="text-slate-400">Status:</span> <strong className="text-emerald-400 block">🟢 Official Verified Attendee</strong></div>
            </div>
            <button
              type="button"
              onClick={() => {
                setVerifyData(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <header className="relative z-10 max-w-3xl text-center space-y-2 my-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/90 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg">
          <span>🌴 Hacker House Goa 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]">
          BUILDER CREDENTIAL SYSTEM
        </h1>
        <p className="text-xs sm:text-base text-emerald-200/90 font-medium">
          Verifiable Digital Credential & ID Pass Platform
        </p>
      </header>

      {/* Step Navigation Bar */}
      <div className="relative z-10 w-full max-w-3xl my-4">
        <div className="flex items-center justify-between bg-emerald-950/90 border border-emerald-800/80 p-2 rounded-2xl shadow-xl text-xs font-semibold">
          {[
            { step: 1, label: '01 PHOTO' },
            { step: 2, label: '02 DETAILS' },
            { step: 3, label: '03 PREVIEW' },
            { step: 4, label: '04 EXPORT' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(item.step)}
              className={`flex-1 py-2.5 px-2 text-center rounded-xl transition ${
                activeStep === item.step
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="relative z-10 w-full max-w-6xl mt-2">
        <CardCanvas
          userImage={croppedImage || DEFAULT_PHOTO}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          renderUploadSlot={
            <div className="space-y-4">
              {!selectedImage && (
                <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl">
                  <h3 className="text-xs font-bold text-amber-400 uppercase mb-3">
                    Step 1: Select Profile Image
                  </h3>
                  <ImageUploader onImageSelected={handleImageSelected} />
                </div>
              )}

              {selectedImage && !croppedImage && (
                <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl">
                  <h3 className="text-xs font-bold text-amber-400 uppercase mb-3">
                    Step 2: Adjust Image Crop
                  </h3>
                  <ImageCropper
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleReset}
                  />
                </div>
              )}

              {croppedImage && (
                <div className="flex justify-between items-center bg-emerald-900/40 p-4 rounded-xl border border-emerald-800">
                  <span className="text-xs text-emerald-200 font-medium">✓ Photo Cropped & Ready</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-amber-400 underline font-semibold"
                  >
                    Re-upload Photo
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    </main>
  );
}
'use client';

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleImageSelected = (dataUrl: string) => {
    setSelectedImage(dataUrl);
    setActiveStep(1); // remain on crop step
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setActiveStep(1);
  };

  return (
    <main className="min-h-screen relative bg-gradient-to-b from-[#021c16] via-[#042e23] to-[#01140f] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <header className="relative z-10 max-w-2xl text-center space-y-2 my-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
          <span>🌴 Hacker House Goa 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          BUILDER CREDENTIAL SYSTEM
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/80">
          Official Digital Credential & ID Pass Generator
        </p>
      </header>

      {/* Step Indicator Navigation */}
      <div className="relative z-10 w-full max-w-2xl my-4">
        <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-800/80 p-2 rounded-2xl shadow-xl text-xs font-semibold">
          {[
            { step: 1, label: '01 PHOTO' },
            { step: 2, label: '02 DETAILS' },
            { step: 3, label: '03 PREVIEW' },
            { step: 4, label: '04 EXPORT' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`flex-1 py-2 px-1 text-center rounded-xl transition ${
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

      {/* Main Content Workspace */}
      <div className="relative z-10 w-full max-w-4xl mt-2">
        <CardCanvas
          userImage={croppedImage || DEFAULT_PHOTO}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          onUploadClick={() => setActiveStep(1)}
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
                    onCropComplete={(data: any) => {
                      if (typeof data === 'string') {
                        setCroppedImage(data);
                        setActiveStep(2); // Auto advance to details
                      }
                    }}
                    onCancel={handleReset}
                  />
                </div>
              )}

              {croppedImage && (
                <div className="flex justify-between items-center bg-emerald-900/40 p-4 rounded-xl border border-emerald-800">
                  <span className="text-xs text-emerald-200 font-medium">✓ Photo Cropped & Ready</span>
                  <button
                    onClick={handleReset}
                    className="text-xs text-amber-400 underline font-semibold"
                  >
                    Re-upload
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
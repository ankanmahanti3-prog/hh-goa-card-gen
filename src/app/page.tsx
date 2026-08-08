'use client';

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleImageSelected = (dataUrl: string) => {
    setSelectedImage(dataUrl);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCroppedImage(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Subtle Goa Beach & Palm Silhouette Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#f59e0b_0%,transparent_60%)]" />
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Decorative Beach & Palm Icons */}
      <div className="absolute top-6 left-8 text-emerald-400/20 text-7xl select-none pointer-events-none hidden md:block">
        🌴
      </div>
      <div className="absolute top-10 right-10 text-amber-400/20 text-7xl select-none pointer-events-none hidden md:block">
        🌊
      </div>
      <div className="absolute bottom-6 left-12 text-amber-400/15 text-8xl select-none pointer-events-none hidden lg:block">
        ☀️
      </div>
      <div className="absolute bottom-8 right-12 text-emerald-400/20 text-8xl select-none pointer-events-none hidden lg:block">
        🌴
      </div>

      {/* Studio Banner */}
      <div className="relative z-10 max-w-3xl text-center space-y-3 my-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/90 border border-amber-400/50 text-amber-300 text-xs font-bold tracking-widest uppercase shadow-xl backdrop-blur-md">
          <span>🌴 Hacker House Goa 2026 Studio</span>
        </div>

        {/* Goa Golden Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]">
          BUILDER PASS GENERATOR
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 font-medium max-w-xl mx-auto">
          Personalize & generate your official builder pass or PFP frame for Hacker House Goa 2026.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-2">
        {/* Left Column: Photo Upload / Crop Flow */}
        <div className="space-y-4">
          {!selectedImage && (
            <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-700/60 p-5 rounded-2xl shadow-2xl text-left">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                1. Upload Builder Photo
              </h2>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          )}

          {selectedImage && !croppedImage && (
            <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-700/60 p-5 rounded-2xl shadow-2xl text-left">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                2. Adjust & Crop Photo
              </h2>
              <ImageCropper
                imageSrc={selectedImage}
                onCropComplete={(data: any) => {
                  if (typeof data === 'string') {
                    setCroppedImage(data);
                  }
                }}
                onCancel={handleReset}
              />
            </div>
          )}

          {croppedImage && (
            <button
              onClick={handleReset}
              className="w-full py-2.5 text-xs font-medium text-emerald-200 hover:text-white bg-emerald-950/90 border border-emerald-700/80 rounded-xl transition shadow-lg"
            >
              ← Change / Re-upload Photo
            </button>
          )}
        </div>

        {/* Right Column: Customization & Live Card Studio */}
        <div>
          <CardCanvas userImage={croppedImage || PLACEHOLDER_IMAGE} />
        </div>
      </div>
    </main>
  );
}
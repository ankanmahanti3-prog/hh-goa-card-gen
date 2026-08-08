'use client';

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

// Default fallback image if no photo uploaded yet
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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Studio Banner */}
      <div className="max-w-3xl text-center space-y-2 my-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
          <span>⚡ Hacker House Goa 2026 Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
          BUILDER PASS GENERATOR
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Personalize & generate your official builder pass or PFP frame for Hacker House Goa 2026.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-4">
        {/* Left Column: Photo Upload / Crop Flow */}
        <div className="space-y-4">
          {!selectedImage && (
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl text-left">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                1. Upload Builder Photo
              </h2>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          )}

          {selectedImage && !croppedImage && (
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl text-left">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
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
              className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 rounded-xl transition"
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
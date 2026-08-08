'use client';

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageCropper from '@/components/ImageCropper';
import CardCanvas from '@/components/CardCanvas';

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
      {/* Studio Header */}
      <div className="max-w-2xl text-center space-y-2 my-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
          <span>⚡ Hacker House Goa 2026 Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
          BUILDER PASS GENERATOR
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Personalize & generate your official builder pass or PFP frame for Hacker House Goa.
        </p>
      </div>

      {/* Main Studio Body */}
      <div className="w-full max-w-xl">
        {!selectedImage && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-bold text-slate-300 mb-3 text-left uppercase tracking-wider">
              Step 1: Upload Builder Photo
            </h2>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {selectedImage && !croppedImage && (
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-bold text-slate-300 mb-3 text-left uppercase tracking-wider">
              Step 2: Adjust & Crop Photo
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
          <div className="space-y-4">
            <CardCanvas userImage={croppedImage} />
            <button
              onClick={handleReset}
              className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-xl transition"
            >
              ← Start Over / Upload Different Photo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
'use client';

import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImageCropper from '../components/ImageCropper';
import CardCanvas from '../components/CardCanvas';
import { getCroppedImg, Area } from '../utils/canvasHelpers';

export default function Home() {
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (rawImage) {
      try {
        const cropped = await getCroppedImg(rawImage, croppedAreaPixels);
        setCroppedImage(cropped);
      } catch (err) {
        console.error('Error cropping image:', err);
      }
    }
  };

  const handleReset = () => {
    setRawImage(null);
    setCroppedImage(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            HH Goa 2026
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Frame / ID Card Generator
          </p>
        </div>

        {/* Dynamic Workflow Area */}
        {!rawImage ? (
          /* Step 1: Upload Image */
          <ImageUploader onImageSelected={(img) => setRawImage(img)} />
        ) : !croppedImage ? (
          /* Step 2: Adjust / Crop Image */
          <ImageCropper
            imageSrc={rawImage}
            cropAspect={1}
            onCropComplete={handleCropComplete}
            onCancel={handleReset}
          />
        ) : (
          /* Step 3: Render Final Branded Cards & Download/Share Options */
          <div className="space-y-4">
            <CardCanvas userImage={croppedImage} />
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition"
            >
              ← Start Over with New Photo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
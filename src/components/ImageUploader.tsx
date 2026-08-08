'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
}

// Ultra-fast client-side downscaler for smooth preview rendering
async function downscaleImage(file: File, maxDim = 1400): Promise<string> {
  let fileUrl = URL.createObjectURL(file);

  // Lazy-load HEIC parser ONLY if the file is HEIC
  if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
    const heic2any = (await import('heic2any')).default;
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
    const singleBlob = Array.isArray(blob) ? blob[0] : blob;
    fileUrl = URL.createObjectURL(singleBlob);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = fileUrl;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(fileUrl);

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Image decode failed'));
  });
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const fastDataUrl = await downscaleImage(file);
      onImageSelected(fastDataUrl);
    } catch (err) {
      alert('Could not decode photo. Please select a valid JPG, PNG, or HEIC file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-emerald-700/80 hover:border-amber-400 bg-emerald-950/40 p-8 rounded-2xl flex flex-col items-center justify-center transition group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
          {isProcessing ? '⚡' : '📷'}
        </div>
        <p className="text-sm font-bold text-slate-100">
          {isProcessing ? 'Optimizing Photo...' : 'Click to Upload Profile Photo'}
        </p>
        <p className="text-xs text-emerald-300/70 mt-1">
          Supports JPG, PNG, and iPhone HEIC photos
        </p>
      </button>
    </div>
  );
}
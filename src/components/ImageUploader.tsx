'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
}

// Convert uploaded photo cleanly into a persistent Data URL with instant downscaling
async function processAndDownscaleImage(file: File, maxDim = 1200): Promise<string> {
  let sourceFile: Blob = file;

  // Handle iPhone HEIC files lazily
  if (
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  ) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8,
    });
    sourceFile = Array.isArray(converted) ? converted[0] : converted;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
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
        if (!ctx) return resolve(e.target?.result as string);

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(sourceFile);
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
      const dataUrl = await processAndDownscaleImage(file, 1200);
      onImageSelected(dataUrl);
    } catch (err) {
      console.error('Upload processing error:', err);
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
        accept="image/*,.heic,.heif"
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
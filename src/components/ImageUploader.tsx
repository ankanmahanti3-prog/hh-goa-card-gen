'use client';

import React, { useRef, useState } from 'react';
import { convertHeicToJpeg } from '@/utils/heicHandler';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsConverting(true);
      const imageUrl = await convertHeicToJpeg(file);
      onImageSelected(imageUrl);
    } catch (err) {
      alert('Could not parse image file. Please try a standard JPG/PNG.');
    } finally {
      setIsConverting(false);
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
        disabled={isConverting}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-emerald-700/80 hover:border-amber-400 bg-emerald-950/40 p-8 rounded-2xl flex flex-col items-center justify-center transition group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
          {isConverting ? '⏳' : '📷'}
        </div>
        <p className="text-sm font-bold text-slate-100">
          {isConverting ? 'Converting HEIC Photo...' : 'Click to Upload Profile Photo'}
        </p>
        <p className="text-xs text-emerald-300/70 mt-1">
          Supports JPG, PNG, and iPhone HEIC photos
        </p>
      </button>
    </div>
  );
}
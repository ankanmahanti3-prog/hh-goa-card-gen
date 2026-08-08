'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (src: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const fileName = file.name.toLowerCase();
    const isHeic =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    try {
      setIsProcessing(true);
      let targetFile: Blob = file;

      if (isHeic) {
        setStatusText('Converting iPhone HEIC Photo...');
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        });
        targetFile = Array.isArray(converted) ? converted[0] : converted;
      } else {
        setStatusText('Processing Photo...');
      }

      // Convert to persistent Data URL (immune to unmount revocation)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onImageSelected(dataUrl);
        }
      };
      reader.readAsDataURL(targetFile);
    } catch (err) {
      console.error('File reading error:', err);
      alert('Could not parse image file. Please upload a valid JPG, PNG, or HEIC photo.');
    } font-bold {
      setIsProcessing(false);
      setStatusText(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
          isDragging
            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
            : 'border-emerald-700/80 hover:border-amber-400 bg-emerald-950/40'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-amber-400 mb-3">
          {isProcessing ? '⚡' : '📷'}
        </div>
        <p className="text-sm font-bold text-slate-100">
          {statusText || 'Drop your photo here or tap to browse'}
        </p>
        <p className="text-xs text-emerald-300/70 mt-1">
          Supports JPG, PNG, WEBP, and HEIC
        </p>
      </button>
    </div>
  );
}
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
}

// Memory-efficient client-side image downscaler using ImageBitmap and toBlob()
async function downscaleImage(file: File, maxDim = 1200): Promise<string> {
  let sourceBlob: Blob = file;

  // Lazy HEIC conversion only if file is HEIC/HEIF
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
      quality: 0.75,
    });
    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
  }

  // Fast decoding via ImageBitmap
  const bitmap = await createImageBitmap(sourceBlob);
  let width = bitmap.width;
  let height = bitmap.height;

  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Could not create canvas context');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error('Could not create image blob'));
      },
      'image/jpeg',
      0.82
    );
  });

  return URL.createObjectURL(blob);
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousUrlRef = useRef<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const optimizedUrl = await downscaleImage(file, 1200);

      // Memory leak protection: Revoke old Object URL when uploading a new photo
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = optimizedUrl;

      onImageSelected(optimizedUrl);
    } catch (err) {
      console.error(err);
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
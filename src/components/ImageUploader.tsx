'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
}

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.78;

async function decodeImageFile(file: File): Promise<Blob> {
  const isHEIC =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  // Try native browser decoding first
  if (isHEIC && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        throw new Error('Canvas unavailable');
      }

      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error('Native conversion failed'));
          },
          'image/jpeg',
          0.75
        );
      });

      console.log('Native HEIC decoding succeeded');
      return blob;
    } catch (error) {
      console.log('Native HEIC decoding unavailable, falling back to JS decoder');
    }
  }

  // Fallback for browsers without native HEIC support
  if (isHEIC) {
    console.time('HEIC conversion');
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.7,
    });
    console.timeEnd('HEIC conversion');

    return Array.isArray(converted) ? converted[0] : converted;
  }

  return file;
}

async function processImage(file: File): Promise<string> {
  const sourceBlob = await decodeImageFile(file);
  const bitmap = await createImageBitmap(sourceBlob);

  let width = bitmap.width;
  let height = bitmap.height;

  // Downscale before sending to cropper
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Canvas unavailable');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const output = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Compression failed'));
      },
      'image/jpeg',
      JPEG_QUALITY
    );
  });

  return URL.createObjectURL(output);
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];

    const isValid =
      validTypes.includes(file.type) ||
      /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(file.name);

    if (!isValid) {
      alert('Please select a JPG, PNG, WEBP, or HEIC image.');
      return;
    }

    try {
      setIsProcessing(true);
      const isHEIC =
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif') ||
        file.type === 'image/heic' ||
        file.type === 'image/heif';

      setStatus(isHEIC ? '⚡ Preparing iPhone photo…' : 'Preparing photo…');
      const imageUrl = await processImage(file);
      onImageSelected(imageUrl);
      setStatus('Photo ready ✓');
    } catch (error) {
      console.error('Image processing failed:', error);
      alert('Could not process this photo. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden min-h-[220px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 p-6 group ${
          isDragging
            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
            : 'border-emerald-700/70 bg-emerald-950/50 hover:border-amber-400/80 hover:bg-emerald-900/60'
        } ${isProcessing ? 'cursor-wait opacity-90' : ''}`}
      >
        <div className="absolute w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl group-hover:bg-amber-400/10 transition pointer-events-none" />

        <div className="relative w-14 h-14 rounded-2xl bg-emerald-900 border border-emerald-700 flex items-center justify-center text-2xl shadow-lg mb-3">
          {isProcessing ? '⚡' : '📸'}
        </div>

        <h4 className="relative text-sm font-bold text-white">
          {isProcessing ? 'Optimizing photo' : 'Drop photo here'}
        </h4>

        <p className="relative mt-1 text-xs text-emerald-300/80">
          {isProcessing ? status : 'or click to browse'}
        </p>

        {!isProcessing && (
          <>
            <div className="relative flex items-center gap-2 mt-4 text-[11px] text-emerald-400/70 font-medium">
              <span>JPG</span>
              <span>•</span>
              <span>PNG</span>
              <span>•</span>
              <span>WEBP</span>
              <span>•</span>
              <span>HEIC</span>
            </div>
            <div className="relative mt-1.5 text-[10px] text-slate-400">
              iPhone photos supported (Native + JS fallback)
            </div>
          </>
        )}

        {isProcessing && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-950 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-amber-400 animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400/80 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Processed locally in browser
      </div>
    </div>
  );
}
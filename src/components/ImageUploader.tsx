'use client';

import React, { useRef, useState } from 'react';
import { heicTo } from 'heic-to';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
}

const MAX_SIZE = 1000;

function isHEIC(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  );
}

async function blobToObjectURL(blob: Blob): Promise<string> {
  return URL.createObjectURL(blob);
}

async function resizeImage(
  source: Blob | ImageBitmap,
  maxSize = MAX_SIZE
): Promise<Blob> {
  let bitmap: ImageBitmap;
  if (source instanceof ImageBitmap) {
    bitmap = source;
  } else {
    bitmap = await createImageBitmap(source);
  }

  let width = bitmap.width;
  let height = bitmap.height;

  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);
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

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Image compression failed'));
        }
      },
      'image/jpeg',
      0.78
    );
  });
}

async function processImage(file: File): Promise<string> {
  // HEIC PATH
  if (isHEIC(file)) {
    console.time('⚡ HEIC TOTAL');
    console.time('HEIC DECODE');
    try {
      // Ask heic-to for a bitmap directly
      const bitmap = await heicTo({
        blob: file,
        type: 'bitmap',
        options: {
          imageOrientation: 'none',
        },
      });
      console.timeEnd('HEIC DECODE');

      console.time('HEIC RESIZE');
      const outputBlob = await resizeImage(bitmap, MAX_SIZE);
      console.timeEnd('HEIC RESIZE');
      console.timeEnd('⚡ HEIC TOTAL');

      return blobToObjectURL(outputBlob);
    } catch (error) {
      console.error('HEIC bitmap conversion failed, trying fallback:', error);
      console.time('HEIC JPEG FALLBACK');
      const jpeg = await heicTo({
        blob: file,
        type: 'image/jpeg',
        quality: 0.72,
      });
      console.timeEnd('HEIC JPEG FALLBACK');
      const resized = await resizeImage(jpeg, MAX_SIZE);
      return blobToObjectURL(resized);
    }
  }

  // JPG / PNG / WEBP PATH
  const resized = await resizeImage(file, MAX_SIZE);
  return blobToObjectURL(resized);
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      if (isHEIC(file)) {
        setStatus('⚡ Preparing iPhone photo…');
      } else {
        setStatus('⚡ Preparing photo…');
      }

      const objectURL = await processImage(file);
      setStatus('✓ Photo ready');
      onImageSelected(objectURL);
    } catch (error) {
      console.error('Upload processing error:', error);
      setStatus('');
      alert('Could not process this photo. Please try another JPG, PNG, or HEIC image.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        className="w-full min-h-[180px] border-2 border-dashed border-emerald-700/80 hover:border-amber-400 bg-emerald-950/40 hover:bg-emerald-900/50 p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-wait disabled:opacity-80"
      >
        <div className="text-4xl mb-4">{isProcessing ? '⚡' : '📷'}</div>
        <div className="text-sm font-bold text-white">
          {isProcessing ? status : 'Click to Upload Profile Photo'}
        </div>
        <div className="text-xs text-emerald-300/70 mt-2">
          JPG • PNG • WEBP • HEIC • HEIF
        </div>
        {isProcessing && (
          <div className="w-full max-w-xs mt-5">
            <div className="h-1.5 rounded-full bg-emerald-950 overflow-hidden">
              <div className="h-full w-1/2 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-400 mt-2">
              Processing locally on your device
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
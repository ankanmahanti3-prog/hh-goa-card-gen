'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (objectUrl: string) => void;
}

function isHeic(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  );
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-uploading the same file triggers change event
    e.target.value = '';

    try {
      // Normal JPG / PNG / WEBP = Instant Object URL (Zero FileReader/Canvas overhead)
      if (!isHeic(file)) {
        const objectUrl = URL.createObjectURL(file);
        onImageSelected(objectUrl);
        return;
      }

      // Lazy HEIC conversion for Apple devices
      setIsProcessing(true);
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.82,
      });

      const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
      const objectUrl = URL.createObjectURL(jpegBlob);
      onImageSelected(objectUrl);
    } catch (error) {
      console.error('Image processing failed:', error);
      alert('Could not process this photo. Please try JPG, PNG, or HEIC.');
    } finally {
      setIsProcessing(false);
    }
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
    if (file) {
      const syntheticEvent = {
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={isProcessing}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[180px] rounded-2xl border-2 border-dashed bg-emerald-950/60 hover:border-amber-400 hover:bg-emerald-900/60 transition-all flex flex-col items-center justify-center gap-3 text-center px-6 cursor-pointer ${
          isDragging ? 'border-amber-400 bg-amber-400/10 scale-[1.01]' : 'border-emerald-700'
        }`}
      >
        <div className="text-4xl">{isProcessing ? '⚡' : '↑'}</div>
        <div>
          <div className="text-base font-bold text-white">
            {isProcessing ? 'Preparing HEIC…' : 'Drop photo or tap to upload'}
          </div>
          <div className="mt-2 text-xs text-emerald-300/70">
            JPG / PNG / WEBP / HEIC / HEIF
          </div>
        </div>
      </button>
    </div>
  );
}
'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processImageFile } from '../utils/heicHandler';

interface ImageUploaderProps {
  onImageSelected: (imageSrc: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) {
      alert('Please upload a valid image file (JPG, PNG, HEIC).');
      return;
    }

    try {
      setLoading(true);
      // Process file (converts HEIC to JPEG if needed)
      const processedFile = await processImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageSelected(reader.result as string);
        }
        setLoading(false);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error(error);
      alert('Failed to process image.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20'
            : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.HEIC"
          className="hidden"
          onChange={handleChange}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-6 text-cyan-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Processing your image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-slate-300">
            <div className="p-3 bg-slate-800 rounded-full text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, and iPhone HEIC photos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
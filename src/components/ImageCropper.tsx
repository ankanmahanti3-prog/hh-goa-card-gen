'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, RotateCcw, Check } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageSrc: string;
  cropAspect?: number; // 1 for square (PFP Frame), ~1.91 for ID Card / OG banner
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageSrc,
  cropAspect = 1,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropChange = (crop: Point) => setCrop(crop);
  const handleZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteHandler = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white">Adjust & Position Photo</h3>
      
      {/* Cropper Box */}
      <div className="relative w-full h-72 bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={cropAspect}
          onCropChange={handleCropChange}
          onZoomChange={handleZoomChange}
          onCropComplete={onCropCompleteHandler}
        />
      </div>

      {/* Controls */}
      <div className="w-full space-y-3 pt-2">
        <div className="flex items-center space-x-3 text-slate-300">
          <ZoomIn className="w-5 h-5 text-cyan-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset / Re-upload</span>
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold hover:opacity-90 text-sm transition"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
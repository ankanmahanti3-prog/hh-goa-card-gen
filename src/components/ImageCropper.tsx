'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

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
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (location: Point) => setCrop(location);
  const onZoomChange = (newZoom: number) => setZoom(newZoom);

  const onCropCompleteHandler = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedDataUrl = canvas.toDataURL('image/jpeg');
      onCropComplete(croppedDataUrl);
    } catch (err) {
      console.error('Error cropping image:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-xl overflow-hidden border border-emerald-800">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteHandler}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-emerald-300">
          <span>Zoom</span>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-amber-400 bg-emerald-950 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 rounded-xl hover:text-white transition"
        >
          Cancel
        </button>
        <button
          onClick={createCroppedImage}
          className="flex-1 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-xl hover:bg-amber-300 transition shadow-lg"
        >
          Confirm Crop ✓
        </button>
      </div>
    </div>
  );
}
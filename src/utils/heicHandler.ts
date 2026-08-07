import heic2any from 'heic2any';

export async function processImageFile(file: File): Promise<File> {
  const fileName = file.name.toLowerCase();
  
  // Check if file is HEIC/HEIF (common on iOS)
  if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return new File([resultBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new Error('Failed to convert HEIC image.');
    }
  }

  // Standard formats (PNG, JPG, WEBP, etc.) pass right through
  return file;
}
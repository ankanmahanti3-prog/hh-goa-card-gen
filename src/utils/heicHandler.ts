export async function processImageFile(file: File): Promise<File> {
  const fileName = file.name.toLowerCase();

  // If it's a HEIC / HEIF image, dynamically load heic2any on the client side only
  if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
    try {
      // Dynamically import heic2any only in the browser environment
      const heic2any = (await import('heic2any')).default;

      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const resultBlob = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;

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
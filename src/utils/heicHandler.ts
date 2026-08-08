import { heicTo } from 'heic-to';

export async function convertHeicToJpeg(file: File): Promise<string> {
  const isHEIC =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (isHEIC) {
    try {
      const jpeg = await heicTo({
        blob: file,
        type: 'image/jpeg',
        quality: 0.8,
      });
      return URL.createObjectURL(jpeg);
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw error;
    }
  }

  return URL.createObjectURL(file);
}
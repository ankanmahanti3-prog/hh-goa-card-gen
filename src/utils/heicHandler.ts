export async function convertHeicToJpeg(file: File): Promise<string> {
  if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
    try {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8,
      });

      const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return URL.createObjectURL(singleBlob);
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw error;
    }
  }

  return URL.createObjectURL(file);
}
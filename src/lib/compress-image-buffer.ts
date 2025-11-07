import sharp from 'sharp';

/**
 * Resizes an image file to ensure both width and height are less than 1080 pixels
 * while maintaining the original aspect ratio.
 * 
 * @param file - The image file to resize
 * @returns A promise that resolves to the resized image as a File object
 */
export async function resizeImageFile(file: File): Promise<File> {
  const MAX_DIMENSION = 1080;
  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0 } = metadata;
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return file;
  }
  const resizedBuffer = await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();
  const uint8Array = new Uint8Array(resizedBuffer);
  const resizedFile = new File([uint8Array], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
  return resizedFile;
}

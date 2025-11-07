import Jimp from 'jimp';

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
  const image = await Jimp.read(buffer);
  const { width, height } = image.bitmap;
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return file;
  }
  if (width > height) {
    image.resize(MAX_DIMENSION, Jimp.AUTO);
  } else {
    image.resize(Jimp.AUTO, MAX_DIMENSION);
  }
  const mimeType = file.type || Jimp.MIME_JPEG;
  const resizedBuffer = await image.getBufferAsync(mimeType);
  const uint8Array = new Uint8Array(resizedBuffer);
  const resizedFile = new File([uint8Array], file.name, {
    type: mimeType,
    lastModified: Date.now(),
  });
  return resizedFile;
}

import * as sharp from 'sharp';

export class ImageProcessing {

  public static async scaleAndCrop(source: string, dest: string, width: number, height: number) {
    // Check if height is valid.
    if (isNaN(height) || height === null || height === undefined) {
      throw { message: "La hauteur est invalid", status: 400 };
    }

    // Check if width is valid.
    if (isNaN(width) || width === null || width === undefined) {
      throw { message: "La hauteur est invalid", status: 400 };
    }

    try {
      if (dest) {
        await sharp(source).resize(height, width).toFile(dest);
        return { data: dest, success: true };
      } else {
        const imageResult = await sharp(source).resize(height, width).toBuffer();
        return { data: imageResult.toString('base64'), success: true };
      }
    }
    catch(e) {
      throw { message: "Une erreur est survenue lors de la conversion de l'image.", status: 500 };
    }
  }

}

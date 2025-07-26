import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  url: string;
  public_id: string;
}

export const uploadImage = async (file: Express.Multer.File): Promise<UploadResult> => {
  try {
    // Convertir el buffer a una cadena base64
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64Image,
          {
            folder: 'zapateria',
            resource_type: 'auto',
          },
          (error: Error | null, result: { secure_url: string; public_id: string } | undefined) => {
            if (error) {
              console.error('Error al subir a Cloudinary:', error);
              return reject(error);
            }
            if (!result) {
              return reject(new Error('No se pudo subir la imagen'));
            }
            resolve(result);
          }
        );
      }
    );

    if (!result) {
      throw new Error('No se pudo subir la imagen');
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error en uploadImage:', error);
    throw error;
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    throw error;
  }
};

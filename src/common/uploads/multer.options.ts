import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 25 * 1024 * 1024, // ✅ 25 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp|svg\+xml)$/)) {
      return cb(
        new Error('Only image files (jpeg, png, webp, svg) are allowed!'),
        false,
      );
    }
    cb(null, true);
  },
};

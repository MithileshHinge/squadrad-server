import multer from 'multer';
import config from '../../config';

// TODO: Implement all points in OWASP file upload validation cheatsheet - https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#file-upload-validation
// TODO: Implement all points in OWASP file upload cheatsheet - https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

const uploadStorage = multer.diskStorage({
  destination: config.tmpDir,
});

export function processMultipartImage(maxFileSizeInBytes: number, maxNumFiles: number, formFieldName: string) {
  const multerInstance = multer({
    storage: uploadStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg') return cb(null, true);
      return cb(null, false);
    },
    limits: {
      fields: 10,
      fileSize: maxFileSizeInBytes,
      files: maxNumFiles,
    },
  });
  if (maxNumFiles === 1) return multerInstance.single(formFieldName);
  if (maxNumFiles > 1) return multerInstance.array(formFieldName, maxNumFiles);
  throw new Error('Multer service: Illegal maxNumFiles value <=0');
}

export function processMultipartVideo(maxFileSizeInBytes: number, maxNumFiles: number, formFieldName: string) {
  const multerInstance = multer({
    storage: uploadStorage,
    fileFilter: (req, file, cb) => {
      // Allow mp4, mov, avi and wmv formats only
      if (['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'].includes(file.mimetype)) return cb(null, true);
      return cb(null, false);
    },
    limits: {
      fields: 10,
      fileSize: maxFileSizeInBytes,
      files: maxNumFiles,
    },
  });
  if (maxNumFiles === 1) return multerInstance.single(formFieldName);
  if (maxNumFiles > 1) return multerInstance.array(formFieldName, maxNumFiles);
  throw new Error('Multer service: Illegal maxNumFiles value <=0');
}

export function processMultipartNone() {
  const multerInstance = multer({
    limits: {
      fields: 10,
      files: 0,
    },
  });
  return multerInstance.none();
}

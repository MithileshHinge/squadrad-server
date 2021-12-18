import multer from 'multer';
import config from '../../config';

const uploadStorage = multer.diskStorage({
  destination: config.tmpDir,
});

function processMultipartImage(maxFileSizeInBytes: number, maxNumFiles: number, formFieldName: string) {
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
  return new Error('Multer service: Illegal maxNumFiles value <=0');
}

export default processMultipartImage;

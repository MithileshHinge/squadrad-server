import fs from 'fs';

// TODO use normal fs functions instead of sync ones, they block the entire application
export default {
  fileExists(path: string): boolean {
    try {
      fs.accessSync(path, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  },
  fileIsJPEGImage(path: string) {
    try {
      const fd = fs.openSync(path, fs.constants.O_RDONLY);
      const fileBuffer = Buffer.alloc(3);
      fs.readSync(fd, fileBuffer, 0, 3, 0);
      return (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8 && fileBuffer[2] === 0xFF);
    } catch (err) {
      return false;
    }
  },
};

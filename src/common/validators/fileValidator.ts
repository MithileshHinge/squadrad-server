import { accessSync, constants } from 'fs';

export default {
  fileExists(path: string): boolean {
    try {
      accessSync(path, constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  },
  fileIsJPEGImage(fileBuffer: Buffer) {
    return (fileBuffer.readInt8(0) === 0xFF && fileBuffer.readInt8(1) === 0xD8 && fileBuffer.readInt8(2) === 0xFF);
  },
};

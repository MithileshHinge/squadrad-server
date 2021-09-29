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
};

import { randomBytes } from 'crypto';
import { copyFile } from 'fs-extra';
import config from '../../../config';

export default async function sampleUploadedImage() {
  const src = `${randomBytes(4).toString('hex')}.jpg`;
  await copyFile('src/__tests__/__mocks__/post/brownpaperbag-comic.jpg', `${config.tmpDir}/${src}`);
  return src;
}

/* eslint-disable no-param-reassign */
import fs from 'fs-extra';

export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

/**
 * Removes all keys with undefined values from and object
 */
export function removeUndefinedKeys(obj: { [key: string]: any }): void {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
}

/**
 * Moves a file at srcPath to destPath, all paths relative to project root, does not handle error
 */
export async function moveFile(srcPath: string, destPath: string, overwriteIfExists: boolean = true) {
  await fs.move(srcPath, destPath, { overwrite: overwriteIfExists });
}

export async function copyFile(srcPath: string, destPath: string) {
  await fs.copy(srcPath, destPath);
}

export async function deleteFile(srcPath: string) {
  await fs.unlink(srcPath);
}

export async function emptyDir(dirPath: string) {
  await fs.emptyDir(dirPath);
}

export async function forEachAsync<T>(arr: T[], cb: (val: T) => Promise<void>) {
  const promises = arr.map((val) => cb(val));
  await Promise.all(promises);
}

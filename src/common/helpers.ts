/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/prefer-default-export
export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

export function removeUndefinedKeys(obj: { [key: string]: any }): void {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
}

// eslint-disable-next-line import/prefer-default-export
export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

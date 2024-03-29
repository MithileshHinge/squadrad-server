import validator from 'validator';

export default {
  minLength(str: string, len: number): boolean {
    return validator.isLength(str, { min: len });
  },

  maxLength(str: string, len: number): boolean {
    return validator.isLength(str, { max: len });
  },

  isAlphaAndSpaces(str: string): boolean {
    return validator.isAlpha(str, undefined, { ignore: ' ' });
  },

  isEmail(str: string): boolean {
    return validator.isEmail(str);
  },

  isMobilePhone(str: string, checkCountryCode: boolean): boolean {
    return validator.isMobilePhone(str, 'en-IN', { strictMode: checkCountryCode });
  },

  isUrl(str: string): boolean {
    return validator.isURL(str);
  },
};

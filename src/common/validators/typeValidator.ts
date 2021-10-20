import ValidationError from '../errors/ValidationError';

export default function validateType(obj: any, type: any) {
  const retObj: any = {};
  Object.entries(type).forEach(([key, value]) => {
    if (obj[key] !== undefined && typeof obj[key] === value) {
      retObj[key] = obj[key];
    } else {
      throw new ValidationError('Incorrect type');
    }
  });
  return retObj;
}

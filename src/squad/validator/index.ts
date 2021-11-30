import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import stringValidator from '../../common/validators/stringValidator';
import { ISquadValidator } from './ISquadValidator';

const squadValidator: ISquadValidator = {
  validateSquadId(squadId: string): string {
    if (typeof squadId !== 'string') throw new ValidationError('Squad id must be a string');
    const squadIdTrimmed = squadId.trim();
    if (!id.isValidId(squadIdTrimmed)) throw new ValidationError(`Squad id ${squadIdTrimmed} is not a valid id`);
    return squadIdTrimmed;
  },
  validateTitle(title: string): string {
    if (typeof title !== 'string') throw new ValidationError('Squad title must be a string');
    const titleTrimmed = title.trim();
    if (!stringValidator.minLength(titleTrimmed, 3)) throw new ValidationError(`Squad title ${titleTrimmed} must have at least 3 letters`);
    if (!stringValidator.maxLength(titleTrimmed, 50)) throw new ValidationError(`Squad title ${titleTrimmed} must not be longer than 50 characters`);
    // if (titleTrimmed.includes('  ')) throw new ValidationError(`Squad title "${titleTrimmed}" cannot contain more than one consecutive spaces`);
    return titleTrimmed;
  },
  validateAmount(amount: number): number {
    if (typeof amount !== 'number') throw new ValidationError('Squad amount must be a number');
    if (amount < 30) throw new ValidationError('Squad amount must be at least Rs 30');
    const amountRounded = Math.round(amount * 100) / 100;
    return amountRounded;
  },
  validateDescription(description: string): string {
    if (typeof description !== 'string') throw new ValidationError('Squad description must be a string');
    const descriptionTrimmed = description.trim();
    if (!stringValidator.maxLength(descriptionTrimmed, 2000)) throw new ValidationError(`Squad description ${descriptionTrimmed} must not be longer than 2000 characters`);
    return descriptionTrimmed;
  },
  validateLimit(memberLimit: number): number {
    if (typeof memberLimit !== 'number') throw new ValidationError('Squad member limit must be a number');
    // memberLimit = 0 is default value, means unset
    if (memberLimit < 0 || !Number.isSafeInteger(memberLimit)) throw new ValidationError(`Squad member limit ${memberLimit} must be a positive integer`);
    return memberLimit;
  },
};

export default squadValidator;

import ValidationError from '../../common/errors/ValidationError';
import stringValidator from '../../common/validators/stringValidator';
import IGoalValidator from './IGoalValidator';

const goalValidator: IGoalValidator = {
  validateTitle(title: string): string {
    if (typeof title !== 'string') throw new ValidationError('Goal title must be a string');
    const titleTrimmed = title.trim();
    if (!stringValidator.minLength(titleTrimmed, 3)) throw new ValidationError(`Goal title ${titleTrimmed} must have at least 3 letters`);
    if (!stringValidator.maxLength(titleTrimmed, 50)) throw new ValidationError(`Goal title ${titleTrimmed} must not be longer than 50 characters`);
    // if (titleTrimmed.includes('  ')) throw new ValidationError(`Goal title "${titleTrimmed}" cannot contain more than one consecutive spaces`);
    return titleTrimmed;
  },
  validateDescription(description: string): string {
    if (typeof description !== 'string') throw new ValidationError('Goal description must be a string');
    const descriptionTrimmed = description.trim();
    if (!stringValidator.maxLength(descriptionTrimmed, 2000)) throw new ValidationError(`Goal description ${descriptionTrimmed} must not be longer than 2000 characters`);
    return descriptionTrimmed;
  },
  validateGoalNumber(goalNumber: number): number {
    if (typeof goalNumber !== 'number') throw new ValidationError('Goal number must be a number');
    const goalNumberRounded = Math.round(goalNumber);
    return goalNumberRounded;
  },
};

export default goalValidator;

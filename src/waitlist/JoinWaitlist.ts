import userValidator from '../user/validator';
import IWaitlistData from './IWaitlistData';
import IWaitlistValidator from './validator/IWaitlistValidator';

export default class JoinWaitlist {
  private waitlistData: IWaitlistData;

  private waitlistValidator: IWaitlistValidator;

  constructor(waitlistData: IWaitlistData, waitlistValidator: IWaitlistValidator) {
    this.waitlistData = waitlistData;
    this.waitlistValidator = waitlistValidator;
  }

  async join({ email, features }: {
    email: string,
    features?: Array<string>,
  }) {
    const emailValidated = userValidator.validateEmail(email);
    const featuresValidated: Array<string> = features ? this.waitlistValidator.validateFeatures(features) : [];

    await this.waitlistData.addNewUser({ email: emailValidated, features: featuresValidated });

    return null;
  }
}

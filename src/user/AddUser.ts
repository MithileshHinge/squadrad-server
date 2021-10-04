import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';
import { IId } from './id';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import SetProfilePic from '../profile-pic/SetProfilePic';
import profilePicValidator from '../profile-pic/validator';
import { IProfilePicsData } from '../profile-pic/IProfilePicsData';
import { IEmailVerification } from './email-verification/IEmailVerification';

export default class AddUser {
  private usersData: IUsersData;

  private profilePicsData: IProfilePicsData;

  private userValidator: IUserValidator;

  private id: IId;

  private passwordEncryption: IPasswordEncryption;

  private emailVerification: IEmailVerification;

  constructor(
    usersData: IUsersData,
    userValidator: IUserValidator,
    id: IId,
    passwordEncryption: IPasswordEncryption,
    profilePicsData: IProfilePicsData,
    emailVerification: IEmailVerification,
  ) {
    this.usersData = usersData;
    this.userValidator = userValidator;
    this.id = id;
    this.passwordEncryption = passwordEncryption;
    this.profilePicsData = profilePicsData;
    this.emailVerification = emailVerification;
  }

  /**
   * AddUser use case: add new user to the database
   * @throws ValidationError if invalid parameters are provided or account already exists
   * @throws DatabaseError when there is an error in inserting user into database
   */
  async add({
    fullName,
    email,
    password,
  }: {
    fullName: string,
    email: string,
    password: string
  }): Promise<{ userId: string, fullName: string, email: string, profilePicSrc: string }> {
    const emailValidated = this.userValidator.validateEmail(email);
    if (await this.usersData.fetchUserByEmail(emailValidated)) throw new ValidationError('Another account already exists with the same email ID');

    let userId = this.id.createId();
    // check if userId already exists in database
    // Note: CUID collisions are extremely improbable,
    // but my paranoia insists me to make a sanity check
    // eslint-disable-next-line no-await-in-loop
    while (await this.usersData.fetchUserById(userId)) {
      userId = this.id.createId();
    }

    const fullNameValidated = this.userValidator.validateFullName(fullName);
    const passwordValidated = this.userValidator.validatePassword(password);
    const passwordHash = this.passwordEncryption.encrypt(passwordValidated);

    const userInfo = {
      userId,
      fullName: fullNameValidated,
      email: emailValidated,
      password: passwordHash,
      verified: false,
    };
    const userAdded = await this.usersData.insertNewUser(userInfo);

    // Set a default profile picture
    const setProfilePic = new SetProfilePic(this.profilePicsData, profilePicValidator);
    const profilePicSrc = await setProfilePic.setDefault(userId);

    await this.emailVerification.sendVerificationMail(email);

    return {
      userId: userAdded.userId,
      fullName: userAdded.fullName,
      email: userAdded.email,
      profilePicSrc,
    };
  }
}

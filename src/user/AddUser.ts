import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import SetProfilePic from '../profile-pic/SetProfilePic';
import profilePicValidator from '../profile-pic/validator';
import { IProfilePicsData } from '../profile-pic/IProfilePicsData';
import { IEmailVerification } from './email-verification/IEmailVerification';
import { createUserId } from '../userId';

export default class AddUser {
  private usersData: IUsersData;

  private profilePicsData: IProfilePicsData;

  private userValidator: IUserValidator;

  private passwordEncryption: IPasswordEncryption;

  private emailVerification: IEmailVerification;

  constructor(
    usersData: IUsersData,
    userValidator: IUserValidator,
    passwordEncryption: IPasswordEncryption,
    profilePicsData: IProfilePicsData,
    emailVerification: IEmailVerification,
  ) {
    this.usersData = usersData;
    this.userValidator = userValidator;
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

    const userId = await createUserId.create(this.usersData);

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

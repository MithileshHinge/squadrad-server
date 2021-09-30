import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';
import { IId } from './id';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import SetProfilePic from '../profile-pic/SetProfilePic';
import profilePicValidator from '../profile-pic/validator';
import { IProfilePicsData } from '../profile-pic/IProfilePicsData';

export default class AddUser {
  private usersData: IUsersData;

  private profilePicsData: IProfilePicsData;

  private userValidator: IUserValidator;

  private id: IId;

  private passwordEncryption: IPasswordEncryption;

  constructor(
    usersData: IUsersData,
    userValidator: IUserValidator,
    id: IId,
    passwordEncryption: IPasswordEncryption,
    profilePicsData: IProfilePicsData,
  ) {
    this.usersData = usersData;
    this.userValidator = userValidator;
    this.id = id;
    this.passwordEncryption = passwordEncryption;
    this.profilePicsData = profilePicsData;
  }

  /**
   * AddUser use case: add new user to the database
   * @throws ValidationError if invalid parameters are provided or account already exists
   * @throws DatabaseError when there is an error in inserting user into database
   */
  add({
    fullName,
    email,
    password,
  }: {
    fullName: string,
    email: string,
    password: string
  }): { userId: string, fullName: string, email: string, profilePicSrc: string } {
    const emailValidated = this.userValidator.validateEmail(email);
    if (this.usersData.fetchUserByEmail(emailValidated)) throw new ValidationError('Another account already exists with the same email ID');

    let userId = this.id.createId();
    // check if userId already exists in database
    // Note: CUID collisions are extremely improbable,
    // but my paranoia insists me to make a sanity check
    while (this.usersData.fetchUserById(userId)) {
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
    };
    this.usersData.insertNewUser(userInfo);

    // Set a default profile picture
    const setProfilePic = new SetProfilePic(this.profilePicsData, profilePicValidator);
    const profilePicSrc = setProfilePic.setDefault(userId);

    return {
      userId: userInfo.userId,
      fullName: userInfo.fullName,
      email: userInfo.email,
      profilePicSrc,
    };
  }
}

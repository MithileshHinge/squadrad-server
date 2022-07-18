import { usersData } from '../database';
import { getProfilePic, setProfilePic } from '../profile-pic';
import AddUser from './AddUser';
import ChangePassword from './ChangePassword';
import EditUser from './EditUser';
import emailVerification from './email-verification';
import FindUser from './FindUser';
import LoginUser from './LoginUser';
import passwordEncryption from './password';
import userValidator from './validator';
import VerifyEmail from './VerifyEmail';

export const addUser = new AddUser(
  setProfilePic,
  usersData,
  userValidator,
  passwordEncryption,
  emailVerification,
);

export const findUser = new FindUser(
  getProfilePic,
  usersData,
  userValidator,
);

export const editUser = new EditUser(
  usersData,
  userValidator,
);

export const changePassword = new ChangePassword(
  usersData,
  userValidator,
  passwordEncryption,
);

export const verifyEmail = new VerifyEmail(
  usersData,
  userValidator,
  emailVerification,
);

export const loginUser = new LoginUser(
  getProfilePic,
  verifyEmail,
  usersData,
  passwordEncryption,
);

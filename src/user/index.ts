import { profilePicsData, usersData } from '../database';
import mockEmailVerification from '../__tests__/__mocks__/mail/mockEmailVerification';
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
  usersData,
  userValidator,
  passwordEncryption,
  profilePicsData,
  (process.env.NODE_ENV === 'test') ? mockEmailVerification : emailVerification,
);

export const findUser = new FindUser(
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
  usersData,
  passwordEncryption,
);

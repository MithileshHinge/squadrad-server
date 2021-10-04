import { profilePicsData, usersData } from '../database';
import AddUser from './AddUser';
import ChangePassword from './ChangePassword';
import EditUser from './EditUser';
import emailVerification from './email-verification';
import FindUser from './FindUser';
import id from './id';
import passwordEncryption from './password';
import userValidator from './validator';

export const addUser = new AddUser(
  usersData,
  userValidator,
  id,
  passwordEncryption,
  profilePicsData,
  emailVerification,
);

export const findUser = new FindUser(
  usersData,
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

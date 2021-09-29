import faker from '../__mocks__/faker';
import sampleUserParams from '../__mocks__/user/userParams';
import sampleUsers from '../__mocks__/user/users';
import mockUserData from '../__mocks__/user/mockUserData';
import ValidationError from '../../common/errors/ValidationError';
import id from '../../user/id';
import AddUser from '../../user/AddUser';
import FindUser from '../../user/FindUser';
import EditUser from '../../user/EditUser';
import ChangePassword from '../../user/ChangePassword';

describe('User usecases', () => {
  beforeEach(() => {
    Object.values(mockUserData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });
  describe('Add a new user', () => {
    const addUser = new AddUser(mockUserData);

    it('Can add a valid new user', () => {
      const user = addUser.add(sampleUserParams);
      expect(mockUserData.insertIntoDb).toHaveBeenCalledWith(expect.objectContaining({
        ...user,
      }));
    });

    it('Should throw error if invalid parameters are provided', () => {
      expect(() => addUser.add({
        fullName: 'nsda  asdad sd',
        email: 'efewndfa',
        password: '1234',
      })).toThrow(ValidationError);
      expect(mockUserData.insertIntoDb).not.toHaveBeenCalled();
    });

    it('Email IDs must be unique', () => {
      const userParams1 = {
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
      };
      const userParams2 = {
        fullName: faker.name.findName(),
        email: userParams1.email,
        password: faker.internet.password(8),
      };
      const addedUser = addUser.add(userParams1);
      mockUserData.fetchUserByEmail.mockReturnValueOnce(addedUser);
      expect(() => addUser.add(userParams2)).toThrowError(ValidationError);
      expect(mockUserData.insertIntoDb).toHaveBeenCalledTimes(1);
    });
  });

  describe('Get users', () => {
    const findUser = new FindUser(mockUserData);

    it('Can get all users', () => {
      const users = findUser.findAllUsers();
      expect(mockUserData.fetchAllUsers).toHaveBeenCalled();
      expect(users.length).toStrictEqual(sampleUsers.length);
    });

    it('Can get user by userId', () => {
      // get any user
      const user = sampleUsers[0];
      expect(findUser.findUserById(user.userId)).toStrictEqual(expect.objectContaining({
        userId: user.userId,
      }));
    });

    it('Should return null if userId not found', () => {
      const userId = id.createId();
      expect(findUser.findUserById(userId)).toBeNull();
    });

    it('Can get user by emailId', () => {
      // get any user
      const user = sampleUsers[0];
      expect(findUser.findUserByEmail(user.email)).toStrictEqual(expect.objectContaining({
        userId: user.userId,
      }));
    });

    it('Should return null if email not found', () => {
      expect(findUser.findUserByEmail('wqernjskdfnvsf@gmail.com')).toBeNull();
    });
  });

  describe('Update user', () => {
    // const nonEditableFieldsFakeData = {
    //   userId: id.createId(),
    //   email: faker.internet.email(),
    //   password: faker.datatype.uuid(),
    // };
    const editUser = new EditUser(mockUserData);

    it('Can change fullName', () => {
      // get any user
      const user = sampleUsers[0];
      const newName = faker.name.findName();
      editUser.edit({ userId: user.userId, fullName: newName });
      expect(mockUserData.updateUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: user.userId,
      }));
    });

    it('Should throw error if fullName is invalid', () => {
      const user = sampleUsers[0];
      const newName = 'Mit qwe123';
      expect(() => editUser.edit({
        userId: user.userId,
        fullName: newName,
      })).toThrow(ValidationError);
      expect(mockUserData.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('Change password', () => {
    const changePassword = new ChangePassword(mockUserData);

    it('Can change password', () => {
      const user = sampleUsers[0];
      const newPassword = faker.internet.password(8);
      changePassword.change(user.userId, newPassword);
      expect(mockUserData.updatePassword).toHaveBeenCalledWith(
        user.userId, expect.not.stringMatching(user.password),
      );
    });
  });
});

import faker from '../__mocks__/faker';
import sampleUserParams from '../__mocks__/user/userParams';
import sampleUsers from '../__mocks__/user/users';
import mockUserRepo from '../__mocks__/repositories/mockUserRepo';
import ValidationError from '../../api/common/errors/ValidationError';
import id from '../../services/id';
import AddUser from '../../api/user/AddUser';
import FindUser from '../../api/user/FindUser';
import EditUser from '../../api/user/EditUser';
import ChangePassword from '../../api/user/ChangePassword';

describe('User usecases', () => {
  beforeEach(() => {
    Object.values(mockUserRepo).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });
  describe('Add a new user', () => {
    const addUser = new AddUser(mockUserRepo);

    it('Can add a valid new user', () => {
      const user = addUser.add(sampleUserParams);
      expect(mockUserRepo.insertIntoDb).toHaveBeenCalledWith(expect.objectContaining({
        ...user,
      }));
    });

    it('Should throw error if invalid parameters are provided', () => {
      expect(() => addUser.add({
        fullName: 'nsda  asdad sd',
        email: 'efewndfa',
        password: '1234',
      })).toThrow(ValidationError);
      expect(mockUserRepo.insertIntoDb).not.toHaveBeenCalled();
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
      mockUserRepo.fetchUserByEmail.mockReturnValueOnce(addedUser);
      expect(() => addUser.add(userParams2)).toThrowError(ValidationError);
      expect(mockUserRepo.insertIntoDb).toHaveBeenCalledTimes(1);
    });
  });

  describe('Get users', () => {
    const findUser = new FindUser(mockUserRepo);

    it('Can get all users', () => {
      const users = findUser.findAllUsers();
      expect(mockUserRepo.fetchAllUsers).toHaveBeenCalled();
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
    const editUser = new EditUser(mockUserRepo);

    it('Can change fullName', () => {
      // get any user
      const user = sampleUsers[0];
      const newName = faker.name.findName();
      editUser.edit({ userId: user.userId, fullName: newName });
      expect(mockUserRepo.updateUser).toHaveBeenCalledWith(expect.objectContaining({
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
      expect(mockUserRepo.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('Change password', () => {
    const changePassword = new ChangePassword(mockUserRepo);

    it('Can change password', () => {
      const user = sampleUsers[0];
      const newPassword = faker.internet.password(8);
      changePassword.change(user.userId, newPassword);
      expect(mockUserRepo.updatePassword).toHaveBeenCalledWith(
        user.userId, expect.not.stringMatching(user.password),
      );
    });
  });
});

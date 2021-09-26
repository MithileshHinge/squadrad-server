import faker from '../common/faker';
import ValidationError from '../common/errors/ValidationError';
import id from '../services/id';
import AddUser from './AddUser';
import { IUserRepo } from './IUserRepo';
import FindUser from './FindUser';
import EditUser from './EditUser';
import IUserDTO from './IUserDTO';

const validUserParams = {
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
};

const validUsers: {
  userId: string,
  fullName: string,
  email: string,
  password: string,
}[] = Array(10).fill((() => ({
  userId: id.createId(),
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
}))());

describe('User usecases', () => {
  class MockUserRepo implements IUserRepo {
    userDb:{
      userId: string,
      fullName: string,
      email: string,
      password: string,
    }[];

    constructor(userDb:{
      userId: string,
      fullName: string,
      email: string,
      password: string,
    }[] = []) {
      this.userDb = userDb;
    }

    insertIntoDb({
      userInfo,
      password,
    }: { userInfo: IUserDTO, password: string }) {
      const user = { ...userInfo, password: password! };
      this.userDb.push(user);
    }

    fetchAllUsers() {
      return [...this.userDb];
    }

    fetchUserById(userId: string) {
      const user = this.userDb.find((u) => u.userId === userId);
      if (!user) return null;
      return {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      };
    }

    fetchUserByEmail(email: string) {
      const user = this.userDb.find((u) => u.email === email);
      if (!user) return null;
      return {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      };
    }

    updateUser(userInfo: IUserDTO) {
      const i = this.userDb.findIndex((u) => u.userId === userInfo.userId);
      const userExisting = this.userDb[i];
      this.userDb[i] = { ...userExisting, ...userInfo };
    }
  }

  const mockUserRepo = new MockUserRepo(validUsers);

  describe('Add a new user', () => {
    it('Can add a valid new user', () => {
      const addUser = new AddUser(mockUserRepo);
      addUser.add(validUserParams);
      expect(mockUserRepo.userDb).toContainEqual(expect.objectContaining({
        fullName: validUserParams.fullName,
        email: validUserParams.email,
      }));
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
      const addUser = new AddUser(mockUserRepo);
      addUser.add(userParams1);
      expect(() => addUser.add(userParams2)).toThrowError(ValidationError);
    });
  });

  describe('Get users', () => {
    const findUser = new FindUser(mockUserRepo);

    it('Can get all users', () => {
      expect(findUser.findAllUsers()).toStrictEqual(mockUserRepo.fetchAllUsers());
    });

    it('Can get user by userId', () => {
      // get any user
      const user = validUsers[0];
      expect(findUser.findUserById(user.userId)).toStrictEqual(expect.objectContaining({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      }));
    });

    it('Can get user by emailId', () => {
      // get any user
      const user = validUsers[0];
      expect(findUser.findUserByEmail(user.email)).toStrictEqual(expect.objectContaining({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      }));
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
      const user = validUsers[0];
      console.log(validUsers);
      const newName = faker.name.findName();
      editUser.edit({ userId: user.userId, fullName: newName });
      expect(mockUserRepo.userDb).toContainEqual(expect.objectContaining({
        userId: user.userId,
        fullName: newName,
      }));
    });
  });
});

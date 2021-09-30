import faker from '../__mocks__/faker';
import sampleUserParams from '../__mocks__/user/userParams';
import sampleUsers from '../__mocks__/user/users';
import mockUsersData from '../__mocks__/user/mockUsersData';
import ValidationError from '../../common/errors/ValidationError';
import id from '../../user/id';
import AddUser from '../../user/AddUser';
import FindUser from '../../user/FindUser';
import EditUser from '../../user/EditUser';
import ChangePassword from '../../user/ChangePassword';
import userValidator from '../../user/validator';
import passwordEncryption from '../../user/password';
import mockProfilePicsData from '../__mocks__/profile-pic/mockProfilePicsData';

describe('User usecases', () => {
  beforeEach(() => {
    Object.values(mockUsersData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });
  describe('Add a new user', () => {
    const addUser = new AddUser(
      mockUsersData,
      userValidator,
      id,
      passwordEncryption,
      mockProfilePicsData,
    );

    it('Can add a valid new user', () => {
      const user = addUser.add(sampleUserParams);
      expect(mockUsersData.insertNewUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      }));

      // Default profile pic should be added
      expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
        user.userId,
        user.profilePicSrc,
      );
    });

    describe('User Id validation', () => {
      it('User must have a userId', () => {
        expect(addUser.add(sampleUserParams).userId).toBeTruthy();
      });

      it('userId must be unique', () => {
        const userIdSet = new Set();
        for (let i = 0; i < 5; i += 1) {
          userIdSet.add(addUser.add(sampleUserParams).userId);
        }
        expect(userIdSet.size).toBe(5);
      });
    });

    describe('Full name validation', () => {
      describe('Full name must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, () => {
            expect(() => addUser.add({
              ...sampleUserParams,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only contain alphabet and spaces', () => {
        ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
          it(`should throw error for "asd${char}"`, () => {
            expect(() => addUser.add({ ...sampleUserParams, fullName: `asdfg${char}` })).toThrow(ValidationError);
            expect(() => addUser.add({ ...sampleUserParams, fullName: `asd ${char}` })).toThrow(ValidationError);
            expect(() => addUser.add({ ...sampleUserParams, fullName: `as${char}` })).toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only single spaces between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, () => {
            expect(() => addUser.add({
              ...sampleUserParams,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((fullName) => {
          it(`should throw error for ${fullName}`, () => {
            expect(() => addUser.add({
              ...sampleUserParams,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Email Id validation', () => {
      describe('User must have a valid email address', () => {
        ['', ' ', 'mithihi', 'mihbhg@', 'mibg hv nv@gmail.com', '@gmail.com', 'vghjhb@gmail'].forEach((email) => {
          it(`Should throw error for "${email}"`, () => {
            expect(() => addUser.add({ ...sampleUserParams, email })).toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
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
        mockUsersData.fetchUserByEmail.mockReturnValueOnce(addedUser);
        expect(() => addUser.add(userParams2)).toThrowError(ValidationError);
        expect(mockUsersData.insertNewUser).toHaveBeenCalledTimes(1);
      });
    });

    describe('Password should be >= 8 characters', () => {
      ['', ' ', 'asa', 'as afsf', 'asf  '].forEach((password) => {
        it(`Should throw error for ${password}`, () => {
          expect(() => addUser.add({ ...sampleUserParams, password })).toThrow(ValidationError);
          expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
        });
      });
    });

    it('Should throw error if invalid parameters are provided', () => {
      expect(() => addUser.add({
        fullName: 'nsda  asdad sd',
        email: 'efewndfa',
        password: '1234',
      })).toThrow(ValidationError);
      expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
    });
  });

  describe('Get users', () => {
    const findUser = new FindUser(mockUsersData);

    it('Can get all users', () => {
      const users = findUser.findAllUsers();
      expect(mockUsersData.fetchAllUsers).toHaveBeenCalled();
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
    const editUser = new EditUser(mockUsersData, userValidator);

    it('Can change fullName', () => {
      // get any user
      const user = sampleUsers[0];
      const newName = faker.name.findName();
      editUser.edit({ userId: user.userId, fullName: newName });
      expect(mockUsersData.updateUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: user.userId,
      }));
    });

    describe('Full name validation', () => {
      describe('Full name must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, () => {
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only contain alphabet and spaces', () => {
        ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
          it(`should throw error for "asd${char}"`, () => {
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `asdfg${char}`,
            })).toThrow(ValidationError);
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `asd ${char}`,
            })).toThrow(ValidationError);
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `as${char}`,
            })).toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only single spaces between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, () => {
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((fullName) => {
          it(`should throw error for ${fullName}`, () => {
            expect(() => editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Change password', () => {
    const changePassword = new ChangePassword(mockUsersData, userValidator, passwordEncryption);

    it('Can change password', () => {
      const user = sampleUsers[0];
      const newPassword = faker.internet.password(8);
      changePassword.change(user.userId, newPassword);
      expect(mockUsersData.updatePassword).toHaveBeenCalledWith(
        user.userId, expect.not.stringMatching(user.password),
      );
    });

    describe('Password should be >= 8 characters', () => {
      ['', ' ', 'asa', 'as afsf', 'asf  '].forEach((password) => {
        it(`Should throw error for ${password}`, () => {
          expect(() => changePassword.change(
            sampleUsers[0].userId,
            password,
          )).toThrow(ValidationError);
          expect(mockUsersData.updatePassword).not.toHaveBeenCalled();
        });
      });
    });
  });
});

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
import mockEmailVerification from '../__mocks__/mail/mockEmailVerification';
import VerifyEmail from '../../user/VerifyEmail';
import { issueJWT } from '../../common/jwt';
import emailVerification from '../../user/email-verification';
import JWTError from '../../common/errors/JWTError';

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
      mockEmailVerification,
    );

    it('Can add a valid new user', async () => {
      const user = await addUser.add(sampleUserParams);
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

      // Verification mail sender should be called
      expect(mockEmailVerification.sendVerificationMail).toHaveBeenCalled();
    });

    describe('User Id validation', () => {
      it('User must have a userId', async () => {
        expect((await addUser.add(sampleUserParams)).userId).toBeTruthy();
      });

      it('userId must be unique', async () => {
        const userIdSet = new Set();
        for (let i = 0; i < 5; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          userIdSet.add((await addUser.add(sampleUserParams)).userId);
        }
        expect(userIdSet.size).toBe(5);
      });
    });

    describe('Full name validation', () => {
      describe('Full name must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, async () => {
            await expect(addUser.add({
              ...sampleUserParams,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only contain alphabet and spaces', () => {
        ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
          it(`should throw error for "asd${char}"`, async () => {
            await expect(addUser.add({ ...sampleUserParams, fullName: `asdfg${char}` })).rejects.toThrow(ValidationError);
            await expect(addUser.add({ ...sampleUserParams, fullName: `asd ${char}` })).rejects.toThrow(ValidationError);
            await expect(addUser.add({ ...sampleUserParams, fullName: `as${char}` })).rejects.toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only single spaces between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, async () => {
            await expect(addUser.add({
              ...sampleUserParams,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((fullName) => {
          it(`should throw error for ${fullName}`, async () => {
            await expect(addUser.add({
              ...sampleUserParams,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Email Id validation', () => {
      describe('User must have a valid email address', () => {
        ['', ' ', 'mithihi', 'mihbhg@', 'mibg hv nv@gmail.com', '@gmail.com', 'vghjhb@gmail'].forEach((email) => {
          it(`Should throw error for "${email}"`, async () => {
            await expect(addUser.add({
              ...sampleUserParams,
              email,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
          });
        });
      });

      it('Email IDs must be unique', async () => {
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
        await expect(addUser.add(userParams2)).rejects.toThrowError(ValidationError);
        expect(mockUsersData.insertNewUser).toHaveBeenCalledTimes(1);
      });
    });

    describe('Password should be >= 8 characters', () => {
      ['', ' ', 'asa', 'as afsf', 'asf  '].forEach((password) => {
        it(`Should throw error for ${password}`, async () => {
          await expect(addUser.add({
            ...sampleUserParams,
            password,
          })).rejects.toThrow(ValidationError);
          expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
        });
      });
    });

    it('Should throw error if invalid parameters are provided', async () => {
      await expect(addUser.add({
        fullName: 'nsda  asdad sd',
        email: 'efewndfa',
        password: '1234',
      })).rejects.toThrow(ValidationError);
      expect(mockUsersData.insertNewUser).not.toHaveBeenCalled();
    });
  });

  describe('Get users', () => {
    const findUser = new FindUser(mockUsersData);

    /*
    it('Can get all users', async () => {
      const users = await findUser.findAllUsers();
      expect(mockUsersData.fetchAllUsers).toHaveBeenCalled();
      expect(users.length).toStrictEqual(sampleUsers.length);
    });
    */

    it('Can get user by userId', async () => {
      // get any user
      const user = sampleUsers[0];
      await expect(findUser.findUserById(user.userId))
        .resolves.toStrictEqual(expect.objectContaining({
          userId: user.userId,
        }));
    });

    it('Should return null if userId not found', async () => {
      const userId = id.createId();
      await expect(findUser.findUserById(userId)).resolves.toBeNull();
    });

    it('Can get user by emailId', async () => {
      // get any user
      const user = sampleUsers[0];
      await expect(findUser.findUserByEmail(user.email))
        .resolves.toStrictEqual(expect.objectContaining({
          userId: user.userId,
        }));
    });

    it('Should return null if email not found', async () => {
      await expect(findUser.findUserByEmail('wqernjskdfnvsf@gmail.com')).resolves.toBeNull();
    });
  });

  describe('Update user', () => {
    const editUser = new EditUser(mockUsersData, userValidator);

    it('Can change fullName', async () => {
      // get any user
      const user = sampleUsers[0];
      const newName = faker.name.findName();
      await editUser.edit({ userId: user.userId, fullName: newName });
      expect(mockUsersData.updateUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: user.userId,
      }));
    });

    describe('Full name validation', () => {
      describe('Full name must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, async () => {
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only contain alphabet and spaces', () => {
        ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
          it(`should throw error for "asd${char}"`, async () => {
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `asdfg${char}`,
            })).rejects.toThrow(ValidationError);
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `asd ${char}`,
            })).rejects.toThrow(ValidationError);
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName: `as${char}`,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must only single spaces between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((fullName) => {
          it(`should throw error for "${fullName}"`, async () => {
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });

      describe('Full name must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((fullName) => {
          it(`should throw error for ${fullName}`, async () => {
            await expect(editUser.edit({
              userId: sampleUsers[0].userId,
              fullName,
            })).rejects.toThrow(ValidationError);
            expect(mockUsersData.updateUser).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Change password', () => {
    const changePassword = new ChangePassword(mockUsersData, userValidator, passwordEncryption);

    it('Can change password', async () => {
      const user = sampleUsers[0];
      const newPassword = faker.internet.password(8);
      await changePassword.change(user.userId, newPassword);
      expect(mockUsersData.updatePassword).toHaveBeenCalledWith(
        user.userId, expect.not.stringMatching(user.password),
      );
    });

    describe('Password should be >= 8 characters', () => {
      ['', ' ', 'asa', 'as afsf', 'asf  '].forEach((password) => {
        it(`Should throw error for ${password}`, async () => {
          await expect(changePassword.change(
            sampleUsers[0].userId,
            password,
          )).rejects.toThrow(ValidationError);
          expect(mockUsersData.updatePassword).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Verify email', () => {
    const verifyEmail = new VerifyEmail(mockUsersData, emailVerification);

    it('Set account verified to true if token is valid', async () => {
      const { userId, email } = sampleUsers[0];
      const jwt = issueJWT({ email }, 100);
      await expect(verifyEmail.verify(jwt)).resolves.not.toThrowError();
      expect(mockUsersData.updateUser).toHaveBeenCalledWith({ userId, verified: true });
    });

    it('Should not set account verified if token is expired', async () => {
      const { email } = sampleUsers[0];
      const jwt = issueJWT({ email }, 2);
      await new Promise((resolve) => {
        setTimeout(async () => {
          await expect(verifyEmail.verify(jwt)).rejects.toThrow(JWTError);
          resolve(null);
        }, 3000);
      });
      expect(mockUsersData.updateUser).not.toHaveBeenCalled();
    });

    it('Should throw error if email id does not exist', async () => {
      const email = faker.internet.email();
      const jwt = issueJWT({ email }, 100);
      await expect(verifyEmail.verify(jwt)).rejects.toThrow(ValidationError);
      expect(mockUsersData.updateUser).not.toHaveBeenCalled();
    });
  });
});

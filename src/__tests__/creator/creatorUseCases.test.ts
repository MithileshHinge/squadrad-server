import ValidationError from '../../common/errors/ValidationError';
import BecomeCreator from '../../creator/BecomeCreator';
import EditCreator from '../../creator/EditCreator';
import creatorValidator from '../../creator/validator';
import id from '../../common/id';
import sampleCreatorParams from '../__mocks__/creator/creatorParams';
import newCreator from '../__mocks__/creator/creators';
import mockCreatorsData from '../__mocks__/creator/mockCreatorsData';
import mockUsersData from '../__mocks__/user/mockUsersData';
import { newUser } from '../__mocks__/user/users';

describe('Creator Use Cases', () => {
  beforeEach(() => {
    Object.values(mockUsersData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
    Object.values(mockCreatorsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('BecomeCreator use case', () => {
    const becomeCreator = new BecomeCreator(mockUsersData, mockCreatorsData, creatorValidator);
    const existingVerifiedUser = newUser();
    existingVerifiedUser.verified = true;
    mockUsersData.fetchUserById.mockResolvedValue(existingVerifiedUser);

    it('Can become a creator', async () => {
      await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams })).resolves.not.toThrow();
      expect(mockCreatorsData.insertNewCreator).toHaveBeenCalledWith(expect.objectContaining({ userId: existingVerifiedUser.userId }));
    });

    describe('User validation', () => {
      it('Should throw error if userId does not exist in usersData', async () => {
        mockUsersData.fetchUserById.mockResolvedValueOnce(null);
        await expect(becomeCreator.becomeCreator({ userId: id.createId(), ...sampleCreatorParams })).rejects.toThrow(ValidationError);
        expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
      });

      it('Should throw error if user is already a creator', async () => {
        mockCreatorsData.fetchCreatorById.mockResolvedValueOnce({ userId: existingVerifiedUser.userId });
        await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams })).rejects.toThrow(ValidationError);
        expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
      });

      it('Should throw error if user is not verified', async () => {
        const user = newUser();
        user.verified = false;
        mockUsersData.fetchUserById.mockResolvedValueOnce(user);
        await expect(becomeCreator.becomeCreator({ userId: user.userId, ...sampleCreatorParams })).rejects.toThrow(ValidationError);
        expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
      });

      it('Should throw error if userId is not a string', async () => {
        const userId: any = 523523523;
        await expect(becomeCreator.becomeCreator({ userId, ...sampleCreatorParams })).rejects.toThrow(ValidationError);
        expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
      });
    });

    describe('Page name validation', () => {
      describe('Page name must be a string', () => {
        [true, false, 345415334, { pageName: 'fvsdf' }].forEach((pageName: any) => {
          it(`should throw error for "${pageName}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, pageName })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Page name must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((pageName) => {
          it(`should throw error for "${pageName}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, pageName })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Page name must contain only single space between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((pageName) => {
          it(`should throw error for "${pageName}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, pageName })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Page name must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((pageName) => {
          it(`should throw error for ${pageName}`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, pageName })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Bio validation', () => {
      describe('Bio must be a string', () => {
        [true, false, 345415334, { bio: 'fvsdf' }].forEach((bio: any) => {
          it(`should throw error for "${bio}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Bio must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((bio) => {
          it(`should throw error for "${bio}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Bio must only contain alphabet and spaces', () => {
        ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
          it(`should throw error for "asd${char}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio: `asdfg${char}` })).rejects.toThrow(ValidationError);
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio: `asd ${char}` })).rejects.toThrow(ValidationError);
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio: `as${char}` })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Bio must contain only single space between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((bio) => {
          it(`should throw error for "${bio}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });

      describe('Bio must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((bio) => {
          it(`should throw error for ${bio}`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, bio })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('isPlural validation', () => {
      describe('isPlural must be boolean', () => {
        ['true', 1, 'dfbsdfbsf', { isPlural: true }].forEach((isPlural: any) => {
          it(`should throw error for "${isPlural}"`, async () => {
            await expect(becomeCreator.becomeCreator({ userId: existingVerifiedUser.userId, ...sampleCreatorParams, isPlural })).rejects.toThrow(ValidationError);
            expect(mockCreatorsData.insertNewCreator).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('EditCreator use case', () => {
    const editCreator = new EditCreator(mockCreatorsData, creatorValidator);

    it('Can change page name', async () => {
      const { userId, pageName } = newCreator();
      await expect(editCreator.edit({ userId, pageName })).resolves.not.toThrow();
      expect(mockCreatorsData.updateCreator).toHaveBeenCalledWith(expect.objectContaining({ userId }));
    });

    it('Should throw error if page name is invalid', async () => {
      const userId = id.createId();
      await expect(editCreator.edit({ userId, pageName: 'as' })).rejects.toThrow(ValidationError);
      await expect(editCreator.edit({ userId, pageName: 'as  aasvda' })).rejects.toThrow(ValidationError);
      const pageName: any = 34141214;
      await expect(editCreator.edit({ userId, pageName })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });

    it('Can change bio', async () => {
      const { userId, bio } = newCreator();
      await expect(editCreator.edit({ userId, bio })).resolves.not.toThrow();
      expect(mockCreatorsData.updateCreator).toHaveBeenCalledWith(expect.objectContaining({ userId }));
    });

    it('Should throw error if bio is invalid', async () => {
      const userId = id.createId();
      await expect(editCreator.edit({ userId, bio: 'asn23d2' })).rejects.toThrow(ValidationError);
      await expect(editCreator.edit({ userId, bio: 'as &( ][' })).rejects.toThrow(ValidationError);
      const bio: any = 345542345;
      await expect(editCreator.edit({ userId, bio })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });

    it('Can change isPlural', async () => {
      const userId = id.createId();
      await expect(editCreator.edit({ userId, isPlural: false })).resolves.not.toThrow();
      expect(mockCreatorsData.updateCreator).toHaveBeenCalledWith(expect.objectContaining({ userId }));
    });

    it('Should throw error if isPlural is invalid', async () => {
      const userId = id.createId();
      let isPlural: any = 1;
      await expect(editCreator.edit({ userId, isPlural })).rejects.toThrow(ValidationError);
      isPlural = 'true';
      await expect(editCreator.edit({ userId, isPlural })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });
  });
});

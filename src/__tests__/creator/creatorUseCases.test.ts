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
import SetProfilePic from '../../profile-pic/SetProfilePic';
import mockProfilePicsData from '../__mocks__/profile-pic/mockProfilePicsData';
import profilePicValidator from '../../profile-pic/validator';
import FindCreator from '../../creator/FindCreator';

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
    const setProfilePic = new SetProfilePic(mockProfilePicsData, profilePicValidator);
    const becomeCreator = new BecomeCreator(mockUsersData, mockCreatorsData, creatorValidator, setProfilePic);
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
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        pageName: expect.any(String),
      });
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
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        bio: expect.any(String),
      });
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
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        isPlural: expect.any(Boolean),
      });
    });

    it('Should throw error if isPlural is invalid', async () => {
      const userId = id.createId();
      let isPlural: any = 1;
      await expect(editCreator.edit({ userId, isPlural })).rejects.toThrow(ValidationError);
      isPlural = 'true';
      await expect(editCreator.edit({ userId, isPlural })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });

    it('Can change showTotalSquadMembers', async () => {
      const userId = id.createId();
      await expect(editCreator.edit({ userId, showTotalSquadMembers: true })).resolves.not.toThrow();
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        showTotalSquadMembers: expect.any(Boolean),
      });
    });

    it('Should throw error if showTotalSquadMembers is invalid', async () => {
      const userId = id.createId();
      let showTotalSquadMembers: any = 1;
      await expect(editCreator.edit({ userId, showTotalSquadMembers })).rejects.toThrow(ValidationError);
      showTotalSquadMembers = 'true';
      await expect(editCreator.edit({ userId, showTotalSquadMembers })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });

    it('Can change about', async () => {
      const { userId, about } = newCreator();
      await expect(editCreator.edit({ userId, about })).resolves.not.toThrow();
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        about: expect.any(String),
      });
    });

    it('Should throw error if about is invalid', async () => {
      const userId = id.createId();
      const about: any = 345542345;
      await expect(editCreator.edit({ userId, about })).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();
    });

    it('Should ignore undefined fields', async () => {
      const { userId, pageName } = newCreator();
      const creatorToUpdate = {
        userId,
        pageName: undefined,
        bio: undefined,
        isPlural: undefined,
        showTotalSquadMembers: undefined,
        about: undefined,
      };

      await expect(editCreator.edit(creatorToUpdate)).rejects.toThrow(ValidationError);
      expect(mockCreatorsData.updateCreator).not.toHaveBeenCalled();

      await expect(editCreator.edit({ ...creatorToUpdate, pageName })).resolves.not.toThrowError();
      expect(mockCreatorsData.updateCreator.mock.calls[0][0]).toStrictEqual({
        userId,
        pageName: expect.any(String),
      });
    });
  });

  describe('FindCreator use case', () => {
    const findCreator = new FindCreator(mockCreatorsData);

    it('Can get self creator page info', async () => {
      const creator = newCreator();
      mockCreatorsData.fetchCreatorById.mockResolvedValueOnce(creator);
      await expect(findCreator.findCreatorPage(creator.userId, true)).resolves.toStrictEqual(expect.objectContaining({ userId: creator.userId }));
    });

    it('Can get another creator page info', async () => {
      const creator = newCreator();
      mockCreatorsData.fetchCreatorById.mockResolvedValueOnce(creator);
      const pageInfo = await findCreator.findCreatorPage(creator.userId, false);
      expect(pageInfo).toStrictEqual(expect.objectContaining({ userId: creator.userId }));
      expect(pageInfo).not.toHaveProperty('showTotalSquadMembers');
    });

    it('Return null if user with userId is not a creator', async () => {
      const userId = id.createId();
      await expect(findCreator.findCreatorPage(userId, true)).resolves.toBeNull();
      await expect(findCreator.findCreatorPage(userId, false)).resolves.toBeNull();
    });

    it('Throw error if userId is not a valid id', async () => {
      const userId: any = 4235450934;
      await expect(findCreator.findCreatorPage(userId, true)).rejects.toThrow(ValidationError);
      await expect(findCreator.findCreatorPage('na4ofiq3n4rq34', false)).rejects.toThrow(ValidationError);
    });
  });
});

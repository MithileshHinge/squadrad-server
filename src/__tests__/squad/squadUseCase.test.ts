import ValidationError from '../../common/errors/ValidationError';
import AddSquad from '../../squad/AddSquad';
import EditSquad from '../../squad/EditSquad';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import sampleSquadParams from '../__mocks__/squad/squadParams';
import newSquad from '../__mocks__/squad/squads';

describe('Squad Use Cases', () => {
  beforeEach(() => {
    Object.values(mockSquadsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddSquad use case', () => {
    const addSquad = new AddSquad(mockSquadsData, squadValidator);
    const existingCreator = newCreator();

    it('Can add a squad', async () => {
      await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams })).resolves.not.toThrow();
      expect(mockSquadsData.insertNewSquad).toHaveBeenCalled();
    });

    it('Cannot add squad if another squad of same amount already exists', async () => {
      const existingSquad = newSquad();
      mockSquadsData.fetchSquadByAmount.mockResolvedValueOnce(existingSquad);
      await expect(addSquad.add({ userId: existingSquad.userId, ...sampleSquadParams, amount: existingSquad.amount })).rejects.toThrow(ValidationError);
      expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
    });

    describe('userId validation', () => {
      it('Should throw error if userId is not a string', async () => {
        const userId: any = 523523523;
        await expect(addSquad.add({ userId, ...sampleSquadParams })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });
    });

    describe('title validation', () => {
      it('Should throw error if title is not a string', async () => {
        const title: any = 749238232;
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, title })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });

      describe('Squad title must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((title) => {
          it(`should throw error for "${title}"`, async () => {
            await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, title })).rejects.toThrow(ValidationError);
            expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
          });
        });
      });

      /*
      describe('Squad title must contain only single space between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((title) => {
          it(`should throw error for "${title}"`, async () => {
            await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, title })).rejects.toThrow(ValidationError);
            expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
          });
        });
      });
      */

      describe('Squad title must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((title) => {
          it(`should throw error for ${title}`, async () => {
            await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, title })).rejects.toThrow(ValidationError);
            expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Squad amount validation', () => {
      it('Should throw error if amount is not a number', async () => {
        const amount: any = '1000';
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, amount })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });

      it('Should throw error if amount is less than Rs 30', async () => {
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, amount: 29.99 })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });
    });

    describe('Squad description validation', () => {
      it('Should throw error if description is not a string', async () => {
        const description: any = 43432;
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, description })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });

      it('Should throw error if description is >2000 characters', async () => {
        const description = faker.datatype.string(2001);
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, description })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });
    });

    describe('Squad members limit validation', () => {
      it('Should throw error if membersLimit is not a number', async () => {
        const membersLimit: any = '483042903';
        await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, membersLimit })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
      });

      describe('Squad member limit must be a positive integer', () => {
        [-100, -0.5, 0, 0.5, 100.5, NaN, Infinity].forEach((membersLimit) => {
          it(`Should throw error for ${membersLimit}`, async () => {
            await expect(addSquad.add({ userId: existingCreator.userId, ...sampleSquadParams, membersLimit })).rejects.toThrow(ValidationError);
            expect(mockSquadsData.insertNewSquad).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('FindSquad use case', () => {
    const findSquad = new FindSquad(mockSquadsData);

    describe('Find all squads by userId', () => {
      it('Can find all squads by userId', async () => {
        const creator = newCreator();
        mockSquadsData.fetchAllSquadsByUserId.mockResolvedValueOnce([newSquad(), newSquad()]);
        await expect(findSquad.findAllSquadsByUserId(creator.userId)).resolves.not.toThrowError();
        expect(mockSquadsData.fetchAllSquadsByUserId).toHaveBeenCalled();
      });

      it('Should throw error if userId is invalid', async () => {
        const userId:any = 48343940;
        await expect(findSquad.findAllSquadsByUserId(userId)).rejects.toThrow(ValidationError);
        expect(mockSquadsData.fetchAllSquadsByUserId).not.toHaveBeenCalled();
      });
    });
  });

  describe('EditSquad use case', () => {
    const editSquad = new EditSquad(mockSquadsData, squadValidator);
    const existingSquad = newSquad();

    it('Can edit title', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        title: sampleSquadParams.title,
      })).resolves.not.toThrow();
      expect(mockSquadsData.updateSquad).toHaveBeenCalled();
    });

    it('Should throw error if title is invalid', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        title: 'hi',
      })).rejects.toThrow(ValidationError);
      expect(mockSquadsData.updateSquad).not.toHaveBeenCalled();
    });

    it('Can edit description', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        description: sampleSquadParams.description,
      }));
      expect(mockSquadsData.updateSquad).toHaveBeenCalled();
    });

    it('Should throw error if description is invalid', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        description: faker.datatype.string(2001),
      })).rejects.toThrow(ValidationError);
      expect(mockSquadsData.updateSquad).not.toHaveBeenCalled();
    });

    it('Can edit membersLimit', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        membersLimit: sampleSquadParams.membersLimit,
      })).resolves.not.toThrowError();
      expect(mockSquadsData.updateSquad).toHaveBeenCalled();
    });

    it('Should throw error if membersLimit is invalid', async () => {
      await expect(editSquad.edit({
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        membersLimit: -100,
      })).rejects.toThrow(ValidationError);
      expect(mockSquadsData.updateSquad).not.toHaveBeenCalled();
    });

    it('Cannot edit amount', async () => {
      const params: any = {
        userId: existingSquad.userId,
        squadId: existingSquad.squadId,
        amount: 500,
      };
      await expect(editSquad.edit(params)).resolves.not.toThrow();
      expect(mockSquadsData.updateSquad).not.toHaveBeenCalledWith(expect.objectContaining({ amount: expect.anything() }));
    });
  });
});

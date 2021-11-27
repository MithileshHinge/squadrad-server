import ValidationError from '../../common/errors/ValidationError';
import AddGoal from '../../goal/AddGoal';
import goalValidator from '../../goal/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import sampleGoalParams from '../__mocks__/goal/goalParams';
import newGoal from '../__mocks__/goal/goals';
import mockGoalsData from '../__mocks__/goal/mockGoalsData';

describe('Goal use cases', () => {
  beforeEach(() => {
    Object.values(mockGoalsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddGoal use case', () => {
    const addGoal = new AddGoal(mockGoalsData, goalValidator);
    const existingCreator = newCreator();

    it('Can add a new goal', async () => {
      await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams })).resolves.not.toThrowError();
      expect(mockGoalsData.insertNewGoal).toHaveBeenCalled();
    });

    it('Cannot add goal if another goal of same goal number already exists', async () => {
      const existingGoal = newGoal();
      mockGoalsData.fetchGoalByGoalNumber.mockResolvedValueOnce(existingGoal);
      await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, goalNumber: existingGoal.goalNumber })).rejects.toThrow(ValidationError);
      expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
    });

    describe('userId validation', () => {
      it('Should throw error if userId is not a string', async () => {
        const userId: any = 523523523;
        await expect(addGoal.add({ userId, ...sampleGoalParams })).rejects.toThrow(ValidationError);
        expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
      });
    });

    describe('title validation', () => {
      it('Should throw error if title is not a string', async () => {
        const title: any = 749238232;
        await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, title })).rejects.toThrow(ValidationError);
        expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
      });

      describe('Goal title must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((title) => {
          it(`should throw error for "${title}"`, async () => {
            await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, title })).rejects.toThrow(ValidationError);
            expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
          });
        });
      });

      /*
      describe('Goal title must contain only single space between words', () => {
        ['as  dfg', 'as df  g', 'as  df   g'].forEach((title) => {
          it(`should throw error for "${title}"`, async () => {
            await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, title })).rejects.toThrow(ValidationError);
            expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
          });
        });
      });
      */

      describe('Goal title must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((title) => {
          it(`should throw error for ${title}`, async () => {
            await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, title })).rejects.toThrow(ValidationError);
            expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Goal number validation', () => {
      it('Should throw error if goal number is not a number', async () => {
        const goalNumber: any = '1000';
        await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, goalNumber })).rejects.toThrow(ValidationError);
        expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
      });

      it('Should insert integer even if goal number is float', async () => {
        const goalNumber = 100.2;
        await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, goalNumber })).resolves.not.toThrowError();
        expect(mockGoalsData.insertNewGoal).toHaveBeenCalled();
        const passedGoalNumber = mockGoalsData.insertNewGoal.mock.calls[0][0].goalNumber;
        expect(Math.round(passedGoalNumber)).toBe(passedGoalNumber);
      });
    });

    describe('Goal description validation', () => {
      it('Should throw error if description is not a string', async () => {
        const description: any = 43432;
        await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, description })).rejects.toThrow(ValidationError);
        expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
      });

      it('Should throw error if description is >2000 characters', async () => {
        const description = faker.datatype.string(2001);
        await expect(addGoal.add({ userId: existingCreator.userId, ...sampleGoalParams, description })).rejects.toThrow(ValidationError);
        expect(mockGoalsData.insertNewGoal).not.toHaveBeenCalled();
      });
    });
  });
});

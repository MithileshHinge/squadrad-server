import ValidationError from '../../common/errors/ValidationError';
import AddPost from '../../post/AddPost';
import postValidator from '../../post/validator';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import mockPostsData from '../__mocks__/post/mockPostsData';
import samplePostParams from '../__mocks__/post/postParams';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';

describe('Post use cases', () => {
  beforeEach(() => {
    Object.values(mockPostsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddPost use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const addPost = new AddPost(findSquad, mockPostsData, postValidator);
    const existingCreator = newCreator();

    it('Can create a new post', async () => {
      await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams })).resolves.not.toThrowError();
      expect(mockPostsData.insertNewPost).toHaveBeenCalled();
    });

    describe('userId validation', () => {
      it('Should throw error if userId is not a string', async () => {
        const userId: any = 523523523;
        await expect(addPost.add({ userId, ...samplePostParams })).rejects.toThrow(ValidationError);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });
    });

    // describe('title validation', () => {
    //   it('Should throw error if title is not a string', async () => {
    //     const title: any = 749238232;
    //     await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //     expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //   });

    //   describe('Post title must be >= 3 letters', () => {
    //     ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((title) => {
    //       it(`should throw error for "${title}"`, async () => {
    //         await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //         expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //       });
    //     });
    //   });

    //   describe('Post title must be <= 50 characters', () => {
    //     ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((title) => {
    //       it(`should throw error for ${title}`, async () => {
    //         await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //         expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //       });
    //     });
    //   });
    // });

    describe('Goal description validation', () => {
      it('Should throw error if description is not a string', async () => {
        const description: any = 43432;
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, description })).rejects.toThrow(ValidationError);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });

      it('Should throw error if description is >2000 characters', async () => {
        const description = faker.datatype.string(2001);
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, description })).rejects.toThrow(ValidationError);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });
    });

    describe('SquadId validation', () => {
      describe('Should throw error if squadId is not string or undefined', () => {
        [1234, null, true].forEach((squadId: any) => {
          it(`Should throw error for ${squadId}`, async () => {
            await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
          });
        });
      });

      it('Should not throw error for undefined and empty string', async () => {
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId: '' })).resolves.not.toThrowError();
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId: undefined })).resolves.not.toThrowError();
        expect(mockPostsData.insertNewPost).toHaveBeenCalledTimes(2);
      });
    });
  });
});

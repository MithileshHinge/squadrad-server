import ValidationError from '../../common/errors/ValidationError';
import AddPost from '../../post/AddPost';
import postValidator from '../../post/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import mockPostsData from '../__mocks__/post/mockPostsData';
import samplePostParams from '../__mocks__/post/postParams';

describe('Post use cases', () => {
  beforeEach(() => {
    Object.values(mockPostsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddPost use case', () => {
    const addPost = new AddPost(mockPostsData, postValidator);
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

    describe('title validation', () => {
      it('Should throw error if title is not a string', async () => {
        const title: any = 749238232;
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });

      describe('Post title must be >= 3 letters', () => {
        ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((title) => {
          it(`should throw error for "${title}"`, async () => {
            await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
          });
        });
      });

      describe('Post title must be <= 50 characters', () => {
        ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((title) => {
          it(`should throw error for ${title}`, async () => {
            await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
          });
        });
      });
    });

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
  });
});

import id from '../../common/id';
import CheckPostLike from '../../post-like/CheckPostLike';
import CountPostLikes from '../../post-like/CountPostLikes';
import TogglePostLike from '../../post-like/TogglePostLike';
import mockPostLikeData from '../__mocks__/post-like/mockPostLikeData';

describe('PostLike use cases', () => {
  beforeEach(() => {
    Object.values(mockPostLikeData).forEach((mockMethod) => {
      mockMethod.mockReset();
    });
  });

  describe('TogglePostLike', () => {
    const checkPostLike = new CheckPostLike(mockPostLikeData);
    const togglePostLike = new TogglePostLike(checkPostLike, mockPostLikeData);

    it('User can like a post that he has not liked', async () => {
      const userId = id.createId();
      const postId = id.createId();
      mockPostLikeData.fetchLike.mockResolvedValueOnce(false);
      mockPostLikeData.insertNewLike.mockResolvedValueOnce(1);
      mockPostLikeData.deleteLike.mockRejectedValueOnce(new Error());
      await expect(togglePostLike.toggle({ userId, postId })).resolves.toStrictEqual({ numLikes: 1 });
      expect(mockPostLikeData.insertNewLike).toHaveBeenCalled();
      expect(mockPostLikeData.deleteLike).not.toHaveBeenCalled();
    });

    it('User can unlike a post he has liked', async () => {
      const userId = id.createId();
      const postId = id.createId();
      mockPostLikeData.fetchLike.mockResolvedValueOnce(true);
      mockPostLikeData.deleteLike.mockResolvedValueOnce(0);
      mockPostLikeData.insertNewLike.mockRejectedValueOnce(new Error());
      await expect(togglePostLike.toggle({ userId, postId })).resolves.toStrictEqual({ numLikes: 0 });
      expect(mockPostLikeData.deleteLike).toHaveBeenCalled();
      expect(mockPostLikeData.insertNewLike).not.toHaveBeenCalled();
    });
  });

  describe('CheckPostLike', () => {
    const checkPostLike = new CheckPostLike(mockPostLikeData);

    test('Return true if user has liked a post', async () => {
      const userId = id.createId();
      const postId = id.createId();

      mockPostLikeData.fetchLike.mockResolvedValueOnce(true);
      await expect(checkPostLike.check({ userId, postId })).resolves.toBe(true);
      expect(mockPostLikeData.fetchLike).toHaveBeenCalled();
    });

    test('Return false if user has not liked a post', async () => {
      const userId = id.createId();
      const postId = id.createId();

      mockPostLikeData.fetchLike.mockResolvedValueOnce(false);
      await expect(checkPostLike.check({ userId, postId })).resolves.toBe(false);
      expect(mockPostLikeData.fetchLike).toHaveBeenCalled();
    });
  });

  describe('CountPostLikes', () => {
    const countPostLikes = new CountPostLikes(mockPostLikeData);

    it('Anyone can get number of post likes', async () => {
      const postId = id.createId();
      mockPostLikeData.fetchLikesCount.mockResolvedValueOnce(24);
      await expect(countPostLikes.count(postId)).resolves.toBe(24);
      expect(mockPostLikeData.fetchLikesCount).toHaveBeenCalled();
    });
  });
});

export default {
  insertNewComment: jest.fn((comment) => comment),
  fetchCommentById: jest.fn(),
  fetchCommentsByPostId: jest.fn(),
  countCommentsByPostId: jest.fn(),
};

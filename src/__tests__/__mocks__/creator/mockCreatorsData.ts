export default {
  insertNewCreator: jest.fn((creator: any) => creator),
  fetchCreatorById: jest.fn(),
  updateCreator: jest.fn((creatorToUpdate: any) => creatorToUpdate),
};

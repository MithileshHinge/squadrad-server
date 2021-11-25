export default {
  insertNewSquad: jest.fn((squad) => squad),
  fetchSquadByAmount: jest.fn(),
  fetchAllSquadsByUserId: jest.fn(),
  updateSquad: jest.fn((squadToUpdate) => squadToUpdate),
};

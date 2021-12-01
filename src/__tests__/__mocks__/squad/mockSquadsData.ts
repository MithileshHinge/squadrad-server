export default {
  insertNewSquad: jest.fn((squad) => squad),
  fetchSquadBySquadId: jest.fn(),
  fetchSquadByAmount: jest.fn(),
  fetchAllSquadsByUserId: jest.fn(),
  updateSquad: jest.fn((squadToUpdate) => squadToUpdate),
};

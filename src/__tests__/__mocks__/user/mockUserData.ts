import sampleUsers from './users';

const mockUserData = {
  insertIntoDb: jest.fn(),
  fetchAllUsers: jest.fn(() => sampleUsers),
  fetchUserById: jest.fn((
    userId: string,
  ) => {
    const user = sampleUsers.find((u) => u.userId === userId);
    return user ? {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePicSrc: user.profilePicSrc,
    } : null;
  }),
  fetchUserByEmail: jest.fn((
    email: string,
  ) => {
    const user = sampleUsers.find((u) => u.email === email);
    return user ? {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePicSrc: user.profilePicSrc,
    } : null;
  }),
  updateUser: jest.fn(),
  updatePassword: jest.fn(),
  updateProfilePic: jest.fn(),
  fetchProfilePic: jest.fn(),
};

export default mockUserData;
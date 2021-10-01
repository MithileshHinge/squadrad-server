/* eslint-disable @typescript-eslint/no-unused-vars */
import sampleUsers from './users';

const mockUsersData = {
  insertNewUser: jest.fn(({
    userId,
    fullName,
    email,
    password,
  }: {
    userId: string,
    fullName: string,
    email: string,
    password: string,
  }) => ({ userId, fullName, email })),
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
  updateUser: jest.fn(({ userId, fullName }: {
    userId: string,
    fullName?: string,
  }) => ({ userId, fullName })),
  updatePassword: jest.fn(),
};

export default mockUsersData;

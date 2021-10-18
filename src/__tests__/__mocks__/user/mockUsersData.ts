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
  }) => (Promise.resolve({ userId, fullName, email }))),
  fetchAllUsers: jest.fn(() => Promise.resolve(sampleUsers)),
  fetchUserById: jest.fn((
    userId: string,
  ) => {
    const user = sampleUsers.find((u) => u.userId === userId);
    return user ? Promise.resolve({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePicSrc: user.profilePicSrc,
      verified: user.verified,
    }) : Promise.resolve(null);
  }),
  fetchUserByEmail: jest.fn((
    email: string,
  ) => {
    const user = sampleUsers.find((u) => u.email === email);
    return user ? Promise.resolve({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePicSrc: user.profilePicSrc,
      verified: user.verified,
    }) : Promise.resolve(null);
  }),
  updateUser: jest.fn(({ userId, fullName, verified }: {
    userId: string,
    fullName?: string,
    verified?: boolean,
  }) => Promise.resolve({ userId, fullName, verified })),
  updatePassword: jest.fn(),
  fetchPasswordById: jest.fn((
    userId: string,
  ) => {
    const user = sampleUsers.find((u) => u.userId === userId);
    return Promise.resolve(user!.password);
  }),
};

export default mockUsersData;

const mockProfilePicsData = {
  updateProfilePic: jest.fn(),
  fetchProfilePic: jest.fn(async (): Promise<string | null> => 'default.jpg'),
};

export default mockProfilePicsData;

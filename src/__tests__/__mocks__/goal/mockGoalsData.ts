export default {
  insertNewGoal: jest.fn((goal) => goal),
  fetchGoalByGoalNumber: jest.fn(),
  fetchAllGoalsByUserId: jest.fn(),
  updateGoal: jest.fn((goal) => goal),
};

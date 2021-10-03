import UserController from './controllers/UserController';

export default [
  {
    path: '/user',
    post: UserController.postUser, // register new user
  },
];

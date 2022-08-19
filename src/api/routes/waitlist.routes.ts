import WaitlistController from '../controllers/WaitlistController';

export default [
  {
    path: '/waitlist',
    post: [WaitlistController.postWaitlist],
  },
];

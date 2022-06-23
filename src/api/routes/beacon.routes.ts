import BeaconController from '../controllers/BeaconController';

export default [
  {
    path: '/beacon/landing/:ref',
    get: [BeaconController.getLandingBeacon],
  },
];

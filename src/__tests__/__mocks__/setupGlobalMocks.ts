/* eslint-disable global-require */
jest.mock('../../api/services/store.service', () => require('./api/mockStore'));
jest.mock('../../database/getDb', () => require('./database/mockDb'));
jest.mock('../../mail');
jest.mock('../../api/services/razorpay.service', () => require('./api/services/mockRazorpay.service'));

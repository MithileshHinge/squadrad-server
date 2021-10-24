/* eslint-disable global-require */
jest.mock('../../api/services/store.service', () => require('./api/mockStore'));
jest.mock('../../database/getDb', () => require('./database/mockDb'));
jest.mock('../../mail');

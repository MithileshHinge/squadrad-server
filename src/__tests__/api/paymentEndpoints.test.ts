import { Collection, Document } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import id from '../../common/id';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import mockRazorpayService from '../__mocks__/api/services/mockRazorpay.service';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import squadParams from '../__mocks__/squad/squadParams';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('Payment Endpoints', () => {
  let usersCollection: Collection<Document>;
  let creatorsCollection: Collection<Document>;
  let squadsCollection: Collection<Document>;
  let manualSubsCollection: Collection<Document>;

  beforeEach(async () => {
    usersCollection = await (await mockDb()).createCollection('users');
    creatorsCollection = await (await mockDb()).createCollection('creators');
    squadsCollection = await (await mockDb()).createCollection('squads');
    manualSubsCollection = await (await mockDb()).createCollection('manualSubs');

    Object.values(mockRazorpayService).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  afterEach(async () => {
    await usersCollection.drop();
    await creatorsCollection.drop();
    await squadsCollection.drop();
    await manualSubsCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('GET /payment/order/:squadId', () => {
    it('User can request a payment order to join a squad', async () => {
      const { agent: agentUser } = await getLoggedInUser(app, usersCollection);
      const { agent: agentCreator } = await getLoggedInCreator(app, usersCollection);
      const { body: squad } = await agentCreator.post('/squad').send(squadParams).expect(HTTPResponseCode.OK);
      const { body } = await agentUser.get(`/payment/order/${squad.squadId}`).expect(HTTPResponseCode.OK);
      expect(body).toStrictEqual(expect.objectContaining({ rzpOrder: expect.anything() }));
      expect(mockRazorpayService.createOrder).toHaveBeenCalled();
    });

    it('Respond with error code 400 (Bad Request) if squad does not exist', async () => {
      const { agent: agentUser } = await getLoggedInUser(app, usersCollection);
      const squadId = id.createId();
      await agentUser.get(`/payment/order/${squadId}`).expect(HTTPResponseCode.BAD_REQUEST);
    });
  });

  describe('POST /payment/success', () => {
    it('Can create new manualSub upon successful payment', async () => {
      const { agent: agentUser, userId } = await getLoggedInUser(app, usersCollection);
      const { agent: agentCreator, userId: creatorUserId } = await getLoggedInCreator(app, usersCollection);
      const { body: squad } = await agentCreator.post('/squad').send(squadParams).expect(HTTPResponseCode.OK);
      mockRazorpayService.getOrderById.mockResolvedValueOnce({ rzpOrderId: 'fnvdjnadcadc', amount: squad.amount * 100, notes: { userId, creatorUserId, squadId: squad.squadId } });
      mockRazorpayService.getPaymentById.mockResolvedValueOnce({ contact: '+918908766547' });
      const { body: manualSub } = await agentUser.post('/payment/success').send({ rzpTransactionId: 'nsjdfnsdjcasasd', rzpOrderId: 'fnvdjnadcadc', rzpSignature: 'asdfasdnfiadifan' }).expect(HTTPResponseCode.OK);
      expect(manualSub).toStrictEqual(expect.objectContaining({ manualSubId: expect.any(String), amount: squad.amount }));
    });

    it('Respond with error code 400 (Bad Request) if signature could not be verified', async () => {
      const { agent: agentUser, userId } = await getLoggedInUser(app, usersCollection);
      mockRazorpayService.verifySignature.mockReturnValueOnce(false);
      await agentUser.post('/payment/success').send({ rzpTransactionId: 'nsjdfnsdjcasasd', rzpOrderId: 'fnvdjnadcadc', rzpSignature: 'asdfasdnfiadifan' }).expect(HTTPResponseCode.BAD_REQUEST);
      expect(mockRazorpayService.getOrderById).not.toHaveBeenCalled();
      expect(mockRazorpayService.getPaymentById).not.toHaveBeenCalled();
      await expect(manualSubsCollection.findOne({ userId })).resolves.toBeFalsy();
    });
  });
});

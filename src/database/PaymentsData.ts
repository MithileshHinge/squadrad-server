/* eslint-disable no-underscore-dangle */
import IPaymentsData from '../payment/IPaymentsData';
import BaseData from './BaseData';

export default class PaymentsData extends BaseData implements IPaymentsData {
  async insertNewPaymentRecord({
    paymentId, userId, creatorUserId, amount, squadId, rzpTransactionId, rzpOrderId, contactNumber, timestamp,
  }: {
    paymentId: string,
    userId: string,
    creatorUserId: string,
    amount: number,
    squadId: string,
    rzpTransactionId: string,
    rzpOrderId: string,
    contactNumber: string,
    timestamp: number,
  }): Promise<{
      paymentId: string,
      userId: string,
      creatorUserId: string,
      amount: number,
      squadId: string,
      rzpTransactionId: string,
      rzpOrderId: string,
      contactNumber: string,
      timestamp: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('payments').insertOne({
        paymentId, userId, creatorUserId, amount, squadId, rzpTransactionId, rzpOrderId, contactNumber, timestamp,
      });
      return {
        paymentId: result.insertedId.toString(),
        userId,
        creatorUserId,
        amount,
        squadId,
        rzpTransactionId,
        rzpOrderId,
        contactNumber,
        timestamp,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new payment record');
    }
  }

  async fetchPaymentsByCreatorUserId(userId: string): Promise<{
    paymentId: string,
    userId: string,
    creatorUserId: string,
    amount: number,
    squadId: string,
    rzpTransactionId: string,
    rzpOrderId: string,
    contactNumber: string,
    timestamp: number,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('payments').find({ creatorUserId: userId }).toArray();

      return result.map((payment) => ({
        paymentId: payment._id.toString(),
        userId: payment.userId,
        creatorUserId: payment.creatorUserId,
        amount: payment.amount,
        squadId: payment.squadId,
        rzpTransactionId: payment.rzpTransactionId,
        rzpOrderId: payment.rzpOrderId,
        contactNumber: payment.contactNumber,
        timestamp: payment.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch payments by creator userId');
    }
  }
}

import id from '../common/id';
import IPaymentsData from './IPaymentsData';

export default class AddPayment {
  private paymentsData: IPaymentsData;

  constructor(paymentsData: IPaymentsData) {
    this.paymentsData = paymentsData;
  }

  /**
   * Add a record of a payment. Internal usecase. Does not validate inputs!
   * @param userId Id of user making the payment
   * @param creatorUserId Id of creator to whom the payment is made
   * @param amount Amount paid
   * @param squadId Id of squad against which the payment is made
   * @param rzpTransactionId Razorpay transactionId
   * @param rzpOrderId Razorpay orderId
   * @param contactNumber contact number of user
   */
  async add({
    userId, creatorUserId, amount, squadId, rzpTransactionId, rzpOrderId, contactNumber, timestamp,
  }: {
    userId: string,
    creatorUserId: string,
    amount: number,
    squadId: string,
    rzpTransactionId: string,
    rzpOrderId: string,
    contactNumber: string,
    timestamp: number,
  }) {
    const paymentId = id.createId();
    await this.paymentsData.insertNewPaymentRecord({
      paymentId, userId, creatorUserId, amount, squadId, rzpTransactionId, rzpOrderId, contactNumber, timestamp,
    });
  }
}

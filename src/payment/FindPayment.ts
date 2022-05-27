import { validateUserId } from '../userId';
import IPaymentsData from './IPaymentsData';

export default class FindPayment {
  private paymentsData: IPaymentsData;

  constructor(paymentsData: IPaymentsData) {
    this.paymentsData = paymentsData;
  }

  /**
   * Find all payments made to a creator
   */
  async findAllPaymentsToCreator(userId: string) {
    const userIdValidated = validateUserId.validate(userId);

    const payments = await this.paymentsData.fetchPaymentsByCreatorUserId(userIdValidated);

    return payments.map((payment) => ({
      paymentId: payment.paymentId,
      userId: payment.userId,
      creatorUserId: payment.creatorUserId,
      amount: payment.amount,
      squadId: payment.squadId,
      rzpTransactionId: payment.rzpTransactionId,
      rzpOrderId: payment.rzpOrderId,
      timestamp: payment.timestamp,
    }));
  }
}

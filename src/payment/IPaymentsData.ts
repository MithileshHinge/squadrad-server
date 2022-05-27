export default interface IPaymentsData {
  insertNewPaymentRecord({
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
  }>

  fetchPaymentsByCreatorUserId(userId: string): Promise<{
    paymentId: string,
    userId: string,
    creatorUserId: string,
    amount: number,
    squadId: string,
    rzpTransactionId: string,
    rzpOrderId: string,
    contactNumber: string,
    timestamp: number,
  }[]>
}

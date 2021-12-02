import Razorpay from 'razorpay';
import crypto from 'crypto';
import { RZP_ID, RZP_SECRET } from '../../common/secretKeys';

let rzpInstance: any = null;

const createInstance = () => {
  rzpInstance = new Razorpay({
    key_id: RZP_ID,
    key_secret: RZP_SECRET,
  });
};

const createOrder = (options: any) => rzpInstance.orders.create(options);

const getOrderById = (orderId: string) => rzpInstance.orders.fetch(orderId);

const getPaymentById = (transactionId: string) => rzpInstance.payments.fetch(transactionId);

const verifySignature = (rzpOrderId: string, rzpPaymentId: string, rzpSignature: string) => {
  const hmac = crypto.createHmac('sha256', RZP_SECRET);
  hmac.update(`${rzpOrderId}|${rzpPaymentId}`);
  const generatedSignature = hmac.digest('hex');
  return (generatedSignature === rzpSignature);
};

export default {
  createInstance,
  createOrder,
  getOrderById,
  getPaymentById,
  verifySignature,
};

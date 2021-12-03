const createInstance = () => {};

const createOrder = () => ({ order_id: 'blahblah' });

const getOrderById = (orderId: string) => ({ order_id: orderId });

const getPaymentById = (transactionId: string) => ({ transactionId });

const verifySignature = () => true;

export default {
  createInstance,
  createOrder,
  getOrderById,
  getPaymentById,
  verifySignature,
};

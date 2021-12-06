const createInstance = jest.fn(() => {});

const createOrder = jest.fn(() => ({ order_id: 'blahblah' }));

const getOrderById = jest.fn();

const getPaymentById = jest.fn();

const verifySignature = jest.fn(() => true);

export default {
  createInstance,
  createOrder,
  getOrderById,
  getPaymentById,
  verifySignature,
};

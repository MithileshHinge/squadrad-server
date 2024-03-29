import ValidationError from '../../common/errors/ValidationError';
import { addManualSub, findManualSub } from '../../manual-sub';
import ManualSubStatuses from '../../manual-sub/ManualSubStatuses';
import { addPayment, findPayment } from '../../payment';
import { findSquad } from '../../squad';
import { findUser } from '../../user';
import { HTTPResponseCode } from '../HttpResponse';
import razorpayService from '../services/razorpay.service';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const getRzpOrder: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const squad = await findSquad.findSquadById(httpRequest.params.squadId);

    if (!squad) throw new ValidationError('Squad not found');
    if (squad.userId === userId) throw new ValidationError('Cannot join your own squad');

    const manualSub = await findManualSub.findManualSubByUserIds(userId, squad.userId);
    if (manualSub && manualSub.squadId === squad.squadId) throw new ValidationError('User has already subscribed to this squad');

    const { amount, userId: creatorUserId, squadId } = squad;
    const rzpOrder = await razorpayService.createOrder({
      amount: amount * 100, // In paise
      currency: 'INR',
      notes: {
        userId,
        creatorUserId,
        squadId,
      },
    });

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        rzpOrder,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const postPaymentSuccess: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { rzpTransactionId, rzpOrderId, rzpSignature } = httpRequest.body;
    if (typeof rzpTransactionId !== 'string' || typeof rzpOrderId !== 'string' || typeof rzpSignature !== 'string') throw new ValidationError('Bad parameters');
    if (!razorpayService.verifySignature(rzpOrderId, rzpTransactionId, rzpSignature)) throw new ValidationError('Could not verify payment signature');
    const rzpOrder = await razorpayService.getOrderById(rzpOrderId);
    if (!rzpOrder) throw new ValidationError(`Could not find order. Invalid orderId ${rzpOrderId}`);
    const rzpPayment = await razorpayService.getPaymentById(rzpTransactionId);
    if (!rzpPayment) throw new ValidationError(`Could not fetch payment. Invalid transactionId ${rzpTransactionId}`);

    const manualSub = await addManualSub.add({
      userId,
      creatorUserId: rzpOrder.notes.creatorUserId,
      squadId: rzpOrder.notes.squadId,
      amount: Number.parseInt(rzpOrder.amount, 10) / 100, // In rupees
      contactNumber: rzpPayment.contact,
      subscriptionStatus: ManualSubStatuses.ACTIVE,
    });

    await addPayment.add({
      userId,
      creatorUserId: rzpOrder.notes.creatorUserId,
      amount: Number.parseInt(rzpOrder.amount, 10) / 100, // In rupees
      squadId: rzpOrder.notes.squadId,
      rzpTransactionId,
      rzpOrderId,
      contactNumber: rzpPayment.contact,
      timestamp: Date.now(),
    });

    return {
      statusCode: HTTPResponseCode.OK,
      body: manualSub,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getPaymentsToCreator: IBaseController = async (httpRequest) => {
  const userId = httpRequest.userId!;

  const payments = await findPayment.findAllPaymentsToCreator(userId);
  const userIds = payments.map((payment) => payment.userId);
  const users = await findUser.findUserInfos({ userIds, onlyVerified: true });

  return {
    statusCode: HTTPResponseCode.OK,
    body: payments.map((payment) => ({
      ...payment,
      user: users.find((u) => u.userId === payment.userId),
    })),
  };
};

export default {
  getRzpOrder,
  getPaymentsToCreator,
  postPaymentSuccess,
};

import ValidationError from '../../common/errors/ValidationError';
import { addManualSub } from '../../manual-sub';
import { findSquad } from '../../squad';
import { HTTPResponseCode } from '../HttpResponse';
import razorpayService from '../services/razorpay.service';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const getRzpOrder: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const squad = await findSquad.findSquadById(httpRequest.params.squadId);

    if (!squad) throw new ValidationError('Squad not found');

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

    const manualSub = await addManualSub.add({ userId, squadId: rzpOrder.notes.squadId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: manualSub,
    };
  } catch (err: any) {
    console.log(err);
    return handleControllerError(err);
  }
};

export default {
  getRzpOrder,
  postPaymentSuccess,
};

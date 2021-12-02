import { addManualSub } from '../../manual-sub';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';
import razorpayService from '../services/razorpay.service';
import { HTTPResponseCode } from '../HttpResponse';

const postManualSub: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { creatorUserId, squadId } = httpRequest.body;

    const manualSub = await addManualSub.add({
      userId,
      creatorUserId,
      squadId,
    });

    const rzpOrder = razorpayService.createOrder({
      amount: manualSub.amount * 100, // In paise
      currency: 'INR',
      notes: {
        userId,
        creatorUserId,
        squadId,
        manualSubId: manualSub.manualSubId,
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

export default {
  postManualSub,
};

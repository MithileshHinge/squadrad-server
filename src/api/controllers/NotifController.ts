import { findNotif } from '../../notif';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const getNotifs: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const notifs = await findNotif.findAllNotifsForReceiver(userId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: notifs,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  getNotifs,
};

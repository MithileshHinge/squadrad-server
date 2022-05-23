import { findManualSub } from '../../manual-sub';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const getManualSubByCreatorId: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { creatorUserId } = httpRequest.params;
    const manualSub = await findManualSub.findManualSubByUserIds(userId, creatorUserId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: manualSub,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  getManualSubByCreatorId,
};

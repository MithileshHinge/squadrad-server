import { addManualSub } from '../../manual-sub';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';
import { HTTPResponseCode } from '../HttpResponse';

const postManualSub: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { squadId } = httpRequest.body;

    const manualSub = await addManualSub.add({
      userId,
      squadId,
    });

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        manualSubId: manualSub.manualSubId,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postManualSub,
};

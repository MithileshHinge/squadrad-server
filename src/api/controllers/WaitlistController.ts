import { joinWaitlist } from '../../waitlist';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postWaitlist: IBaseController = async (httpRequest) => {
  try {
    const { email, features } = httpRequest.body;

    await joinWaitlist.join({ email, features });

    return {
      statusCode: HTTPResponseCode.OK,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postWaitlist,
};

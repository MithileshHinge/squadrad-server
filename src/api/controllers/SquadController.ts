import { addSquad } from '../../squad';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postSquad: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const {
      title, amount, description, membersLimit,
    } = httpRequest.body;
    const squad = await addSquad.add({
      userId, title, amount, description, membersLimit,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        squadId: squad.squadId,
        userId: squad.userId,
        title: squad.title,
        amount: squad.amount,
        description: squad.description,
        membersLimit: squad.membersLimit,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postSquad,
};

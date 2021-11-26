import { addSquad, editSquad, findSquad } from '../../squad';
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

const getAllSquadsByUserId: IBaseController = async (httpRequest) => {
  try {
    const { userId } = httpRequest.params;
    const squads = await findSquad.findAllSquadsByUserId(userId);
    return {
      statusCode: HTTPResponseCode.OK,
      body: squads,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const patchSquad: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { squadId } = httpRequest.params;
    const {
      title, description, membersLimit,
    } = httpRequest.body;
    const updatedSquad = await editSquad.edit({
      userId, squadId, title, description, membersLimit,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        ...updatedSquad,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postSquad,
  patchSquad,
  getAllSquadsByUserId,
};

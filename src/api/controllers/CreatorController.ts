import { becomeCreator, editCreator } from '../../creator';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postCreator: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { pageName, bio, isPlural }: {
      pageName: string,
      bio: string,
      isPlural: boolean,
    } = httpRequest.body;
    await becomeCreator.becomeCreator({
      userId,
      pageName,
      bio,
      isPlural,
    });
    return { statusCode: HTTPResponseCode.OK, body: {} };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const patchCreator: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const {
      pageName, bio, isPlural, showTotalSquadMembers, about,
    }: {
      pageName?: string,
      bio?: string,
      isPlural?: boolean,
      showTotalSquadMembers?: boolean,
      about?: string,
    } = httpRequest.body;

    await editCreator.edit({
      userId,
      pageName,
      bio,
      isPlural,
      showTotalSquadMembers,
      about,
    });
    return { statusCode: HTTPResponseCode.OK, body: {} };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postCreator,
  patchCreator,
};

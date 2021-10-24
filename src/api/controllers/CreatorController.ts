import ValidationError from '../../common/errors/ValidationError';
import { becomeCreator, editCreator } from '../../creator';
import { HTTPResponseCode } from '../HttpResponse';
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
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
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
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
  }
};

export default {
  postCreator,
  patchCreator,
};

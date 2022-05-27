import { becomeCreator, editCreator, findCreator } from '../../creator';
import { setProfilePic } from '../../profile-pic';
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
      pageName, bio, isPlural, showTotalSquadMembers, about, goalsTypeEarnings,
    }: {
      pageName?: string,
      bio?: string,
      isPlural?: boolean,
      showTotalSquadMembers?: boolean,
      about?: string,
      goalsTypeEarnings?: boolean,
    } = httpRequest.body;

    await editCreator.edit({
      userId,
      pageName,
      bio,
      isPlural,
      showTotalSquadMembers,
      about,
      goalsTypeEarnings,
    });
    return { statusCode: HTTPResponseCode.OK, body: {} };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const putProfilePic: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const profilePicSrc: any = httpRequest.files ? httpRequest.files[0] : undefined;

    const profilePicSrcAdded = await setProfilePic.setNew(userId, profilePicSrc, true);

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        profilePicSrc: profilePicSrcAdded,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getCreator: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const creatorPageInfo = await findCreator.findCreatorPage(userId, true);
    if (!creatorPageInfo) return { statusCode: HTTPResponseCode.NOT_FOUND, body: {} };

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        userId: creatorPageInfo.userId,
        pageName: creatorPageInfo.pageName,
        bio: creatorPageInfo.bio,
        isPlural: creatorPageInfo.isPlural,
        profilePicSrc: creatorPageInfo.profilePicSrc,
        showTotalSquadMembers: creatorPageInfo.showTotalSquadMembers!,
        about: creatorPageInfo.about,
        goalsTypeEarnings: creatorPageInfo.goalsTypeEarnings,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getCreatorUserId: IBaseController = async (httpRequest) => {
  try {
    const { userId: creatorUserId } = httpRequest.params;
    const creatorPageInfo = await findCreator.findCreatorPage(creatorUserId, false);
    if (!creatorPageInfo) return { statusCode: HTTPResponseCode.NOT_FOUND, body: {} };

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        userId: creatorPageInfo.userId,
        pageName: creatorPageInfo.pageName,
        bio: creatorPageInfo.bio,
        isPlural: creatorPageInfo.isPlural,
        profilePicSrc: creatorPageInfo.profilePicSrc,
        about: creatorPageInfo.about,
        goalsTypeEarnings: creatorPageInfo.goalsTypeEarnings,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getAllCreators: IBaseController = async () => {
  try {
    const creators = await findCreator.findAllCreatorsInfos();

    return {
      statusCode: HTTPResponseCode.OK,
      body: creators,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postCreator,
  patchCreator,
  putProfilePic,
  getCreator,
  getCreatorUserId,
  getAllCreators,
};

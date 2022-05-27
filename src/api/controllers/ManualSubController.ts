import { findManualSub, findManualSubbedCreators, findManualSubbedUsers } from '../../manual-sub';
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

const getAllManualSubs: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const manualSubs = await findManualSub.findManualSubsByUserId(userId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: manualSubs,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getAllManualSubbedCreators: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const onlyActive = httpRequest.path.includes('active');
    const creatorsInfo = await findManualSubbedCreators.find({ userId, onlyActive });

    return {
      statusCode: HTTPResponseCode.OK,
      body: creatorsInfo,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getAllManualSubbedUsers: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const onlyActive = httpRequest.path.includes('active');
    const usersInfo = await findManualSubbedUsers.find({ userId, onlyActive });

    return {
      statusCode: HTTPResponseCode.OK,
      body: usersInfo,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

/*
const getTotalMembersOfCreator: IBaseController = async (httpRequest) => {
  try {
    const { creatorUserId } = httpRequest.params;
    const totalMembers = await findManualSub.findTotalMembersByCreatorId(creatorUserId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: { totalMembers },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getMonthlyIncomeOfCreator: IBaseController = async (httpRequest) => {
  try {
    const { creatorUserId } = httpRequest.params;
    const monthlyIncome = await findManualSub.findMonthlyIncomeByCreatorId(creatorUserId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: { monthlyIncome },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};
*/

export default {
  getManualSubByCreatorId,
  getAllManualSubs,
  getAllManualSubbedCreators,
  getAllManualSubbedUsers,
  // getTotalMembersOfCreator,
  // getMonthlyIncomeOfCreator,
};

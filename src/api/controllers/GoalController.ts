import ValidationError from '../../common/errors/ValidationError';
import { findCreator } from '../../creator';
import { addGoal, editGoal, findGoal } from '../../goal';
import { countManualSub } from '../../manual-sub';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postGoal: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const {
      title, description, goalNumber,
    } = httpRequest.body;
    const goal = await addGoal.add({
      userId, title, description, goalNumber,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        goalId: goal.goalId,
        userId: goal.userId,
        title: goal.title,
        description: goal.description,
        goalNumber: goal.goalNumber,
      },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getAllGoalsByUserId: IBaseController = async (httpRequest) => {
  try {
    const { userId } = httpRequest.params;
    const creator = await findCreator.findCreatorPage(userId, userId === httpRequest.userId);
    if (!creator) throw new ValidationError('Creator not found');

    const goals = await findGoal.findAllGoalsByUserId(userId);
    if (goals.length > 0) {
      if (creator.goalsTypeEarnings) {
        const monthlyIncome = await countManualSub.countMonthlyIncomeByCreatorId(userId);

        return {
          statusCode: HTTPResponseCode.OK,
          body: { goals, monthlyIncome },
        };
      }
      const totalMembers = await countManualSub.countTotalMembersByCreatorId(userId);

      return {
        statusCode: HTTPResponseCode.OK,
        body: { goals, totalMembers },
      };
    }
    return {
      statusCode: HTTPResponseCode.OK,
      body: { goals: [] },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const patchGoal: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { goalId } = httpRequest.params;
    const {
      title, description, goalNumber,
    } = httpRequest.body;

    const udpatedGoal = await editGoal.edit({
      userId, goalId, title, description, goalNumber,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: udpatedGoal,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postGoal,
  getAllGoalsByUserId,
  patchGoal,
};

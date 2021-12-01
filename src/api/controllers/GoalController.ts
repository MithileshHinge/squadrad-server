import { addGoal, editGoal, findGoal } from '../../goal';
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
    const goals = await findGoal.findAllGoalsByUserId(userId);
    return {
      statusCode: HTTPResponseCode.OK,
      body: goals,
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

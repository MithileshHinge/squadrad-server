import { validateUserId } from '../userId';
import { ICreatorsData } from './ICreatorsData';
import ReviewPageStatus from './ReviewPageStatus';

export default class ReviewPage {
  private creatorData: ICreatorsData;

  constructor(creatorsData: ICreatorsData) {
    this.creatorData = creatorsData;
  }

  /**
   * Submit creator page for review
   * @param userId userId of creator whose page is to be reviewed
   */
  async submitForReview(userId: string) {
    const userIdValidated = validateUserId.validate(userId);

    await this.creatorData.updateCreator({ userId: userIdValidated, review: { status: ReviewPageStatus.SUBMITTED } });
  }
}

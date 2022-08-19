import IWaitlistData from '../waitlist/IWaitlistData';
import BaseData from './BaseData';

export default class WaitlistData extends BaseData implements IWaitlistData {
  async addNewUser({ email, features }: {
    email: string,
    features: string[],
  }) {
    const db = await this.getDb();
    try {
      await db.collection('waitlist').insertOne({ email, features });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, `Could not add user to waitlist ${email}`);
    }
  }
}

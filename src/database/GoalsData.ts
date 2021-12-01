/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import IGoalsData from '../goal/IGoalsData';
import BaseData from './BaseData';

export default class GoalsData extends BaseData implements IGoalsData {
  async insertNewGoal({
    goalId, userId, title, description, goalNumber,
  }: {
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  }): Promise<{ goalId: string; userId: string; title: string; description: string; goalNumber: number; }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('goals').insertOne({
        _id: new ObjectId(goalId),
        userId,
        title,
        description,
        goalNumber,
      });
      return {
        goalId: result.insertedId.toString(),
        userId,
        title,
        description,
        goalNumber,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new goal');
    }
  }

  async fetchGoalByGoalNumber({
    userId, goalNumber,
  }: {
    userId: string,
    goalNumber: number,
  }): Promise<{ goalId: string; userId: string; title: string; description: string; goalNumber: number; } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('goals').findOne({ userId, goalNumber });

      if (!result) return null;
      return {
        goalId: result._id.toString(),
        userId: result.userId,
        title: result.title,
        description: result.description,
        goalNumber: result.goalNumber,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch goal');
    }
  }

  async fetchAllGoalsByUserId(userId: string): Promise<{
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  }[]> {
    const db = await this.getDb();
    try {
      const resultCur = db.collection('goals').find({ userId });
      const goals = await resultCur.toArray();
      return goals.map((goal) => ({
        goalId: goal._id.toString(),
        userId: goal.userId,
        title: goal.title,
        description: goal.description,
        goalNumber: goal.goalNumber,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch goals');
    }
  }

  async updateGoal({
    userId, goalId, ...updateData
  }: {
    userId: string,
    goalId: string,
    title?: string,
    description?: string,
    goalNumber?: number,
  }): Promise<{
      userId: string,
      goalId: string,
      title?: string,
      description?: string,
      goalNumber?: number,
    }> {
    const db = await this.getDb();
    try {
      await db.collection('goals').updateOne({ _id: new ObjectId(goalId), userId }, { $set: updateData });
      return {
        userId,
        goalId,
        ...updateData,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update goal');
    }
  }
}

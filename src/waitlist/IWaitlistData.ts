export default interface IWaitlistData {
  addNewUser({ email, features }: {
    email: string,
    features: Array<string>,
  }): Promise<null>;
}

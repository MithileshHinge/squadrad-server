export default interface IWaitlistValidator {
  validateFeatures(features: any): Array<string>;
}

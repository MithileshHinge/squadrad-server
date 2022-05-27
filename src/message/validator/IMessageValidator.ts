export default interface IMessageValidator {
  validateText(text: any): string,
  validateIsSenderCreator(isSenderCreator: any): boolean,
}

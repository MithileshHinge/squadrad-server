export interface ICommentValidator {
  validateText: (text: any) => string,
  validateCommentId: (commentId: any) => string,
}

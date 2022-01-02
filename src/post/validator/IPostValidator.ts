import { IPostAttachment } from '../IPostAttachment';

// TODO: Change all param types to 'any', don't rely on typescript for type validation
export interface IPostValidator {
  validatePostId: (postId: any) => string,
  // validateTitle: (title: string) => string,
  validateDescription: (description: string) => string,
  validateAttachment: (attachment: any) => IPostAttachment,
}

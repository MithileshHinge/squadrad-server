export enum PostAttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IPostAttachment {
  type: PostAttachmentType,
  attachmentId: string,
}

export enum PostAttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
}

export interface IPostAttachment {
  type: PostAttachmentType,
  src: string,
}

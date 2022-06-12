import RemoveComment from '../comment/RemoveComment';
import DeleteAttachmentFile from '../post-attachment/DeleteAttachmentFile';
import RemovePostLike from '../post-like/RemovePostLike';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class RemovePost {
  private removePostLike: RemovePostLike;

  private removeComment: RemoveComment;

  private deleteAttachmentFile: DeleteAttachmentFile;

  private postsData: IPostsData;

  private postValidator: IPostValidator;

  constructor(removePostLike: RemovePostLike, removeComment: RemoveComment, deleteAttachmentFile: DeleteAttachmentFile, postsData: IPostsData, postValidator: IPostValidator) {
    this.removePostLike = removePostLike;
    this.removeComment = removeComment;
    this.deleteAttachmentFile = deleteAttachmentFile;
    this.postsData = postsData;
    this.postValidator = postValidator;
  }

  /**
   * Deletes a post, post likes, comments and comment likes. needs userId to check access
   */
  async remove({ userId, postId }: { userId: string, postId: string }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = this.postValidator.validatePostId(postId);

    const post = await this.postsData.fetchPostById(postIdValidated);
    if (!post || post.userId !== userIdValidated) return; // Post does not exist, or its not the creator's post

    await this.removePostLike.removeLikesOnPostId(postIdValidated);
    await this.removeComment.removeAllCommentsOnPost(postIdValidated);
    await this.postsData.deletePost(postIdValidated);
    if (post.attachment) {
      await this.deleteAttachmentFile.delete(post.attachment.attachmentId);
    }
  }
}

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["buildArticleEntity", "buildCommentsJson"] }] */
const CommentModel = require('../../models/comment');

class Comment {
  parse(commentRaw, video_source_identifier) {
    commentRaw.video_source_identifier = video_source_identifier;
    const videoComment = new CommentModel(commentRaw);
    this.parseReplies(commentRaw?.replies, videoComment);
    videoComment.save();
  }

  parseReplies(repliesRaw, parentComment) {
    repliesRaw.forEach((reply) => {
      reply.parent_source_identifier = parentComment.source_identifier;
      reply.video_source_identifier = parentComment.video_source_identifier;
      const replyComment = new CommentModel(reply);
      replyComment.save();
      if (reply.replies) this.parseReplies(reply.replies, replyComment);
    });
  }
}

module.exports = Comment;

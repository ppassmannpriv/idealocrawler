/* eslint-disable no-param-reassign */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["buildArticleEntity", "buildCommentsJson"] }] */
const CommentModel = require('../../models/comment');
const User = require('../../models/user');

class Comment {
  // eslint-disable-next-line camelcase
  parse(commentRaw, video_source_identifier) {
    // eslint-disable-next-line camelcase
    commentRaw.video_source_identifier = video_source_identifier;
    const userIdentifierRegex = /profil\/(?<user_identifier>\d+)\D/;
    const extractedUserId = userIdentifierRegex.exec(commentRaw?.title?.href)?.groups?.user_identifier;
    commentRaw.user_source_identifier = commentRaw.userId ?? extractedUserId;
    const videoComment = new CommentModel(commentRaw);

    const commentUser = new User({
      name: commentRaw.title?.nick ?? commentRaw.avatar?.title,
      url: commentRaw.title?.href ?? commentRaw.avatar?.href,
      source_identifier: commentRaw.user_source_identifier,
      updated_at: Date.now(),
      created_at: Date.now(),
    });
    commentUser.save();

    if (commentRaw?.replies) this.parseReplies(commentRaw?.replies, videoComment);
    videoComment.save();
  }

  parseReplies(repliesRaw, parentComment) {
    repliesRaw.forEach((reply) => {
      reply.parent_source_identifier = parentComment.source_identifier;
      reply.video_source_identifier = parentComment.video_source_identifier;
      const userIdentifierRegex = /profil\/(?<user_identifier>\d+)\D/;
      const extractedUserId = userIdentifierRegex.exec(reply?.title?.href)?.groups?.user_identifier;
      reply.user_source_identifier = reply.userId ?? extractedUserId;

      const commentUser = new User({
        name: (reply.title?.nick ?? reply.avatar?.title).replace('Antwort von ', ''),
        url: reply.title?.href ?? reply.avatar?.href,
        source_identifier: reply.user_source_identifier,
        updated_at: Date.now(),
        created_at: Date.now(),
      });
      commentUser.save();

      const replyComment = new CommentModel(reply);
      replyComment.save();
      if (reply.replies) this.parseReplies(reply.replies, replyComment);
    });
  }
}

module.exports = Comment;

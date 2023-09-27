/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const Model = require('./model');

class Comment extends Model {
  constructor(commentRaw) {
    const cleanedRaw = {
      source_identifier: commentRaw.commentId,
      content: commentRaw.comment?.text,
      parent_source_identifier: commentRaw?.parent_source_identifier,
      user_source_identifier: commentRaw.user_source_identifier,
      video_source_identifier: commentRaw.video_source_identifier,
      created_at: Date.now(),
      updated_at: Date.now(),
      raw: JSON.stringify(commentRaw),
    };
    super(cleanedRaw);
  }

  ignoreOnConflict() {
    return 'unique_id';
  }
}

module.exports = Comment;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const Model = require('./model');

class Comment extends Model {
  ignoreOnConflict() {
    return 'unique_id';
  }
}

module.exports = Comment;

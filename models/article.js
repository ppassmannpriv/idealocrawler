/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const Model = require('./model');

class Article extends Model {
  ignoreOnConflict() {
    return 'unique_id';
  }
}

module.exports = Article;

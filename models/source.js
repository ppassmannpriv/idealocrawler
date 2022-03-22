/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const Model = require('./model');

class Source extends Model {
  ignoreOnConflict() {
    return 'slug';
  }
}

module.exports = Source;

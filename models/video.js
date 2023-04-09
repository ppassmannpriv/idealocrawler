/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const Model = require('./model');

class Video extends Model {
  constructor(videoRaw) {
    const cleanedRaw = {
      source: videoRaw.source,
      source_identifier: videoRaw.source_identifier,
      raw: videoRaw.raw,
      url: videoRaw.url,
      created_at: videoRaw.created_at,
      updated_at: videoRaw.updated_at,
    };
    super(cleanedRaw);
  }

  ignoreOnConflict() {
    return 'unique_id';
  }
}

module.exports = Video;

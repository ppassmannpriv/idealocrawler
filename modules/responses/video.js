/* eslint class-methods-use-this: ["error", { "exceptMethods": ["buildArticleEntity", "buildCommentsJson"] }] */

class Video {
  async parse(response) {
    const html = await response.text();
    const comments = this.buildCommentsJson(html);
    const videoIdentifierRegex = /videos\/(?<video_identifier>\d+)\D/;
    // eslint-disable-next-line camelcase
    const source_identifier = videoIdentifierRegex.exec(html)?.groups?.video_identifier;
    return {
      source: 1,
      comments,
      source_identifier,
      raw: JSON.stringify({ html }),
      url: response.url(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  buildCommentsJson(html) {
    let json = null;
    try {
      const jsonRegex = /"comments".*"items":(?<comments>.*),"actionToComment":/gmui;
      json = JSON.parse(jsonRegex.exec(html)?.groups?.comments);
    } catch (error) {
      json = [{
        headline: null,
        url: null,
        error,
        noteFromDev: 'We should investigate, but we are lazy. And drunk. Mostly drunk.',
      }];
      global.utils.error(error);
    }

    return json;
  }
}

module.exports = Video;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["buildArticleEntity", "buildCommentsJson"] }] */

class Video {
  async parse(response) {
    const html = await response.text();
    const comments = this.buildCommentsJson(html);
    return {
      source: 1,
      comments,
      raw: comments,
      url: response.url(),
    };
  }

  buildCommentsJson(html) {
    let json = null;
    try {
      const jsonRegex = /"items":(?<comments>.*),"actionToComment":/gmui;
      json = JSON.parse(html.match(jsonRegex)?.groups?.comments);
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

// eslint-disable-next-line max-len
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getRssLinks", "getResortLinks"] }] */
const cheerio = require('cheerio');

class Root {
  async parse(response) {
    const html = await response.text();

    return { html };
  }
}

module.exports = Root;

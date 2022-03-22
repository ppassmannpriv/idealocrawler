// eslint-disable-next-line max-len
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getRssLinks", "getResortLinks"] }] */
const cheerio = require('cheerio');

class Root {
  async parse(response) {
    const html = await response.text();
    const rssLinks = this.getRssLinks(html);
    const resortLinks = this.getResortLinks(html);

    return { rssLinks, resortLinks };
  }

  getRssLinks(html) {
    const regex = /"(?<rsslink>[^"]*.rss)"/g;
    return html.match(regex).map((element) => element.replace('"', '').replace('"', ''));
  }

  getResortLinks(html) {
    const page = cheerio.load(html);
    if (page) {
      const links = [];
      page('.swiper-slide a').each((index, element) => {
        links.push(page(element).attr('href'));
      });
      return links;
    }
    return [];
  }
}

module.exports = Root;

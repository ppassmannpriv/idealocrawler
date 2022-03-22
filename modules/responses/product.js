/* eslint class-methods-use-this: ["error", { "exceptMethods": ["buildArticleEntity"] }] */
const cheerio = require('cheerio');

class Product {
  async parse(response) {
    const html = await response.text();
    const article = this.buildArticleEntity(html);
    return article;
  }

  buildArticleEntity(html) {
    let ldJson = null;
    try {
      const ldJsonRegex = /<script\stype="application\/ld\+json">(?<jsonContent>.+?)<\/script>/ius;
      ldJson = JSON.parse(html.match(ldJsonRegex)?.groups?.jsonContent);
    } catch (error) {
      ldJson = [{
        headline: null,
        url: null,
        error,
        noteFromDev: 'We should investigate, but we are lazy. And drunk. Mostly drunk.',
      }];
      global.utils.error(error);
    }

    const regex = /<main[^>]*>.*<article[^>]*>(?<article>.*)<\/article>/ius;
    const articleBody = regex.exec(html)?.groups?.article;
    let articleNode = null;
    if (articleBody) articleNode = cheerio.load(articleBody);
    const article = {
      title: ldJson[0]?.headline,
      content: articleNode ? articleNode('div section .word-wrap.RichText p').text() : null,
      url: ldJson[0]?.url,
      raw: ldJson[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    article.raw = JSON.stringify(article);

    return article;
  }
}

module.exports = Product;

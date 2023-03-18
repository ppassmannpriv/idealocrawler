/* eslint class-methods-use-this: ["error", { "exceptMethods": ["extractLinks", "extractPrevLink"] }] */

class Category {
  async parse(response) {
    const html = await response.text();
    const videoLinks = this.extractLinks(html);
    const nextPage = this.extractPagination(html);
    const followingCategoryPage = nextPage;

    return { videoLinks, followingCategoryPage };
  }

  extractPagination(html) {
    const regex = /pagination.+?defaultRoute.+?(?<defaultRoute>\/profil[^\$]*)\$.+?activePage\D+?(?<active>\d).+?count\D+?(?<count>\d)/gmxui;
    const pagination = regex.exec(html)?.groups;
    if (pagination?.active < pagination?.count) {
      return pagination.defaultRoute + (parseInt(pagination.active, 10) + 1);
    }
    return null;
  }

  extractLinks(html) {
    const regex = /videos.+?(clickAction.+?href":"(?<videoHref>[^"]*?)")/gmxui;
    const prevLink = regex.exec(html)?.groups?.prev;

    return prevLink;
  }
}

module.exports = Category;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["extractLinks", "extractPrevLink"] }] */

class Profile {
  async parse(response) {
    const html = await response.text();
    const videoLinks = this.extractLinks(html);
    const nextPage = this.extractPagination(html);
    const followingProfilePage = nextPage;

    return { videoLinks, followingProfilePage };
  }

  extractPagination(html) {
    const regex = /pagination.+?defaultRoute.+?(?<defaultRoute>\/profil[^\$]*)\$.+?activePage\D+?(?<active>\d).+?count\D+?(?<count>\d)/gmui;
    const pagination = regex.exec(html)?.groups;
    if (pagination?.active < pagination?.count) {
      return pagination.defaultRoute + (parseInt(pagination.active, 10) + 1);
    }
    return null;
  }

  extractLinks(html) {
    const regex = /videos.+?(clickAction.+?href":"(?<videoHref>[^"]*?)")/gmui;
    const prevLink = regex.exec(html)?.groups?.prev;

    return prevLink;
  }
}

module.exports = Profile;

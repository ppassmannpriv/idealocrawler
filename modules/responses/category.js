/* eslint class-methods-use-this: ["error", { "exceptMethods": ["extractLinks", "extractPrevLink"] }] */

class Category {
  async parse(response) {
    const json = await response.json();
    const productLinks = this.extractLinks(json);
    const followingCategoryPage = json.categoryPagination.nextPageAjaxLink;

    return { productLinks, followingCategoryPage };
  }

  extractLinks(json) {
    const links = json.categoryJsonResults.entries.map((entry) => entry.link.productLink.href);

    return links;
  }

  extractPrevLink(html) {
    const regex = /<link[^>]+?rel="prev"[^>]+?href="(?<prev>[^"]+?)"[^>]*>/iusg;
    const prevLink = regex.exec(html)?.groups?.prev;

    return prevLink;
  }
}

module.exports = Category;

const Root = require('./responses/root');
const Category = require('./responses/category');
const Video = require('./responses/video');

class Response {
  constructor(type, puppeteerResponse) {
    this.classMap = {
      root: new Root(),
      category: new Category(),
      video: new Video(),
    };
    this.type = type;
    this.response = puppeteerResponse;
    this.class = this.classMap[type];
  }

  async parse() {
    return this.class.parse(this.response);
  }
}

module.exports = Response;

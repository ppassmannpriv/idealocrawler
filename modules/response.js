const Root = require('./responses/root');
const Profile = require('./responses/profile');
const Video = require('./responses/video');

class Response {
  constructor(type, puppeteerResponse) {
    this.classMap = {
      root: new Root(),
      profile: new Profile(),
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

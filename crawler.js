require('dotenv').config();
const yargs = require('yargs');

yargs.usage('Usage $0 <command> [options]')
  .command('site', 'Crawl a complete news site.')
  .example('$0 site -s sitename -l')
  .alias('s', 'sitename')
  .alias('l', 'headful')
  .describe('l', 'Run headful mode (loud mode)');

// INIT CRAWLER
const Utils = require('./modules/utils');

global.utils = new Utils();
global.utils.log('Crawler started!');

// INIT QUEUE
const Queue = require('./modules/queue');

const queue = new Queue();
queue.eventEmitter.on('queueEndReached', async () => {
  await global.utils.stopCrawl();
});

// INIT RESPONSE
const Response = require('./modules/response');
const C = require('./modules/responses/comment');

const Comment = new C();

// INIT PERSISTENCE
// const Article = require('./models/article');

// dump dump dump / debugging zone
(async () => {
  await queue.init();
  await queue.enqueue('https://de.mydirtyhobby.com/profil/119287782-Emmi-Hill/videos/mostseen', 'profile');
})();

// INIT BROWSER
const Browser = require('./modules/browser');
const Video = require('./models/video');

const browser = new Browser();
browser.initialize().then(async () => {
  browser.fetchContent(await queue.next()).catch((error) => global.utils.error(error));
});

browser.fetchEventEmitter.on('responseRecieved', async (data) => {
  const response = new Response(data.request.type, data.response);
  const responseData = await response.parse();

  // if (data.request.type === 'root') {
  // }
  if (responseData && data.request.type === 'profile') {
    if (responseData.followingProfilePage) await queue.enqueue(responseData.followingProfilePage, 'profile');
    responseData.videoLinks.forEach(async (link) => {
      await queue.enqueue(`https://de.mydirtyhobby.com${link.split('\\').join('')}`, 'video');
    });
  }
  if (responseData && data.request.type === 'video') {
    const video = new Video(responseData);
    video.save();
    video?.comments.forEach((comment) => {
      Comment.parse(comment, video.source_identifier);
    });
  }
  await global.utils.delay(10000);
  browser.fetchContent(await queue.next()).catch((error) => global.utils.error(error));
});

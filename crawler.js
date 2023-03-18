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

// INIT PERSISTENCE
// const Article = require('./models/article');

// dump dump dump / debugging zone
(async () => {
  await queue.init();
  await queue.enqueue('https://de.mydirtyhobby.com/profil/119287782-Emmi-Hill/videos/mostseen', 'category');
  // await queue.enqueue('https://www.spiegel.de', 'root');
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

  if (data.request.type === 'root') {
  }
  if (responseData && data.request.type === 'category') {
    if (responseData.followingCategoryPage) await queue.enqueue(responseData.followingCategoryPage, 'category');
    responseData.videoLinks.forEach(async (link) => {
      await queue.enqueue(link, 'video');
    });
  }
  if (responseData && data.request.type === 'video') {
    const video = new Video(responseData);
    video.save();
  }

  browser.fetchContent(await queue.next()).catch((error) => global.utils.error(error));
});

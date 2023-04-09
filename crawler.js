require('dotenv').config();
const yargs = require('yargs');
const axios = require('axios');

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

const fetchAmateurs = (page = 1) => axios.post('https://de.mydirtyhobby.com/content/api/amateurs', {
  country: 'de', user_language: 'de', listing: 'user_list', pageSize: 36, countries: ['de'], page,
}, {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Connection: 'keep-alive',
  },
});

// INIT CRAWL
(async () => {
  await queue.init();
  await queue.enqueue('https://de.mydirtyhobby.com/profil/12664141-Bonnie-Stylez/videos/mostseen', 'profile');
  // await queue.enqueue('https://de.mydirtyhobby.com/profil/2543238-Julia-Jones/videos/mostseen', 'profile');
  // await queue.enqueue('https://de.mydirtyhobby.com/profil/28883421-LunaLove-/videos/mostseen', 'profile');
  // await queue.enqueue('https://de.mydirtyhobby.com/profil/9615891-FariBanx/videos/mostseen', 'profile');
  // await queue.enqueue('https://de.mydirtyhobby.com/profil/4203686-KarinaHH/videos/mostseen', 'profile');
})();

const profileLinks = [];
fetchAmateurs().then((usersOnlineResult) => {
  if (usersOnlineResult?.data) {
    usersOnlineResult.data.items.forEach(async (profile) => {
      profileLinks.push(`https://de.mydirtyhobby.com/profil/${profile.u_id}-${profile.nick.replace(' ', '-')}/videos/mostseen`);
      await queue.enqueue(`https://de.mydirtyhobby.com/profil/${profile.u_id}-${profile.nick.replace(' ', '-')}/videos/mostseen`, 'profile');
    });

    for (let page = 1; page < usersOnlineResult.data.totalPages; page += 1) {
      fetchAmateurs(page).then((amateurResults) => {
        if (amateurResults?.data) {
          amateurResults.data.items.forEach(async (profile) => {
            profileLinks.push(`https://de.mydirtyhobby.com/profil/${profile.u_id}-${profile.nick.replace(' ', '-')}/videos/mostseen`);
            await queue.enqueue(`https://de.mydirtyhobby.com/profil/${profile.u_id}-${profile.nick.replace(' ', '-')}/videos/mostseen`, 'profile');
          });
        }
      });
    }
  }
});

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
    if (responseData.followingProfilePage) await queue.enqueue(`https://de.mydirtyhobby.com${responseData.followingProfilePage.split('\\').join('')}`, 'profile');
    responseData.videoLinks.forEach(async (link) => {
      await queue.enqueue(`https://de.mydirtyhobby.com${link.split('\\').join('')}`, 'video');
    });
  }
  if (responseData && data.request.type === 'video') {
    const video = new Video(responseData);
    video.save();
    responseData?.comments.forEach((comment) => {
      Comment.parse(comment, video.source_identifier);
    });
  }
  await global.utils.delay(10000);
  browser.fetchContent(await queue.next()).catch((error) => global.utils.error(error));
});

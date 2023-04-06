const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const events = require('events');
const { EventEmitter } = require('events');

global.requestCounter = 0;
/**
 * Puppeteer configs
 */
puppeteer.use(StealthPlugin());

/**
 * Node.js voodoo magic for eventemitter warnings.
 */
// eslint-disable-next-line no-underscore-dangle
events.EventEmitter.prototype._maxListeners = 0;
events.defaultMaxListeners = 0;

class Browser {
  constructor() {
    this.cacheKey = 'default';
    this.puppeteerCache = [];
    this.puppeteerCacheLastUse = [];
    this.fetchEventEmitter = new EventEmitter();
    this.instance = null;
  }

  async initialize() {
    const puppeteerInstance = await this.buildPuppeteerInstance();
    this.instance = puppeteerInstance;
  }

  static getUserAgent() {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
  }

  async getPuppeteer() {
    if (this.puppeteerCache[this.cacheKey]) {
      this.puppeteerCacheLastUse[this.cacheKey] = (new Date()).getTime();
      return this.puppeteerCache[this.cacheKey];
    }
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--no-zygote',
      '--disable-features=IsolateOrigins,site-per-process',
      '--single-process',
    ];
    // args.push('--proxy-server=http://127.0.0.1:' + global.carouselPort);
    const headless = false;
    return puppeteer.launch({ headless, args });
  }

  async buildPuppeteerInstance() {
    const browser = await this.getPuppeteer();
    let page = null;
    if (browser) {
      page = await browser.newPage();
      await page.setUserAgent(Browser.getUserAgent());
      await page.setViewport({
        width: Math.floor(Math.random() * 950 + 560),
        height: Math.floor(700 + Math.random() * 520),
      });
      page.setDefaultNavigationTimeout(0);
      // eslint-disable-next-line no-underscore-dangle
      await page._client.send('Network.enable', {
        maxResourceBufferSize: 1024 * 1204 * 100,
        maxTotalBufferSize: 1024 * 1204 * 200,
      });
      /**
       * Only accept the html for now
       */
      page.setRequestInterception(true);
      page.on('request', async (request) => {
        const allowedTypes = [
          'document',
        ];
        if (allowedTypes.includes(request.resourceType())) {
          request.continue();
        } else {
          request.abort();
        }
      });

      return { browser, page };
    }

    return null;
  }

  async fetchContent(request) {
    try {
      const response = await this.instance.page.goto(request.url, { waitUntil: 'networkidle0' });
      const responseStatus = response.status();
      if (responseStatus === 403) {
        await global.utils.delay(Math.floor(Math.random() * 500));
        // await updateLock();
        // eslint-disable-next-line no-plusplus
        global.blockedCounter++;
        const delay = Math.floor(Math.random() * 2000);
        global.utils.logRequestError(`HTTP: 403 ${request.url} Delay: ${delay}`);

        await global.utils.delay(delay);
        if (global.blockedCounter > 4) {
          global.utils.logInfo('Restarting browser.');
          this.instance.browser.emit('restartBrowser', request);
        } else {
          this.instance.browser.emit('blockedRequest', request);
        }
        await global.utils.delay(Math.floor(Math.random() * 2500));
      }
      if (responseStatus === 200) {
        this.fetchEventEmitter.emit('responseRecieved', { request, response });
      }
      if (responseStatus === 404) {
        this.instance.browser.emit('pageNotFound');
        global.utils.logInfo('Request resulted in 404 - Page not found.');
      }
    } catch (error) {
      global.utils.log(`${global.requestCounter} EXCEPTION: ${error.message}`);
      // global.utils.haltOnError(error);
    } finally {
      // await this.instance.browser.close();
    }
  }

  async closeInstance() {
    await this.instance.browser.close();
  }
}

module.exports = Browser;

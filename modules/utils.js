/* eslint-disable class-methods-use-this */
const fs = require('fs');

class Utils {
  constructor() {
    this.fileName = 'general.log';
    // @TODO: a logging file should be created and development env should log to shell aswell
  }

  makeTimestamp() {
    const date = new Date();
    return `[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]`;
  }

  /**
     * Custom logging function
     * @param str
     */
  log(str) {
    /* eslint-disable-next-line no-console */
    console.log(`${this.makeTimestamp()} ${str}`);
  }

  error(error) {
    /* eslint-disable-next-line no-console */
    console.error(`${this.makeTimestamp()} ${error.message}`);
  }

  /**
     * Delay to mimic some human-ness
     * @param time
     * @returns {Promise<void>}
     */
  delay(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  /**
     * Get (and make) directory for JSON files.
     * @returns {*}
     */
  getDir(path = '') {
    const now = new Date();
    const dir = `crawled-data/${now.toJSON().split('T')[0]}/${path}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
     * Whitelist error messages
     * @param errorMessage
     * @returns {*}
     */
  isErrorMessageInWhitelist(errorMessage) {
    return (errorMessage.includes('ERR_CONNECTION_CLOSED')
      || errorMessage.includes('ERR_EMPTY_RESPONSE')
      || errorMessage.includes('ERR_TUNNEL_CONNECTION_FAILED')
      || errorMessage.includes('ERR_ABORTED')
      || errorMessage.includes('Invalid parameters url: string value expected')
    );
  }

  async haltOnError(error) {
    this.log(error);
    if (error.message && this.isErrorMessageInWhitelist(error.message)) {
      // do something
    } else {
      try {
        this.releaseLock();
      } catch (err) {
        this.log(err);
      }
      process.exit(1);
    }
  }

  async stopCrawl() {
    this.log('Stopping crawl!');
    try {
      this.releaseLock();
    } catch (err) {
      this.log(err);
    }
    process.exit(1);
  }

  /**
     * Release the lock file.
     * @returns {boolean}
     */
  releaseLock() {
    if (fs.existsSync(global.lockFile)) {
      fs.unlinkSync(global.lockFile);
      this.log('Lock released');
      return true;
    }

    throw new Error('LOCK ALREADY GONE! What is happening? Mom, come pick me up. I am scared.');
  }
}

module.exports = Utils;

/* eslint-disable class-methods-use-this */
const redis = require('redis');
const { EventEmitter } = require('events');

class Queue {
  constructor() {
    this.requests = [];
    this.requestPointer = null;
    this.eventEmitter = new EventEmitter();
  }

  async init() {
    const redisClient = await this.createRedisConnection();
    this.redisClient = redisClient;
    await this.redisClient.del('queue');
  }

  async createRedisConnection() {
    const redisClient = redis.createClient({
      url: process.env.REDISHOST,
      post: '39072',
      password: process.env.REDISPASSWORD,
    });
    redisClient.on('error', (err) => global.utils.log('Redis Client Error', err));
    await redisClient.connect();

    return redisClient;
  }

  async enqueue(url, type) {
    if (this.isValidHttpUrl(url)) {
      if (!this.requests.find((request) => request.url === url)) {
        global.utils.log(`Enqueing: ${type} - ${url}`);
        // this.requests.push({ url, type });
        await this.redisClient.lRem('queue', 0, JSON.stringify({ url, type }));
        await this.redisClient.lPush('queue', JSON.stringify({ url, type }));
      }
    }
  }

  async next() {
    this.requestPointer = this.requestPointer !== null ? this.requestPointer + 1 : 0;
    const currentRequest = await this.getCurrentRequest();
    if (currentRequest === null) this.eventEmitter.emit('queueEndReached');

    return JSON.parse(currentRequest);
  }

  async getCurrentRequest() {
    return this.redisClient.rPop('queue');
    // return this.requests[this.requestPointer] ?? null;
  }

  removeRequest(requestPointer) {
    delete this.requests[requestPointer];
    this.requests = this.requests.filter((request) => request !== undefined);
  }

  isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (error) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }
}

module.exports = Queue;

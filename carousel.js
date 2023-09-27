const path = require('path');
const ProxyChain = require('proxy-chain');
const utils = require('./modules/utils');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const buildUser = () => `${process.env.PROXY_USER}-session-rand${Math.floor(Math.random() * 100000)}`;
const renewProxy = () => `http://${buildUser()}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`;
let proxy = renewProxy();

module.exports.forceRenewProxy = () => {
  proxy = renewProxy();
  utils.log(global.store, `Proxy was renewed: ${proxy}`);
};

module.exports.initServer = (port) => {
  const server = new ProxyChain.Server({
    port,
    verbose: false,
    prepareRequestFunction: () => {
      utils.log(global.store, `Prepared request with proxy: ${proxy}`);
      return {
        upstreamProxyUrl: proxy,
      };
    },
  });
  server.listen(() => {
    utils.log(global.store, `Proxy server is listening on port ${server.port}`);
  });

  server.on('requestFailed', ({ request, error }) => {
    utils.log(`HTTP: ${request.status} ${request.url}`);
    utils.error(error);
  }).catch((error) => {
    utils.error(error);
  });
};

module.exports = {
  apps: [{
    name: 'SPON Crawler',
    script: './crawler.js',
    node_args: '--max-old-space-size=4096',
    args: 'site -s spiegel.de',
  }],
};

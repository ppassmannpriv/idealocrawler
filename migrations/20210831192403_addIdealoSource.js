exports.up = (knex) => knex('source').insert({
  name: 'idealo - Appliances',
  url: 'https://www.idealo.de/',
  crawl: true,
});

exports.down = (knex) => knex('source').where('name', 'idealo - Appliances').del();

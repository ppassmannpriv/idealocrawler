exports.up = (knex) => knex('source').insert({
  name: 'MyDirtyHobby',
  url: 'https://de.mydirtyhobby.com/',
  crawl: true,
});

exports.down = (knex) => knex('source').where('name', 'MyDirtyHobby').del();

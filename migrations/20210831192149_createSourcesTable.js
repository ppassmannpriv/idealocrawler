exports.up = (knex) => knex.schema
  .createTable('source', (table) => {
    table.increments('id');
    table.string('name');
    table.string('url');
    table.boolean('crawl');
  });

exports.down = (knex) => knex.schema
  .dropTable('source');

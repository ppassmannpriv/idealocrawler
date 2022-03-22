exports.up = (knex) => knex.schema
  .createTable('article', (table) => {
    table.bigIncrements('id');
    table.integer('source');
    table.string('unique_id').unique().notNullable();
    table.index('unique_id');
    table.string('title');
    table.text('content', 'longtext');
    table.string('url');
    table.json('raw');
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('article');

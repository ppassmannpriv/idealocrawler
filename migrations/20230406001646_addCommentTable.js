exports.up = (knex) => knex.schema
  .createTable('comment', (table) => {
    table.bigIncrements('id');
    table.bigInteger('user_id');
    table.string('unique_id').unique().notNullable();
    table.index('unique_id');
    table.text('content', 'longtext');
    table.string('url');
    table.json('raw');
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('comment');

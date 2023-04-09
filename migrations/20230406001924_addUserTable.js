exports.up = (knex) => knex.schema
  .createTable('user', (table) => {
    table.bigIncrements('id');
    table.string('source_identifier');
    table.string('name');
    table.string('url');
    table.json('raw');
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('user');

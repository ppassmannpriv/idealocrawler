exports.up = (knex) => knex.schema
  .createTable('user', (table) => {
    table.bigIncrements('id');
    table.string('unique_id').unique().notNullable();
    table.index('unique_id');
    table.string('source_identifier');
    table.string('name');
    table.string('url').unique().notNullable();
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('user');

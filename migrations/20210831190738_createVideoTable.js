exports.up = (knex) => knex.schema
  .createTable('video', (table) => {
    table.bigIncrements('id');
    table.integer('source');
    table.string('source_identifier').notNullable();
    table.string('unique_id').unique().notNullable();
    table.index('unique_id');
    table.string('url').unique().notNullable();
    table.json('raw');
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('video');

exports.up = (knex) => knex.schema
  .createTable('comment', (table) => {
    table.bigIncrements('id');
    table.string('user_source_identifier');
    table.string('source_identifier');
    table.string('parent_source_identifier');
    table.string('video_source_identifier');
    table.string('unique_id').unique().notNullable();
    table.index('unique_id');
    table.text('content', 'longtext');
    table.json('raw');
    table.timestamps();
  });

exports.down = (knex) => knex.schema
  .dropTable('comment');

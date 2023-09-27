/* eslint class-methods-use-this: ["error", { "exceptMethods": ["ignoreOnConflict"] }] */
const hash = require('object-hash');
const DB = require('../modules/database');

class Model {
  constructor(entity) {
    Object.assign(this, entity);
    const exclude = new Set(['created_at', 'updated_at', 'raw']);
    const cleanedEntity = Object.fromEntries(Object.entries(this).filter((e) => !exclude.has(e[0])));
    this.unique_id = hash(cleanedEntity);
  }

  save() {
    const tableName = this.constructor.name.toLowerCase();
    DB(`${tableName}`)
      .insert(this)
      .onConflict(this.ignoreOnConflict())
      .ignore()
      .then(async () => {
        global.utils.log(`${this.constructor.name} stored! - unique_id: ${this.unique_id}`);
      })
      .catch((error) => global.utils.error(error));
  }

  ignoreOnConflict() {
    return null;
  }
}

module.exports = Model;

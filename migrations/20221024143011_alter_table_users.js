/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex, Promise) {
  /*
  return knex.schema.alterTable('users', table=>{
    table.integer('levelId').defaultTo(1)
    table.foreign('levelId').references('id').inTable('level')
  })*/
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex, Promise) {
  /*return knex.schema.alterTable('users', table=>{
    table.dropColumn('levelId')
  })*/
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.alterTable('menu', table=>{
      table.string('text')
      table.string('pageRoute')
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex, Promise) {
    return knex.schema.alterTable('menu', table=>{
      table.dropColumn('text')
      table.dropColumn('pageRoute')
    })
  };
  
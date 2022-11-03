/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.createTable('permission', table=>{
        table.increments('id').primary()
        table.integer('levelId')
        table.foreign('levelId').references('id').inTable('level')
        table.integer('menuId')
        table.foreign('menuId').references('id').inTable('menu')
      })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex.schema.dropTable('permission')
};

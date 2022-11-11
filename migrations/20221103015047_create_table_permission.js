/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.createTable('levelPermission', table=>{
        table.increments('id').primary()
        table.integer('levelId').defaultTo(1)
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
    return knex.schema.dropTable('levelPermission')
};

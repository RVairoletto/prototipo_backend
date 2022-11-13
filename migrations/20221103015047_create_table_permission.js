/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.createTable('levelpermission', table=>{
        table.increments('id').primary()
        table.integer('levelid').defaultTo(1)
        table.foreign('levelid').references('id').inTable('level')
        table.integer('menuid')
        table.foreign('menuid').references('id').inTable('menu')
      })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex.schema.dropTable('levelpermission')
};

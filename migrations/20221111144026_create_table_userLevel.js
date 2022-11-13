/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.createTable('userlevel', table=>{
        table.increments('id').primary()
        table.integer('levelid')
        table.foreign('levelid').references('id').inTable('level')
        table.integer('userid')
        table.foreign('userid').references('id').inTable('users')
      })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userlevel')
};

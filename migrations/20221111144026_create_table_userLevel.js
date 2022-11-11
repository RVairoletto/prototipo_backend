/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex.schema.createTable('userLevel', table=>{
        table.increments('id').primary()
        table.integer('levelId')
        table.foreign('levelId').references('id').inTable('level')
        table.integer('userId')
        table.foreign('userId').references('id').inTable('users')
      })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userLevel')
};

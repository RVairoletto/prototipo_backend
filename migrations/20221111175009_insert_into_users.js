/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex('users').insert({
         name :"admin",
         email:"admin@email.com",
         password:"admin1234",
         admin:true,
         id:1
        }
    )
    
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex('users')
        .where({'users.email':'admin@email.com'})
        .del()
};

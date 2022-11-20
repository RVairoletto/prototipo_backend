/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex('levelpermission').insert({
            menuid: 1,levelid: 1},
            { menuid: 2,levelid: 1},
            { menuid: 3,levelid: 1},
            { menuid: 4,levelid: 1},
            { menuid: 5,levelid: 1},
            { menuid: 6,levelid: 1}   
    )
    
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex('levelpermission')
        .where({'levelpermission.levelid':1})
        .del()
};

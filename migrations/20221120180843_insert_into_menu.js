/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex('menu').insert([{
            id: 1,description:"homepage" , text:"Home", pageroute:"/homePage"},
            { id: 2,description:"usuarios" , text:"Usuários", pageroute:"/usuarios"},
            { id: 3,description:"niveisacesso" , text:"Níveis de Acesso", pageroute:"/niveisAcesso"},
            { id: 4,description:"professores" , text:"Professores", pageroute:"/professores"},
            { id: 5,description:"disciplinas" , text:"Disciplinas", pageroute:"/disciplinas"},
            { id: 6,description:"alterarsenha" , text:"Alterar Senha", pageroute:"/alterarSenha"}]  
    )
    
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex, Promise) {
    return knex('menu')
        .where({'menu.id':1,'menu.id':2,'menu.id':3,'menu.id':4,'menu.id':5,'menu.id':6})
        .del()
};

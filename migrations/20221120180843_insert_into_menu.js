/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex, Promise) {
    return knex('menu').insert([{
            description:"homepage" , text:"Home", pageroute:"/homePage"},
            { description:"usuarios" , text:"Usuários", pageroute:"/usuarios"},
            { description:"niveisacesso" , text:"Níveis de Acesso", pageroute:"/niveisAcesso"},
            { description:"professores" , text:"Professores", pageroute:"/professores"},
            { description:"disciplinas" , text:"Disciplinas", pageroute:"/disciplinas"},
            { description:"alterarsenha" , text:"Alterar Senha", pageroute:"/alterarSenha"}]  
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

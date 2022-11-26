// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  /*development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },*/

  /*staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },*/

    //Config do banco de dados
  
    client: 'postgresql',
    connection: {
      database: 'projeto_ponto_docente',
      user:     'postgres',
      password: '123456789'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  

};

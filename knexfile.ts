/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'nestjs-typescript',
    },
  },
};

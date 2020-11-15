const env = {
    database: 'connect_test',
    username: 'root',
    password: 'rebbit11028',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  module.exports = env;

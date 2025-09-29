// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }



// config/config.js
require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'theatgg6_shg',
  password: process.env.DB_PASS || 'r3pbWhs8psb5nitZjlpDvg',
  database: process.env.DB_NAME || 'theatgg6_testnode',
  host: process.env.DB_HOST || '162.241.123.158',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: false
};

module.exports = {
  development: { ...base },
  test:        { ...base, database: (process.env.DB_NAME || 'theatgg6_testnode') + '_test' },
  production:  { ...base }
};

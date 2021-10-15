const { Pool } = require('pg');
const Keys = require('./keys');

const pool = new Pool({
  user: process.env.user || Keys.user,
  host: process.env.host || Keys.host,
  database: process.env.database || Keys.database,
  password: process.env.password || Keys.password,
  port: process.env.dbPort || Keys.port,
});

module.exports = {
  pool,
};

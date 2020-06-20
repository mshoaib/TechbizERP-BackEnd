const { createPool } = require('mysql2');

const pool = createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'techbiz_ebs',
  port: '3306'
});

module.exports = pool;

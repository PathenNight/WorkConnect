const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'workConnect',
    password: process.env.DB_PASSWORD || '9Zt#Q1p@',
    database: process.env.DB_NAME || 'WorkConnectDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = pool;

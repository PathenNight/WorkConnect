const mysql = require('mysql2/promise');

async function createConnection() {
    return mysql.createConnection({
        host: '127.0.0.1',
        user: 'workConnect',
        password: '9Zt#Q1p@',
        database: 'WorkConnectDB',
    });
}

module.exports = createConnection;

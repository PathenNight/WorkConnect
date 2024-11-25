const mysql = require('mysql2/promise');

// Function to create a database connection
async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',         // Database host (use localhost or IP)
            user: 'root',       // Database username
            password: 'password',      // Database password
            database: 'WorkConnectDB', // Database name
        });
        console.log('Database connection established successfully.');
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

// Export the createConnection function for use in other files
module.exports = createConnection;

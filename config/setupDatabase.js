const createConnection = require('./db');

async function createTables() {
    const connection = await createConnection();

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'admin',
            resetToken VARCHAR(255),
            resetTokenExpiry DATETIME
        )
    `;
    
    const createGroupsTable = `
        CREATE TABLE IF NOT EXISTS UserGroups (
            id INT AUTO_INCREMENT PRIMARY KEY,
            groupName VARCHAR(255) NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await connection.query(createUsersTable);
        await connection.query(createGroupsTable);
        console.log('Users and UserGroups tables created or already exist.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await connection.end(); // Close the connection
    }
}

// Call function to create tables
createTables();

module.exports = createTables;

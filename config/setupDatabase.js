const createConnection = require('./db');

async function createTables() {
    const connection = await createConnection();

    try {
        // Adjusted Users table creation
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                role VARCHAR(50),
                resetToken VARCHAR(255),
                resetTokenExpired TIMESTAMP
            )
        `);

        // Adjusted Groups table (escaped the table name 'groups' with backticks)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`groups\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                ownerId INT NOT NULL,
                FOREIGN KEY (ownerId) REFERENCES users(id)
            )
        `);

        // GroupRoles table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS grouproles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                groupId INT NOT NULL,
                userId INT NOT NULL,
                role VARCHAR(100) NOT NULL,
                FOREIGN KEY (groupId) REFERENCES \`groups\`(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);

        // Projects table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                projectID INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                deadline DATE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tasks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                taskID INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                projectID INT,
                deadline DATE,
                FOREIGN KEY (projectID) REFERENCES projects(projectID)
            )
        `);

        // UserGroups table (if this is still relevant)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usergroups (
                id INT AUTO_INCREMENT PRIMARY KEY,
                groupName VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // UserGroupsList table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usergroupslist (
                groupID INT AUTO_INCREMENT PRIMARY KEY,
                groupName VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Roles table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )
        `);

        // UserRoles table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS userroles (
                user_id INT NOT NULL,
                role_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (role_id) REFERENCES roles(id)
            )
        `);

        // Messages table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                messageID INT AUTO_INCREMENT PRIMARY KEY,
                senderID INT NOT NULL,
                recipientID INT NOT NULL,
                messageContents TEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (senderID) REFERENCES users(id),
                FOREIGN KEY (recipientID) REFERENCES users(id)
            )
        `);

        // RefreshTokens table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS refreshTokens (
                tokenID INT AUTO_INCREMENT PRIMARY KEY,
                userID INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expiresAt TIMESTAMP NOT NULL,
                FOREIGN KEY (userID) REFERENCES users(id)
            )
        `);

        console.log('All tables have been successfully created or already exist.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await connection.end(); // Close the connection
    }
}

// Call function to create tables
createTables();

module.exports = createTables;

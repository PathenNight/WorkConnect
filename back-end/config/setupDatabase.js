const createConnection = require('./db');

async function createTables() {
    const connection = await createConnection();

    try {
        console.log('Creating tables...');

        // Users table
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

        // Groups table
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

        // Calendar table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS calendar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_date DATE NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                event_description TEXT
            )
        `);

        console.log('All tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message, err.stack);
    } finally {
        await connection.end();
    }
}

module.exports = createTables;

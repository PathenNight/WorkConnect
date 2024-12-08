const mysql = require("mysql2/promise");

// Function to create a MySQL connection for querying db
async function createConnection() {
    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "workconnectdb",
        });
        console.log("Connected to the database!");
        return db;
    } catch (err) {
        console.error("Error connecting to database:", err);
        throw err;
    }
}

// Function to create the tables in the db if they do not already exist
async function createTables(db) {
    try{
        console.log("Checking Tables...");

        //array of all queries to db
        const queries = [
            `
            CREATE TABLE IF NOT EXISTS users (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                companyName VARCHAR(100) NOT NULL,
                role VARCHAR(50) NOT NULL,
                roleId INT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                securityQuestion1 VARCHAR(255),
                securityAnswer1 VARCHAR(255),
                securityQuestion2 VARCHAR(255),
                securityAnswer2 VARCHAR(255),
                securityQuestion3 VARCHAR(255),
                securityAnswer3 VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS companies (
                companyId INT AUTO_INCREMENT PRIMARY KEY,
                companyName VARCHAR(100) NOT NULL,
                companyIndustry VARCHAR(255) NOT NULL,
                companyAddress VARCHAR(255) NOT NULL,
                
                companyAdminEmail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS tasks (
                taskId INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                taskdate DATE NOT NULL,
                userId INT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId)
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS conversations (
                conversationId INT AUTO_INCREMENT PRIMARY KEY,
                userId1 INT,
                userId2 INT,
                username1 VARCHAR(100) NOT NULL,
                username2 VARCHAR(100) NOT NULL,
                email1 VARCHAR(100) NOT NULL,
                email2 VARCHAR(100) NOT NULL,
                firstname1 VARCHAR(255) NOT NULL,
                lastname1 VARCHAR(255) NOT NULL,
                firstname2 VARCHAR(255) NOT NULL,
                lastname2 VARCHAR(255) NOT NULL,
                companyName VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS messages (
                messageId INT AUTO_INCREMENT PRIMARY KEY,
                conversationId INT,
                senderId INT,
                recipientId INT,
                companyName VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversationId) REFERENCES conversations(conversationId)
                );
            `
        ];

        //This executes all table-creating queries in parallel and returns an error if
        //an error occurs.
        for (const query of queries) {
            await db.query(query); // Just await, no callback
        }

        console.log("Tables are up to date.");
    } catch (err) {
        console.error("Error creating tables:", err);
        throw err;
    }
}

module.exports = { createConnection, createTables };
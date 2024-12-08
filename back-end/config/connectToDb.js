const mysql = require("mysql");

// Function to create a MySQL connection for querying db
function createConnection() {

    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "workconnectdb",
        });

        db.connect((err) => {
            if (err) {
                console.error("Error connecting to database:", err);
                return;
            }
            console.log("Connected to the database!");
            resolve(db);
        });
    });
}

// Function to create the tables in the db if they do not already exist
function createTables(db) {
    return new Promise((resolve, reject) => {
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
            CREATE TABLE IF NOT EXISTS companyAdmins (
                companyId INT AUTO_INCREMENT PRIMARY KEY,
                companyName VARCHAR(100) NOT NULL,
                companyIndustry VARCHAR(255) NOT NULL,
                companyAdminEmail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS companyroles (
                userId INT NOT NULL,
                roleId INT NOT NULL,
                roleName VARCHAR(100) NOT NULL,
                companyId INT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(companyId),
                FOREIGN KEY (userId) REFERENCES users(userId)
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
            `
        ];

        //This executes all table-creating queries in parallel and returns an error if
        //an error occurs.
        Promise.all(
            queries.map((query) => {
                return new Promise((innerResolve, innerReject) => {
                    db.query(query, (err) => {
                        if (err) {
                            console.error("Error executing query:", query, err);
                            return innerReject(err);
                        }
                        innerResolve();
                    });
                });
            })
        )
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { createConnection, createTables };
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const {createConnection, createTables} = require("./config/connectToDb");
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
let db;

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.json());


/*This is the port that the server should run on. To send data from
a react component to the back-end, you have to include this port
number in your axios request. For example, if port number is 8080,
front-end request to the /login route would look like:

const response = await axios.post("http://localhost:8080/login", {
          Email: email,
          Password: password,
        });

        ^ sends Email and Password to backend /login route.
*/
const port = 8080;

(async () => {
    // Database connection setup
    db = await createConnection();

    try {
        await createTables(db); // Wait for tables to be created
    } catch (error) {
        console.error("Error creating tables:", error);
    }

    app.listen(port, () => {
        console.log("All tables present!")
        console.log("Server started on port " + port);
    });
})();


//Create routes
app.post("/create/user", async (req, res) => {
    const {
        Username, Password, Firstname, Lastname, Email,
        CompanyName, SecurityQuestion1, SecurityAnswer1,
        SecurityQuestion2, SecurityAnswer2, SecurityQuestion3, SecurityAnswer3
    } = req.body;

    if (!Username || !Password || !Firstname || !Lastname || !Email ||
        !CompanyName || !SecurityQuestion1 || !SecurityAnswer1 || !SecurityQuestion2 ||
        !SecurityAnswer2 || !SecurityQuestion3 || !SecurityAnswer3) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const checkCompanyNameSQL = "SELECT * FROM companies WHERE companyName = ?";
    db.query(checkCompanyNameSQL, [CompanyName], (err, data) => {
        if (err) {
            console.error("Error checking company name:", err);
            return res.status(500).json({ error: "Error checking company name." });
        }

        if (data.length !== 1) {
            return res.status(400).json({ error: "Company not found or duplicate company." });
        }
        
        bcrypt.hash(Password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ error: "Error hashing password." });
            }

            const sql = `
                INSERT INTO users 
                (username, password, firstname, lastname, email, companyName, role, roleId, is_active, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, securityQuestion3, securityAnswer3)
                VALUES (?, ?, ?, ?, ?, ?, 'Employee', '3', true, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sql, [
                Username,
                hashedPassword,
                Firstname,
                Lastname,
                Email,
                CompanyName,
                SecurityQuestion1,
                SecurityAnswer1,
                SecurityQuestion2,
                SecurityAnswer2,
                SecurityQuestion3,
                SecurityAnswer3
            ], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error." });
                }
                return res.status(201).json({ result });
            });
        });
    });
});

app.post('/create/company', async (req, res) => {
    const {
        Username,
        Firstname,
        Lastname,
        Email,
        Password,
        SecurityQuestion1,
        SecurityAnswer1,
        SecurityQuestion2,
        SecurityAnswer2,
        SecurityQuestion3,
        SecurityAnswer3,
        CompanyName,
        CompanyIndustry,
        CompanyAddress
    } = req.body;

    // Check required fields
    if (!Email || !Username || !Password || !Firstname || !Lastname || !CompanyName || !CompanyIndustry || !CompanyAddress) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    try {
        // Check if email already exists in the users table
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [Email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        // Insert the company into the companies table
        const [companyResult] = await db.query(
            'INSERT INTO companies (companyName, companyIndustry, companyAddress, companyAdminEmail) VALUES (?, ?, ?, ?)',
            [CompanyName, CompanyIndustry, CompanyAddress, Email]
        );

        if (companyResult.affectedRows === 0) {
            return res.status(500).json({ message: 'Failed to create company.' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Insert the user into the users table
        const [userResult] = await db.query(
            `INSERT INTO users (
                username, password, firstname, lastname, email, companyName, role, roleId, is_active, 
                securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, securityQuestion3, securityAnswer3
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Username,
                hashedPassword,
                Firstname,
                Lastname,
                Email,
                CompanyName,
                'Admin',
                1,
                true,
                SecurityQuestion1,
                SecurityAnswer1,
                SecurityQuestion2,
                SecurityAnswer2,
                SecurityQuestion3,
                SecurityAnswer3
            ]
        );

        if (userResult.affectedRows === 0) {
            return res.status(500).json({ message: 'Failed to create user.' });
        }

        return res.status(201).json({ message: 'Company and user created successfully!' });
    } catch (error) {
        console.error('Error creating company and user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


app.post('/create/tasks', async (req, res) => {
    const { userId, description, name, taskdate } = req.body;

    if (!userId || !description || !name || !taskdate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO tasks (name, description, taskdate, userId) VALUES (?, ?, ?, ?)';
    
    try {
        
        const [result] = await db.query(query, [name, description, taskdate, userId]);
        
        res.status(200).json({
            message: 'Task added successfully',
            taskId: result.insertId,
        });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).json({ message: 'Error adding task to the database' });
    }
});


//Get routes
app.post('/get/validate-email', async (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ isValid: false, message: 'Email is required.' });
    }

    try {
        // Define the query directly here
        const query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        
        // Run the query
        const [rows] = await db.query(query, [Email]);

        // After logging, access the result based on its structure
        if (rows[0].count > 0) {
            return res.status(200).json({ isValid: false, message: 'Email is already in use.' });
        }

        return res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Error validating email:', error);
        return res.status(500).json({ isValid: false, message: 'Internal server error.' });
    }
});



app.post('/get/login', async (req, res) => {
    const { Username, Password } = req.body; // assuming email and password are being sent in the request body

    if (!Username || !Password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        // Retrieve the user by email
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [Username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = rows[0]; // Assuming the first row is the correct user

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(Password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // If the password matches, proceed with login logic (e.g., generating a JWT)
        res.status(200).json({ message: "Login successful", user: user });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/post/tasks', (req, res) => {
    const { userId, taskName, taskDescription, taskDate } = req.body;

    if (!userId || !taskName || !taskDescription || !taskDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO tasks (name, description, taskDate, userId) VALUES (?, ?, ?, ?)';

    db.query(query, [taskName,taskDescription, taskDate, userId], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ message: 'Error adding task to the database' });
        }

        res.status(200).json({
            message: 'Task added successfully',
            taskId: result.insertId, // Return the ID of the newly inserted task
        });
    });
});

app.get('/get/tasks/:userID', async (req, res) => {
    const userID = req.params.userID;

    // Query to fetch tasks for the given userId
    const sql = 'SELECT * FROM tasks WHERE userId = ?';

    try {
        // Await the query using the mysql2 promise interface
        const [rows] = await db.query(sql, [userID]);

        res.status(200).json({ tasks: rows });

    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching tasks from the database' });
    }
});


// Route to get user data based on userID
app.get('/get/users/:userID', (req, res) => {
    const userID = req.params.userID;

    const sql = 'SELECT Name, Email, OrganizationName, securityQuestion, securityAnswer, recoveryKey FROM user WHERE ID = ?';
    
    db.query(sql, [userID], (err, data) => {
        console.log(res.json);
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Error fetching user data from the database' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(data[0]);  // Return the first user (since userID is unique)
    });
});

//Update routes
app.put("/update/:id", (req, res) => {
    const sql = "UPDATE user SET `Name`=?, `Email`=?, `Password`=?, `OrganizationName`=? WHERE ID=?";
    const { Name, Email, Password, OrganizationName } = req.body;
    const id = req.params.id;

    if (!Name || !Email || !Password || !OrganizationName) {
        return res.status(400).json({ error: "Name, Email, Password, and Organization Name are required." });
    }

    db.query(sql, [Name, Email, Password, OrganizationName, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }
        return res.status(200).json({ result });
    });
});


//Delete routes
app.delete("/user/:id", (req, res) => {
    const sql = "DELETE FROM user WHERE ID=?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }
        return res.status(200).json({ result });
    });
});
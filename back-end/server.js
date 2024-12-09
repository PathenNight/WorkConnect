const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { createConnection, createTables } = require("./config/connectToDb");
const path = require('path');
const bcrypt = require('bcryptjs');
const { notStrictEqual } = require("assert");
const { PassThrough } = require("stream");
const app = express();
let db;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
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

    // Validation checks
    if (!Username || !Password || !Firstname || !Lastname || !Email ||
        !CompanyName || !SecurityQuestion1 || !SecurityAnswer1 || !SecurityQuestion2 ||
        !SecurityAnswer2 || !SecurityQuestion3 || !SecurityAnswer3) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Check if company exists
    const [rows] = await db.query('SELECT * FROM companies WHERE companyName = ?', [CompanyName]);
    if (rows.length === 0) {
        console.error(`No company found with the name: ${CompanyName}`);
        return res.status(400).json({ error: `No company found with the name: ${CompanyName}. Please verify your entry.` });
    }
    if (rows.length > 1) {
        console.error(`Duplicate company entries found for: ${CompanyName}`);
        return res.status(400).json({ error: `Duplicate companies found with the name: ${CompanyName}. Please verify your company name.` });
    }

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);  // Use async/await with bcrypt

        const sql = `
            INSERT INTO users 
            (username, password, firstname, lastname, email, companyName, role, roleId, is_active, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, securityQuestion3, securityAnswer3)
            VALUES (?, ?, ?, ?, ?, ?, 'Employee', '3', true, ?, ?, ?, ?, ?, ?)
        `;


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
                'Employee',
                3,
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


app.post('/create/task', async (req, res) => {
    const { userId, taskName, taskDescription, taskdate } = req.body;

    // Check for missing required fields
    if (!userId || !taskName || !taskDescription || !taskdate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO tasks (name, description, taskdate, userId) VALUES (?, ?, ?, ?)';

    try {
        // Use the correct variable names from the request body
        const [result] = await db.query(query, [taskName, taskDescription, taskdate, userId]);

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
app.get('/get/user/:email', async (req, res) => {
    const email = req.params.email;
    // SQL query to get user data by email
    const query = `
      SELECT username, securityQuestion1, securityAnswer1, 
             securityQuestion2, securityAnswer2, 
             securityQuestion3, securityAnswer3 
      FROM users 
      WHERE email = ?`;
    try {
        const [rows] = await db.query(query, email);
        if (rows.length === 0) {
            return res.status(404).json({ found: false, message: 'No account found with this email' });
        };
        const user = rows[0];
        const userData = {
            found: true,
            username: user.username,
            securityQuestions: [
                user.securityQuestion1,
                user.securityQuestion2,
                user.securityQuestion3
            ]
        };
        return res.status(200).json(userData);
    } catch {
        console.error('Error fetching user data');
        return res.status(500).json({ error: 'Database error' });
    }
});

app.post('/get/validate-email', async (req, res) => {

    const { Email } = req.body;

    // Validate request data
    if (!Email) {
        return res.status(400).json({ isValid: false, message: 'Email is required.' });
    }

    try {
        // Query to check if email exists
        const query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';

        const [rows] = await db.query(query, [Email]);

        if (rows[0].count > 0) {
            return res.status(200).json({ isValid: false, message: 'Email is already in use.' });
        }

        return res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Error validating email:', error);
        return res.status(500).json({ isValid: false, message: 'Internal server error.' });
    }
});

app.post('/get/validate-company', async (req, res) => {

    const { companyName } = req.body;

    // Validate request data
    if (!companyName) {
        return res.status(400).json({ isValid: false, message: 'Company name is required.' });
    }

    try {
        // Query to check if email exists
        const query = 'SELECT COUNT(*) AS count FROM companies WHERE companyName = ?';

        const [rows] = await db.query(query, [companyName]);

        if (rows[0].count > 0) {
            return res.status(200).json({ isValid: false, message: 'Company name is already in use.' });
        }

        return res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Error validating company name:', error);
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

app.post('/recovery', async (req, res) => {
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

app.post('/verify-answers', async (req, res) => {
    const { email, answers } = req.body;
    const answerArray = [answers['1'], answers['2'], answers['3']];

    if (!email || !answerArray || answerArray.length !== 3) {
        return res.status(400).json({ error: 'Invalid request. Please provide the email and all 3 answers.' });
    }

    // SQL query to get user data (security questions and answers) by email
    const query = `
        SELECT securityAnswer1, securityAnswer2, securityAnswer3 
        FROM users 
        WHERE email = ?`;
    try {
        const [rows] = await db.query(query, [email]);
        if (rows.length < 1) {
            console.error('User with that email not found', err);
            return res.status(400).json({ error: 'Email not found error' });
        }
        else if (rows.length > 1) {
            console.error('Duplicate user emails found in database', err);
            return res.status(400).json({ error: 'duplicate emails error' });
        }
        else {
            const user = rows[0];
            const correctAnswers = [
                user.securityAnswer1,
                user.securityAnswer2,
                user.securityAnswer3
            ];

            let answersMatch = true;
            for(let i = 0; i<correctAnswers.length;i++){
                if(answerArray[i].trim().toLowerCase() !== correctAnswers[i].trim().toLowerCase()){
                    answersMatch=false;
                }
            }
            if (answersMatch) {
                return res.status(200).json({ correct: true });
            } else {
                return res.status(401).json({ correct: false, error: 'Incorrect answers. Please try again or contact support.' });
            }
        }

    } catch {
        console.error('Error during answer verification.');
        res.status(500).json({ error: 'Internal server error' });
    }
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


app.get('/get/users/:userID', async (req, res) => {
    const userID = req.params.userID;

    const sql = `
        SELECT username, firstname, lastname, email, companyName, role 
        FROM users 
        WHERE userId = ?
    `;

    try {
        // Execute the query using mysql2
        const [results] = await db.execute(sql, [userID]);

        // Check if the user is found
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]); // Return the first user (userID is unique)
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Error fetching user data from the database' });
    }
});

//Update routes
app.put("/update/users/:userID", (req, res) => {
    const sql = "UPDATE users SET `username`=?, `firstname`=?, `lastname`=?, `email`=? WHERE userId=?";
    const { username, firstname, lastname, email } = req.body;
    const { userID } = req.params;  // Get userID from params
    if (!username || !email || !firstname || !lastname) {
        return res.status(400).json({ error: "Username, Email, First Name, and Last Name are required." });
    }

    try {
        db.query(sql, [username, firstname, lastname, email, userID]);
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ error: 'Error updating user data in the database' });
    }
});

app.put("/update/password", async (req, res) => {
    const sql = "UPDATE users SET `password`=? WHERE email=?";
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [results] = await db.query(sql, [hashedPassword, email]);
        if(results.affectedRows === 1){
            return res.status(200).json({changed: true});
        }
        else{
            return res.status(400).json({changed: false});
        }
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ error: 'Error updating user data in the database' });
    }
});

app.put("/update/username", async (req, res) => {
    const sql = "UPDATE users SET `username`=? WHERE email=?";
    const { email, username } = req.body;
    if (!email || !username) {
        return res.status(400).json({ error: "Email and username are required." });
    }

    try {
        const [results] = await db.query(sql, [username, email]);
        if(results.affectedRows === 1){
            return res.status(200).json({changed: true});
        }
        else{
            return res.status(400).json({changed: false});
        }
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ error: 'Error updating user data in the database' });
    }
});



//Delete routes
app.delete("/delete/users/:userID", (req, res) => {
    const { userID } = req.params;
    const sql1 = "DELETE FROM tasks WHERE userId = ?"
    const sql2 = "DELETE FROM users WHERE userId = ?";

    try {
        db.query(sql1, [userID], (err, results) => {
            if (err) {
                console.error("Error deleting user tasks:", err);
                return res.status(500).json({ error: "Error deleting user tasks from the database" });
            }
        });
        db.query(sql2, [userID], (err, results) => {
            if (err) {
                console.error("Error deleting user:", err);
                return res.status(500).json({ error: "Error deleting user from the database" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

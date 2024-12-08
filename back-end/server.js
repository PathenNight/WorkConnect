const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const {createConnection, createTables} = require("./config/connectToDb");
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
let db;

app.use(express.json());
app.use(cors());
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
    /*
    const checkCompanyNameSQL = "SELECT * FROM companies WHERE name = ?";
    db.query(checkCompanyNameSQL, [CompanyName], (err, data) => {
        if (err) {
            console.error("Error checking company name:", err);
            return res.status(500).json({ error: "Error checking company name." });
        }

        if (data.length !== 1) {
            return res.status(400).json({ error: "Company not found or duplicate company." });
        }
            */
        
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



app.post('/create/tasks', (req, res) => {
    const { userId, taskName, taskDate } = req.body;

    if (!userId || !taskName || !taskDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO calendarTasks (taskDescription, taskDate, userID) VALUES (?, ?, ?)';

    db.query(query, [taskName, taskDate, userId], (err, result) => {
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


//Get routes
app.post("/get/login", (req, res) => {
    const { Username, Password } = req.body;
    if (!Username || !Password) {
        return res.status(400).json({ error: "Username and Password are required." });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [Username], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }

        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Compare the hashed password
        bcrypt.compare(Password, data[0].Password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ error: "Error verifying password." });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid Username or password." });
            }

            return res.status(200).json({ user: data[0] });
        });
    });
});

app.get('/tasks/:userID', (req, res) => {
    const userID = req.params.userID;

    // Query to fetch tasks for the given userId
    const sql = 'SELECT * FROM calendarTasks WHERE userID = ?';
    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks from the database' });
        }

        res.status(200).json({ tasks: result });
    });
});

// Route to get user data based on userID
app.get('/api/users/:userID', (req, res) => {
    console.log(`Fetching user with ID: ${req.params.userID}`);
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
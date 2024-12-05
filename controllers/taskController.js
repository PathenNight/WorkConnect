// controllers/taskController.js
const { createConnection } = require('mysql2/promise');  // Ensure you're using mysql2/promise

// Function to add a task
const addTask = async (req, res) => {
    const { userId, taskName, taskDate } = req.body;
    try {
        // Establish a database connection
        const connection = await createConnection({ /* your db config */ });

        // Query to insert task
        const query = 'INSERT INTO Tasks (userId, taskName, taskDate) VALUES (?, ?, ?)';
        await connection.query(query, [userId, taskName, taskDate]);

        // Close connection after the query
        await connection.end();

        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Error adding task' });
    }
};

// Function to get tasks for a user
const getUserTasks = async (req, res) => {
    const { userID } = req.params;
    try {
        // Establish a database connection
        const connection = await createConnection({ /* your db config */ });

        // Query to get tasks for the specific user
        const [tasks] = await connection.query('SELECT * FROM Tasks WHERE userId = ?', [userID]);

        // Close connection after the query
        await connection.end();

        res.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

module.exports = { addTask, getUserTasks };

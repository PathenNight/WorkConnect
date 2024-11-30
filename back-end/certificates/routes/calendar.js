const express = require('express');
const router = express.Router(); // Create a router instance
const pool = require('../config/db'); // Assuming you are using a database connection

// Get all calendar data
router.get('/calendar', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Calendar');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch calendar data' });
    }
});

// Add a task
router.post('/calendar/task', async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Tasks (title, description, due_date) VALUES (?, ?, ?)',
            [title, description, dueDate]
        );
        res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add task' });
    }
});

// Add a project
router.post('/calendar/project', async (req, res) => {
    const { name, description, startDate, endDate } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
            [name, description, startDate, endDate]
        );
        res.status(201).json({ message: 'Project added successfully', projectId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add project' });
    }
});

// Get calendar data for a specific date
router.get('/calendar/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM Calendar WHERE event_date = ?',
            [date]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch calendar data for the specified date' });
    }
});

module.exports = router;

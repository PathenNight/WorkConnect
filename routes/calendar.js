const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Assuming you are using a database connection
const Calendar = require('../models/Calendar');

// --- Calendar Routes ---

// Create an instance of the Calendar class
const calendar = new Calendar();

// Route to get all calendar data (activities)
router.get('/', (req, res) => {
  try {
    res.json(calendar.activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch calendar data' });
  }
});

// Add a calendar event, task, or project (POST)
router.post('/create', async (req, res) => {
    const { title, description, startMonth, startDay, startYear, endMonth, endDay, endYear, isProject } = req.body;
  
    try {
      if (isProject) {
        // Insert into the Projects table
        const startDate = `${startYear}-${startMonth}-${startDay}`;
        const endDate = `${endYear}-${endMonth}-${endDay}`;
        const [result] = await pool.query(
          'INSERT INTO Projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
          [title, description, startDate, endDate]
        );
        res.status(201).json({ message: 'Project added successfully', projectId: result.insertId });
      } else {
        // Insert into the Tasks table or Calendar table
        const startDate = `${startYear}-${startMonth}-${startDay}`;
        const endDate = `${endYear}-${endMonth}-${endDay}`;
        const [result] = await pool.query(
          'INSERT INTO Tasks (title, description, due_date) VALUES (?, ?, ?)',
          [title, description, startDate] // Example: due_date is the start date
        );
        res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add task or project' });
    }
  });
  

// --- Task & Project Routes (Integrated with Calendar) ---

// Add a task (POST)
router.post('/tasks/create', async (req, res) => {
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

// Get all tasks (GET)
router.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Tasks');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Delete a task (DELETE)
router.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    await pool.query('DELETE FROM Tasks WHERE id = ?', [taskId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Add a project (POST)
router.post('/projects/create', async (req, res) => {
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

// Get all projects (GET)
router.get('/projects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Projects');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Delete a project (DELETE)
router.delete('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  try {
    await pool.query('DELETE FROM Projects WHERE id = ?', [projectId]);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;

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

// Route to create an activity (add calendar event)
router.post('/create', (req, res) => {
  const { name, startMonth, startDay, startYear, endMonth, endDay, endYear } = req.body;
  try {
    calendar.createActivity(name, startMonth, startDay, startYear, endMonth, endDay, endYear);
    res.status(201).json({ message: 'Activity added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add activity' });
  }
});

// Route to get calendar for a specific month and year
router.get('/month/:year/:month', (req, res) => {
  const { year, month } = req.params;
  try {
    calendar.displayCalendar(Number(year), Number(month));
    res.status(200).json({ message: 'Calendar displayed in console' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to display calendar' });
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


const app = require("express"); //import express
const router = app.Router();

const { getTasks, addTask, updateTask, deleteTask } = require('../modules/task');
const verifyToken = require('../middleware/auth');

const { register, login } = require('../modules/auth.module');


// Register user route
router.post('/auth/register', register);

// Login user route
router.post('/auth/login', login);
// Get all tasks for a user (requires authentication)
router.get('/tasks', verifyToken, getTasks);

// Add a new task (requires authentication)
router.post('/addtasks', verifyToken, addTask);

// Update a task by ID (requires authentication)
router.put('/updatetasks/:id', verifyToken, updateTask);

// Delete a task by ID (requires authentication)
router.delete('/deletetask/:id', verifyToken, deleteTask);











module.exports = router;
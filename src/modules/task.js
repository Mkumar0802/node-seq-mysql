const Task = require('../models/Task');

// Utility function for error handling and logging
const handleError = (res, error, message = 'Server error', statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({ message });
};

// Get all tasks for a user - STRICT FILTERING
const getTasks = async (req, res) => {
  try {
    console.log('🔍 Fetching tasks for user:', req.user.id);
    
    // STRICT filter - only tasks where user matches exactly
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    console.log(`📋 Found ${tasks.length} tasks for user ${req.user.id}`);
    
    // Return empty array instead of error if no tasks
    res.json(tasks);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    handleError(res, err, 'Error fetching tasks');
  }
};

// Add a new task - ENSURE USER ASSOCIATION
const addTask = async (req, res) => {
  const { title, description, status } = req.body;

  // Validate inputs
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    console.log('➕ Adding task for user:', req.user.id);
    
    const newTask = new Task({
      title,
      description: description || '',
      status: status || 'Pending',
      user: req.user.id, // STRICT user association
    });

    await newTask.save();
    console.log('✅ Task created:', newTask._id);
    res.status(201).json(newTask);
  } catch (err) {
    console.error('❌ Error saving the task:', err);
    handleError(res, err, 'Error saving the task');
  }
};

// Update a task by ID - STRICT OWNERSHIP CHECK
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  try {
    console.log('✏️ Updating task:', id, 'for user:', req.user.id);
    
    // Find the task by ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // STRICT ownership check
    if (task.user.toString() !== req.user.id) {
      console.log('🚫 Unauthorized: Task belongs to different user');
      return res.status(403).json({ message: 'Unauthorized - Task does not belong to you' });
    }

    // Update the fields
    if (title) task.title = title;
    if (status) task.status = status;

    await task.save();
    console.log('✅ Task updated:', task._id);
    res.json(task);
  } catch (err) {
    console.error('❌ Error updating the task:', err);
    handleError(res, err, 'Error updating the task');
  }
};

// Delete a task by ID - STRICT OWNERSHIP CHECK
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('🗑️ Deleting task:', id, 'for user:', req.user.id);
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // STRICT ownership check
    if (task.user.toString() !== req.user.id) {
      console.log('🚫 Unauthorized: Task belongs to different user');
      return res.status(403).json({ message: 'Unauthorized - Task does not belong to you' });
    }

    await Task.findByIdAndDelete(id);
    console.log('✅ Task deleted:', id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('❌ Error deleting the task:', err);
    handleError(res, err, 'Error deleting the task');
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
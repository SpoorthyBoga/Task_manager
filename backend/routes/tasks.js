const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. CREATE TASK (Admin Only)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const task = new Task({
            title,
            description,
            assignedTo,
            createdBy: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET TASKS (Based on Role)
router.get('/', protect, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            // Admin sees everything
            tasks = await Task.find().populate('assignedTo', 'name email');
        } else {
            // User sees only their assigned tasks
            tasks = await Task.find({ assignedTo: req.user.id });
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE TASK STATUS (Admin and assigned User)
router.patch('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Security: Check if user is Admin OR the person the task is assigned to
        if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status || task.status;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
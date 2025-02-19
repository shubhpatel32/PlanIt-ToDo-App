const Todo = require("../models/Todo");
const { validationResult } = require("express-validator");
const moment = require("moment");

const updateExpiredTasks = async () => {
  const now = new Date();
  await Todo.updateMany(
    { status: { $ne: "COMPLETE" }, deadline: { $lt: now } },
    { status: "EXPIRED" }
  );
};

exports.getTodos = async (req, res) => {
  try {
    await updateExpiredTasks();
    const todos = await Todo.find({ userId: req.user._id }).sort({
      deadline: 1,
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Todo.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, deadline } = req.body;
    const todo = new Todo({
      title,
      description,
      deadline: deadline ? moment(deadline).utc().toDate() : null,
      status: "ACTIVE",
      userId: req.user.id,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error adding TODO" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ error: "Todo not found" });

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (deadline)
      todo.deadline = deadline ? moment(deadline).utc().toDate() : null;
    if (status) todo.status = status;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error updating todo" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting todo" });
  }
};

const express = require("express");
const { body } = require("express-validator");
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTaskById,
} = require("../controllers/todoController");
const { authenticateUser } = require("../middlewares/userMiddleware");

const router = express.Router();

router.get("/", authenticateUser, getTodos);
router.get("/:id", authenticateUser, getTaskById);

router.post(
  "/",
  authenticateUser,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("deadline").isISO8601().withMessage("Invalid date format"),
  ],
  addTodo
);

router.put("/:id", authenticateUser, updateTodo);

router.delete("/:id", authenticateUser, deleteTodo);

module.exports = router;

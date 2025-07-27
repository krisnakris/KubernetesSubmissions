const db = require("./db");

const getTodos = async () => {
  const result = await db.query("SELECT * FROM todos ORDER BY created_at DESC");
  return result.rows;
};

const createTodo = async (todoText) => {
  if (!todoText) {
    throw new Error("Todo is required");
  }

  if (todoText.length > 140) {
    throw new Error("Todo must be 140 characters or less");
  }

  const result = await db.query(
    "INSERT INTO todos(todo) VALUES($1) RETURNING *",
    [todoText]
  );
  return result.rows[0];
};

const deleteTodo = async (todoId) => {
  const result = await db.query("DELETE FROM todos WHERE id = $1 RETURNING *", [
    todoId,
  ]);
  return result.rows[0];
};

const updateTodo = async (todoId, newText) => {
  if (!newText) {
    throw new Error("Todo is required");
  }

  if (newText.length > 140) {
    throw new Error("Todo must be 140 characters or less");
  }

  const result = await db.query(
    "UPDATE todos SET todo = $1 WHERE id = $2 RETURNING *",
    [newText, todoId]
  );
  return result.rows[0];
};

const getTodoById = async (todoId) => {
  const result = await db.query("SELECT * FROM todos WHERE id = $1", [todoId]);
  return result.rows[0];
};

module.exports = {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getTodoById,
};

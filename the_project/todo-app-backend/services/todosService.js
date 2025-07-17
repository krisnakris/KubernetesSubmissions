const db = require("./db");

const getTodos = async () => {
  const result = await db.query("SELECT * FROM todos ORDER BY created_at DESC");
  return result.rows;
};

const createTodo = async (todoText) => {
  console.log("🚀 ~ createTodo ~ todoText:", todoText);
  const result = await db.query(
    "INSERT INTO todos(todo) VALUES($1) RETURNING *",
    [todoText]
  );
  return result.rows[0];
};

module.exports = {
  getTodos,
  createTodo,
};

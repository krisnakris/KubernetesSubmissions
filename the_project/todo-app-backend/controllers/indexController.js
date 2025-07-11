const todosService = require("../services/todosService");

exports.getTodos = (req, res) => {
  const todos = todosService.getTodos();
  res.json({ todos });
};

exports.createTodos = (req, res) => {
  if (!req.body.todo) {
    return res.status(400).json({ error: "Todo is required" });
  }

  try {
    todosService.createTodos(req.body.todo);
    res.json({ status: "created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

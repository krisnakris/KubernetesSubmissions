const todosService = require("../services/todosService");

exports.getTodo = async (req, res) => {
  try {
    const todos = await todosService.getTodos();
    res.json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

exports.createTodo = async (req, res) => {
  if (!req.body.todo) {
    return res.status(400).json({ error: "Todo is required" });
  }

  try {
    const newTodo = await todosService.createTodo(req.body.todo);
    res.json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

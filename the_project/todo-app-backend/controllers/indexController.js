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
  console.log(`TODO: `, req.body.todo);

  try {
    const newTodo = await todosService.createTodo(req.body.todo);
    res.json(newTodo);
  } catch (error) {
    console.error(error);
    if (
      error.message === "Todo is required" ||
      error.message === "Todo must be 140 characters or less"
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create todo" });
  }
};

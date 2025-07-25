const imageService = require("../services/imageService");
const todoService = require("../services/todoService");

exports.getHomePage = async (req, res) => {
  const imageUrl = await imageService.getImage();
  const todos = await todoService.fetchTodos();

  res.render("index", {
    title: "The project App",
    text: `DevOps with Kubernetes 2025`,
    imageUrl: imageUrl,
    todos: todos,
  });
};

exports.createTodos = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging line
    console.log("Todo text:", req.body?.todo); // Debugging line
    await todoService.createTodo(req.body.todo);
    res.redirect("/");
  } catch (error) {
    console.error("Gagal menambahkan todo:", error);
    res.status(500).send("Error adding todo");
  }
};

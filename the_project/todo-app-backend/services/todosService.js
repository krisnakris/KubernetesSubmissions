const todos = [];

const getTodos = () => {
  return todos;
};

const createTodos = (todo) => {
  todos.push(todo);
  return todos;
};

module.exports = {
  getTodos,
  createTodos,
};

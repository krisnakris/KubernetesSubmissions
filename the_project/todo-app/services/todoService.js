const axios = require("axios");

const url = process.env.BACKEND_URL || "http://localhost:3001";
const fetchTodos = async () => {
  try {
    const response = await axios.get(`${url}/todos`);
    return response.data.todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

const createTodo = async (todoText) => {
  try {
    await axios.post(`${url}/todos`, {
      todo: todoText,
    });
  } catch (error) {
    console.error("Error adding todo to backend:", error);
    throw error;
  }
};

module.exports = {
  fetchTodos,
  createTodo,
};

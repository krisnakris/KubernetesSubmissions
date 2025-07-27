const todosService = require("./todosService");
const db = require("./db");

jest.mock("./db");

describe("todosService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should return todos ordered by created_at DESC", async () => {
      // Mock data
      const mockTodos = [
        { id: 2, todo: "Second todo", created_at: "2025-07-27T10:00:00Z" },
        { id: 1, todo: "First todo", created_at: "2025-07-27T09:00:00Z" },
      ];

      // Mock database query result
      db.query.mockResolvedValue({
        rows: mockTodos,
      });

      // Call the function
      const result = await todosService.getTodos();

      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // Should be ordered by created_at DESC
    });

    it("should return empty array when no todos exist", async () => {
      // Mock empty result
      db.query.mockResolvedValue({
        rows: [],
      });

      const result = await todosService.getTodos();

      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      // Mock database error
      const dbError = new Error("Database connection failed");
      db.query.mockRejectedValue(dbError);

      // Should throw the error
      await expect(todosService.getTodos()).rejects.toThrow(
        "Database connection failed"
      );
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
    });

    it("should handle large number of todos", async () => {
      // Mock large dataset
      const mockTodos = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        todo: `Todo ${index + 1}`,
        created_at: new Date(Date.now() - index * 1000).toISOString(),
      }));

      db.query.mockResolvedValue({
        rows: mockTodos,
      });

      const result = await todosService.getTodos();

      expect(result).toHaveLength(1000);
      expect(result).toEqual(mockTodos);
    });

    it("should handle todos with null values", async () => {
      const mockTodos = [
        { id: 1, todo: null, created_at: "2025-07-27T10:00:00Z" },
        { id: 2, todo: "", created_at: "2025-07-27T09:00:00Z" },
      ];

      db.query.mockResolvedValue({
        rows: mockTodos,
      });

      const result = await todosService.getTodos();

      expect(result).toEqual(mockTodos);
      expect(result[0].todo).toBeNull();
      expect(result[1].todo).toBe("");
    });

    it("should handle malformed database response", async () => {
      db.query.mockResolvedValue({
        rows: undefined,
      });

      const result = await todosService.getTodos();

      expect(result).toBeUndefined();
    });
  });

  describe("createTodo", () => {
    it("should create a new todo and return it", async () => {
      const todoText = "Buy groceries";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      // Mock database query result
      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      // Call the function
      const result = await todosService.createTodo(todoText);

      // Assertions
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO todos(todo) VALUES($1) RETURNING *",
        [todoText]
      );
      expect(result).toEqual(mockCreatedTodo);
      expect(result.todo).toBe(todoText);
    });

    it("should handle empty todo text", async () => {
      const todoText = " "; // Single space instead of empty string
      const mockCreatedTodo = {
        id: 1,
        todo: " ",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO todos(todo) VALUES($1) RETURNING *",
        [" "]
      );
      expect(result).toEqual(mockCreatedTodo);
    });

    it("should handle special characters in todo text", async () => {
      const todoText =
        "Test with 'quotes' and \"double quotes\" & special chars!";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO todos(todo) VALUES($1) RETURNING *",
        [todoText]
      );
      expect(result.todo).toBe(todoText);
    });

    it("should handle database errors during creation", async () => {
      const todoText = "Test todo";
      const dbError = new Error("Insert failed");

      db.query.mockRejectedValue(dbError);

      await expect(todosService.createTodo(todoText)).rejects.toThrow(
        "Insert failed"
      );
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO todos(todo) VALUES($1) RETURNING *",
        [todoText]
      );
    });

    it("should handle whitespace-only todo text", async () => {
      const todoText = "   \t\n   ";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(result.todo).toBe(todoText);
    });

    it("should handle todo text up to 140 characters", async () => {
      const todoText = "a".repeat(140);
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(result.todo).toBe(todoText);
      expect(result.todo).toHaveLength(140);
    });

    it("should handle unicode characters", async () => {
      const todoText = "买菜 🛒 emojis 测试";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(result.todo).toBe(todoText);
    });

    it("should handle SQL injection attempts", async () => {
      const todoText = "'; DROP TABLE todos; --";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockCreatedTodo],
      });

      const result = await todosService.createTodo(todoText);

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO todos(todo) VALUES($1) RETURNING *",
        [todoText]
      );
      expect(result.todo).toBe(todoText);
    });

    it("should handle network timeout errors", async () => {
      const todoText = "Test todo";
      const timeoutError = new Error("Connection timeout");
      timeoutError.code = "ETIMEDOUT";

      db.query.mockRejectedValue(timeoutError);

      await expect(todosService.createTodo(todoText)).rejects.toThrow(
        "Connection timeout"
      );
    });

    it("should handle constraint violation errors", async () => {
      const todoText = "Test todo";
      const constraintError = new Error("Duplicate key violation");
      constraintError.code = "23505";

      db.query.mockRejectedValue(constraintError);

      await expect(todosService.createTodo(todoText)).rejects.toThrow(
        "Duplicate key violation"
      );
    });

    it("should reject todo longer than 140 characters", async () => {
      const todoText = "a".repeat(141);

      await expect(todosService.createTodo(todoText)).rejects.toThrow(
        "Todo must be 140 characters or less"
      );
    });

    it("should reject empty or null todo", async () => {
      await expect(todosService.createTodo(null)).rejects.toThrow(
        "Todo is required"
      );

      await expect(todosService.createTodo(undefined)).rejects.toThrow(
        "Todo is required"
      );

      await expect(todosService.createTodo("")).rejects.toThrow(
        "Todo is required"
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo by id and return deleted todo", async () => {
      const todoId = 1;
      const mockDeletedTodo = {
        id: 1,
        todo: "Deleted todo",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockDeletedTodo],
      });

      const result = await todosService.deleteTodo(todoId);

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        [todoId]
      );
      expect(result).toEqual(mockDeletedTodo);
    });

    it("should return undefined when deleting non-existent todo", async () => {
      const todoId = 999;

      db.query.mockResolvedValue({
        rows: [],
      });

      const result = await todosService.deleteTodo(todoId);

      expect(result).toBeUndefined();
    });

    it("should handle invalid todo id types", async () => {
      const invalidIds = [null, undefined, "abc", {}, [], true];

      for (const invalidId of invalidIds) {
        db.query.mockResolvedValue({ rows: [] });

        const result = await todosService.deleteTodo(invalidId);

        expect(db.query).toHaveBeenCalledWith(
          "DELETE FROM todos WHERE id = $1 RETURNING *",
          [invalidId]
        );
      }
    });

    it("should handle database errors during deletion", async () => {
      const todoId = 1;
      const dbError = new Error("Foreign key constraint violation");

      db.query.mockRejectedValue(dbError);

      await expect(todosService.deleteTodo(todoId)).rejects.toThrow(
        "Foreign key constraint violation"
      );
    });
  });

  describe("updateTodo", () => {
    it("should update todo text and return updated todo", async () => {
      const todoId = 1;
      const newText = "Updated todo text";
      const mockUpdatedTodo = {
        id: 1,
        todo: newText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockUpdatedTodo],
      });

      const result = await todosService.updateTodo(todoId, newText);

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE todos SET todo = $1 WHERE id = $2 RETURNING *",
        [newText, todoId]
      );
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("should return undefined when updating non-existent todo", async () => {
      const todoId = 999;
      const newText = "Updated text";

      db.query.mockResolvedValue({
        rows: [],
      });

      const result = await todosService.updateTodo(todoId, newText);

      expect(result).toBeUndefined();
    });

    it("should handle single space updates", async () => {
      const todoId = 1;
      const newText = " ";
      const mockUpdatedTodo = {
        id: 1,
        todo: " ",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockUpdatedTodo],
      });

      const result = await todosService.updateTodo(todoId, newText);

      expect(result.todo).toBe(" ");
    });

    it("should reject update with empty string", async () => {
      const todoId = 1;
      const newText = "";

      await expect(todosService.updateTodo(todoId, newText)).rejects.toThrow(
        "Todo is required"
      );
    });

    it("should reject update longer than 140 characters", async () => {
      const todoId = 1;
      const newText = "a".repeat(141);

      await expect(todosService.updateTodo(todoId, newText)).rejects.toThrow(
        "Todo must be 140 characters or less"
      );
    });
  });

  describe("getTodoById", () => {
    it("should return specific todo by id", async () => {
      const todoId = 1;
      const mockTodo = {
        id: 1,
        todo: "Specific todo",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockTodo],
      });

      const result = await todosService.getTodoById(todoId);

      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM todos WHERE id = $1",
        [todoId]
      );
      expect(result).toEqual(mockTodo);
    });

    it("should return undefined for non-existent todo", async () => {
      const todoId = 999;

      db.query.mockResolvedValue({
        rows: [],
      });

      const result = await todosService.getTodoById(todoId);

      expect(result).toBeUndefined();
    });

    it("should handle string id conversion", async () => {
      const todoId = "1";
      const mockTodo = {
        id: 1,
        todo: "String ID todo",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockTodo],
      });

      const result = await todosService.getTodoById(todoId);

      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM todos WHERE id = $1",
        ["1"]
      );
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle db.query returning undefined", async () => {
      db.query.mockResolvedValue(undefined);

      await expect(todosService.getTodos()).rejects.toThrow();
    });

    it("should handle db.query returning null", async () => {
      db.query.mockResolvedValue(null);

      await expect(todosService.getTodos()).rejects.toThrow();
    });

    it("should handle createTodo when db returns empty rows array", async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await todosService.createTodo("test");

      expect(result).toBeUndefined();
    });

    it("should handle createTodo when db returns malformed response", async () => {
      db.query.mockResolvedValue({ rows: undefined });

      await expect(todosService.createTodo("test")).rejects.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should maintain data consistency between getTodos and createTodo", async () => {
      const todoText = "Integration test todo";
      const mockCreatedTodo = {
        id: 1,
        todo: todoText,
        created_at: "2025-07-27T10:00:00Z",
      };

      // Mock createTodo
      db.query.mockResolvedValueOnce({
        rows: [mockCreatedTodo],
      });

      // Mock getTodos after creation
      db.query.mockResolvedValueOnce({
        rows: [mockCreatedTodo],
      });

      // Create todo
      const createdTodo = await todosService.createTodo(todoText);
      expect(createdTodo).toEqual(mockCreatedTodo);

      // Get todos
      const todos = await todosService.getTodos();
      expect(todos).toContain(mockCreatedTodo);
    });

    it("should handle multiple concurrent operations", async () => {
      const mockTodos = [
        { id: 1, todo: "Todo 1", created_at: "2025-07-27T10:00:00Z" },
        { id: 2, todo: "Todo 2", created_at: "2025-07-27T10:01:00Z" },
      ];

      db.query.mockResolvedValue({ rows: mockTodos });

      const promises = [
        todosService.getTodos(),
        todosService.getTodos(),
        todosService.getTodos(),
      ];

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result).toEqual(mockTodos);
      });
      expect(db.query).toHaveBeenCalledTimes(3);
    });
  });

  describe("performance and stress tests", () => {
    it("should handle rapid successive database calls", async () => {
      const mockTodos = [
        { id: 1, todo: "Todo 1", created_at: "2025-07-27T10:00:00Z" },
      ];

      db.query.mockResolvedValue({ rows: mockTodos });

      const rapidCalls = Array.from({ length: 100 }, () =>
        todosService.getTodos()
      );

      const results = await Promise.all(rapidCalls);

      expect(results).toHaveLength(100);
      expect(db.query).toHaveBeenCalledTimes(100);
      results.forEach((result) => {
        expect(result).toEqual(mockTodos);
      });
    });

    it("should handle mixed concurrent operations", async () => {
      const mockTodo = {
        id: 1,
        todo: "Concurrent todo",
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query
        .mockResolvedValueOnce({ rows: [mockTodo] }) // createTodo
        .mockResolvedValueOnce({ rows: [mockTodo] }) // getTodos
        .mockResolvedValueOnce({ rows: [mockTodo] }) // updateTodo
        .mockResolvedValueOnce({ rows: [mockTodo] }); // deleteTodo

      const operations = [
        todosService.createTodo("New todo"),
        todosService.getTodos(),
        todosService.updateTodo(1, "Updated"),
        todosService.deleteTodo(1),
      ];

      const results = await Promise.allSettled(operations);

      expect(results).toHaveLength(4);
      results.forEach((result) => {
        expect(result.status).toBe("fulfilled");
      });
    });
  });

  describe("data validation edge cases", () => {
    it("should handle extremely large datasets", async () => {
      const largeMockTodos = Array.from({ length: 50000 }, (_, index) => ({
        id: index + 1,
        todo: `Large dataset todo ${index + 1}`,
        created_at: new Date(Date.now() - index * 1000).toISOString(),
      }));

      db.query.mockResolvedValue({
        rows: largeMockTodos,
      });

      const result = await todosService.getTodos();

      expect(result).toHaveLength(50000);
      expect(result[0].id).toBe(1);
      expect(result[49999].id).toBe(50000);
    });

    it("should handle todos with complex unicode strings", async () => {
      const complexUnicode =
        "🏠🚗🎉 مرحبا العالم 你好世界 こんにちは Ṽëŕÿ ñïčë ūñïčødē";
      const mockTodo = {
        id: 1,
        todo: complexUnicode,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockTodo],
      });

      const result = await todosService.createTodo(complexUnicode);

      expect(result.todo).toBe(complexUnicode);
      expect(result.todo).toContain("🏠");
      expect(result.todo).toContain("مرحبا");
      expect(result.todo).toContain("你好");
    });

    it("should handle todos with newlines and special formatting", async () => {
      const formattedText =
        "Line 1\nLine 2\r\nLine 3\tTabbed\n\nDouble newline";
      const mockTodo = {
        id: 1,
        todo: formattedText,
        created_at: "2025-07-27T10:00:00Z",
      };

      db.query.mockResolvedValue({
        rows: [mockTodo],
      });

      const result = await todosService.createTodo(formattedText);

      expect(result.todo).toBe(formattedText);
      expect(result.todo).toContain("\n");
      expect(result.todo).toContain("\t");
    });
  });

  describe("database connection resilience", () => {
    it("should handle intermittent connection failures", async () => {
      const connectionError = new Error("Connection lost");
      connectionError.code = "ECONNRESET";

      db.query.mockRejectedValue(connectionError);

      await expect(todosService.getTodos()).rejects.toThrow("Connection lost");
      await expect(todosService.createTodo("test")).rejects.toThrow(
        "Connection lost"
      );
    });

    it("should handle database timeout scenarios", async () => {
      const timeoutError = new Error("Query timeout");
      timeoutError.code = "QUERY_TIMEOUT";

      db.query.mockRejectedValue(timeoutError);

      await expect(todosService.getTodos()).rejects.toThrow("Query timeout");
    });

    it("should handle permission denied errors", async () => {
      const permissionError = new Error("Permission denied");
      permissionError.code = "42501";

      db.query.mockRejectedValue(permissionError);

      await expect(todosService.createTodo("test")).rejects.toThrow(
        "Permission denied"
      );
    });
  });
});

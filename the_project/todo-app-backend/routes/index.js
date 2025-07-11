const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/todos", indexController.getTodos);
router.post("/todos", indexController.createTodos);
module.exports = router;

const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/todos", indexController.getTodo);
router.post("/todos", indexController.createTodo);
module.exports = router;

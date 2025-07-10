const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// router.get("/", indexController.getLogFile);
router.get("/", indexController.getPingPong);

module.exports = router;

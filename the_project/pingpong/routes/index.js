const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/pingpong", indexController.getPingpongCount);
router.get("/pings", indexController.currentPingpongCounter);
module.exports = router;

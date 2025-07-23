const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/", (req, res) => {
  res.status(200).json({ status: "oke", message: "Server is good" });
});
router.get("/pingpong", indexController.getPingpongCount);
router.get("/pings", indexController.currentPingpongCounter);

module.exports = router;

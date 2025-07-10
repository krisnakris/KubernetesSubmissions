const pingpongService = require("../services/pingpongService");

exports.getPingpongCount = (req, res) => {
  const text = pingpongService.pingpongManualCount();
  res.send(`Ping / Pongs: ${text}`);
};

exports.currentPingpongCounter = (req, res) => {
  const text = pingpongService.pingPongValue();
  res.json({ count: text });
};

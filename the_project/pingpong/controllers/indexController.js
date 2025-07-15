const pingpongService = require("../services/pingpongService");

exports.getPingpongCount = async (req, res) => {
  const text = await pingpongService.pingpongManualCount();
  res.send(`Ping / Pongs: ${text}`);
};

exports.currentPingpongCounter = async (req, res) => {
  const text = await pingpongService.pingPongValue();
  res.json({ count: text });
};

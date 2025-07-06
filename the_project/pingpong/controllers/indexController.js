const pingpongService = require("../services/pingpongService");

exports.getPingpongCount = (req, res) => {
  const text = pingpongService.pingpongCounter();

  res.send(`pong ${text}`);
};

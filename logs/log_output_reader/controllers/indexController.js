const logs = require("../services/logReader");
const stringService = require("../services/stringService");
const pingpongService = require("../services/pingpongRequest");

exports.getLogFile = (req, res) => {
  const logContent = logs.readLogFile();

  res.send(`<pre>${logContent}</pre>`);
};

exports.getPingPong = async (req, res) => {
  try {
    const currentTime = stringService.generateRandomString();
    const currentPingpong = await pingpongService.getPingPongData();

    if (currentPingpong.status !== 200) {
      return res.status(currentPingpong.status).json({
        error: `Error getting pingpong count: ${currentPingpong.data}`,
      });
    }

    res.send(`${currentTime} \nPing / Pongs: ${currentPingpong.data}`);
  } catch (error) {
    console.error("Error in getPingPong:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

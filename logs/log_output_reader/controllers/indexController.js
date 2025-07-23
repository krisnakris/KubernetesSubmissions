const logs = require("../services/logReader");
const stringService = require("../services/stringService");
const pingpongService = require("../services/pingpongRequest");

exports.getLogFile = (req, res) => {
  const logContent = logs.readFile("logFile");

  res.send(`<pre>${logContent}</pre>`);
};

exports.getPingPong = async (req, res) => {
  try {
    const currentTime = stringService.generateRandomString();
    const currentPingpong = await pingpongService.getPingPongData();

    if (currentPingpong.status !== 200) {
      res.status(200).send(`<pre>
        file content: ${logs.readFile("configFile").trim()}
        env variable: MESSAGE=${process.env.MESSAGE}
        ${currentTime}
        ERROR: Error getting pingpong count - ${currentPingpong.data}
        Status: ${currentPingpong.status}
        </pre>`);
      return;
    }

    res.send(`<pre>
      file content: ${logs.readFile("configFile").trim()}
      env variable: MESSAGE=${process.env.MESSAGE}
      ${currentTime}
      Ping / Pongs: ${currentPingpong.data}
      </pre>`);
  } catch (error) {
    console.error("Error in getPingPong:", error);
    res.status(200).send(`<pre>
      file content: ${logs.readFile("configFile").trim()}
      env variable: MESSAGE=${process.env.MESSAGE}
      ${stringService.generateRandomString()}
      ERROR: Internal server error - ${error.message}
      </pre>`);
  }
};

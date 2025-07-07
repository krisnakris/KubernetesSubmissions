const logs = require("../services/logReader");

exports.getLogFile = (req, res) => {
  const logContent = logs.readLogFile();

  res.send(`<pre>${logContent}</pre>`);
};

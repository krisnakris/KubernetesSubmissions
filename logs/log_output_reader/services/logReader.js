const fs = require("fs");
const path = require("path");

const logFile = path.join("/usr/src/app/files", "log.txt");
const configFile = path.join("/app/config", "information.txt");

const readFile = (params) => {
  let path;
  if (params == "logFile") {
    path = logFile;
  } else if (params == "configFile") {
    path = configFile;
  } else {
    return "log";
  }

  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, "utf8");
      return data;
    } else {
      return "Log file not found";
    }
  } catch (err) {
    console.error("Error reading log file:", err);
    return "Error reading log file";
  }
};

module.exports = {
  readFile,
};

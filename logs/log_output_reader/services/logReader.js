const fs = require("fs");
const path = require("path");

const logFile = path.join("/usr/src/app/files", "log.txt");

const readLogFile = () => {
  try {
    if (fs.existsSync(logFile)) {
      const data = fs.readFileSync(logFile, "utf8");
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
  readLogFile,
};

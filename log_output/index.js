const fs = require("fs");
const path = require("path");
const { generateRandomString } = require("./services/stringService");

const logDir = "/usr/src/app/files";
const logFile = path.join(logDir, "log.txt");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const writeLogToFile = () => {
  const logEntry = generateRandomString();
  fs.appendFile(logFile, logEntry + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log("Log written:", logEntry);
    }
  });
};

setInterval(writeLogToFile, 5000);

const fs = require("fs");
const path = require("path");

let count = -1;

const logFile = path.join("/usr/src/app/files", "log.txt");

const ensureDirectoryExists = () => {
  const dir = path.dirname(logFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const pingpongCounter = () => {
  count++;
  const message = `"Ping / Pong": ${count}\n`;

  try {
    ensureDirectoryExists();
    fs.appendFileSync(logFile, message);
    console.log(`Logged to file: "Ping / Pong": ${count}`);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }

  return count;
};

let pingpongCount = 0;
const pingpongManualCount = () => {
  pingpongCount++;
  return pingpongCount;
};

const pingPongValue = () => {
  return pingpongCount;
};

module.exports = {
  pingpongCounter,
  pingpongManualCount,
  pingPongValue,
};

const stringService = require("../services/stringService");

exports.getHomePage = (req, res) => {
  const text = stringService.generateRandomString();

  res.send({ text });
};

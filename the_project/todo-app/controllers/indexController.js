const stringService = require("../services/stringService");

exports.getHomePage = (req, res) => {
  const text = stringService.generateRandomString();

  res.render("index", {
    title: "Hello World!",
    appName: "Todo Application",
    text: `${text}`,
  });
};

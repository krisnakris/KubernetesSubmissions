const stringService = require("../services/stringService");
const imageService = require("../services/imageService");

exports.getHomePage = async (req, res) => {
  const text = stringService.generateRandomString();
  const imageUrl = await imageService.getImage();

  res.render("index", {
    title: "The project App",
    text: `DevOps with Kubernetes 2025`,
    imageUrl: imageUrl,
  });
};

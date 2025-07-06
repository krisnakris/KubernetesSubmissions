require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3002;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "DEV") {
  app.use("/images", express.static(path.join(__dirname, "files")));
} else {
  app.use("/images", express.static("/usr/src/app/files"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

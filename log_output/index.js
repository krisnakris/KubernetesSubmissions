require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

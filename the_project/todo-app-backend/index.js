require("dotenv").config();

const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

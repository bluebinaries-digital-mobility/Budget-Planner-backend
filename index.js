const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const nodeEnvConfig = require("./nodeEnvConfig");
nodeEnvConfig.envConfig();
const port = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const budgetRequest = require("./routes/budgetapprouter");
app.use("/budget-app/", budgetRequest);
app.use(express.static("uploads"));

app.all("*", (req, res, next) => {
  const err = new Error(`Requested URL ${req.path} not found !`);
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: 0,
    message: err.message,
    stack: err.stack,
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

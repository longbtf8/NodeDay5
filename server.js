require("dotenv").config();
require("module-alias/register");
const express = require("express");
const app = express();
const port = 3001;
const apiRoute = require("@/routes/index");
const responseFormat = require("@/middlewares/responseFormat");
const { apiRateLimiter } = require("@/middlewares/rateLimiter");
const notFoundHandler = require("@/middlewares/notFoundHandler");
const exceptionHandler = require("@/middlewares/exceptionHandler");

app.use(express.json());
app.use(responseFormat);
app.use(apiRateLimiter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoute);

app.use(notFoundHandler);
app.use(exceptionHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const router = express.Router();
const fs = require("node:fs");
fs.readdirSync("./src/routes")
  .filter((_filename) => _filename !== "index.js")
  .forEach((_filename) => {
    const resourceName = _filename.replace(".route.js", "");
    router.use(`/${resourceName}`, require(`./${_filename}`));
  });
module.exports = router;

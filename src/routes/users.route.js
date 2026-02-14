const express = require("express");
const router = express.Router();
const userController = require("@/controller/user.controller");
router.get("/", userController.findAll);
router.get("/search", userController.findEmail);
module.exports = router;

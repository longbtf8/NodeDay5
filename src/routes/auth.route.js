const express = require("express");
const router = express.Router();
const authController = require("@/controller/auth.controller");
const authRequired = require("@/middlewares/authRequired");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/me", authRequired, authController.getInfoUser);
module.exports = router;

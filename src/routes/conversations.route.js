const express = require("express");
const router = express.Router();
const conversationController = require("@/controller/conversation.controller");
router.post("/", conversationController.createConversation);

module.exports = router;

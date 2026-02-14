const express = require("express");
const router = express.Router();
const conversationController = require("@/controller/conversation.controller");
const authRequired = require("@/middlewares/authRequired");
router.post("/", conversationController.createConversation);
router.get("/", authRequired, conversationController.getMyConversations);

router.post("/:id/participants", conversationController.addMember);

router.post("/:id/messages", authRequired, conversationController.sendMessage);
module.exports = router;

router.get("/:id/messages", authRequired, conversationController.getMessage);
module.exports = router;

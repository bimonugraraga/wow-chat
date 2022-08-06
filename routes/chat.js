const express = require('express')
const router = express.Router()
const ChatController = require("../controllers/chat/chat_controller")
const authn = require("../middlewares/authentication")

router.use(authn)
router.post("/send", ChatController.SendChat)
router.get("/my-chat/:receiver_id", ChatController.GetMyChat)
router.get("/last-chat", ChatController.GetInvolved)
module.exports = router
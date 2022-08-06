const express = require('express')
const router = express.Router()
const userRoute = require("./user")
const chatRoute = require("./chat")

router.use("/user", userRoute)

router.use("/chat", chatRoute)


module.exports = router
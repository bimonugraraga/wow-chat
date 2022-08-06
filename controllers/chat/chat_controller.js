const ChatService = require("../../services/chat")
class ChatController {
  static async SendChat (req, res, next){
    try {
      let params = req.parameters
      params = params.permit("receiver", "message","reply_to").value()
      if (!params.reply_to){
        delete params.reply_to
      }
      params.sender = req.User.id
      let sended = await ChatService.Send(params, next)
      if (sended){
        res.status(201).json(sended)
      }
    } catch (error) {
      next(error)
    }
  }

  static async GetMyChat (req, res, next){
    try {
      let {receiver_id} = req.params
      let params = {
        sender: req.User.id,
        receiver: +receiver_id,
        username: req.User.username
      }
      let messages = await ChatService.GetChat(params, next)
      res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }

  static async GetInvolved (req, res, next){
    try {
      let lastChat = await ChatService.LastChat(req.User, next)
      res.status(200).json(lastChat)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = ChatController
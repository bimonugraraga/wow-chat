const {User, Chat, Sequelize, sequelize} = require("../models")
const { Op } = require("sequelize");
class ChatService {
  static async Send(params, next){
    try {
      let receiver = await User.findOne({
        where: {
          id: params.receiver
        }
      })

      if (!receiver){
        throw {
          code: 404,
          message: "Target Receiver Not Found"
        }
      }

      let newMessage = await Chat.create(params)
      let sended = {
        id: newMessage.id,
        sender: newMessage.sender,
        receiver: newMessage.receiver,
        message: newMessage.message
      }
      if (params.reply_to){
        let reply_to_message = await Chat.findOne({
          where: {
            id: params.reply_to
          }
        })
        sended.reply_to_message = {
          reply_to: reply_to_message.id,
          message_replied: reply_to_message.message
        }
      }
      return sended
    } catch (error) {
      next(error)
    }
  }

  static async GetChat(params, next){
    try {
      let receiver = await User.findOne({
        where: {
          id: params.receiver
        }
      })

      if (!receiver){
        throw {
          code: 404,
          message: "Target Receiver Not Found"
        }
      }

      let messages = await Chat.findAll({
        where: {
          sender: {
            [Op.or] :[params.sender, params.receiver]
          },
          receiver: {
            [Op.or] :[params.sender, params.receiver]
          },
        },
        order: [['id', 'DESC']]
      })
      let myMessages = messages.map((el) => {
        let temp = {
          messages_id: el.id,
          sender: {
            id: el.sender,
            username: params.username
          },
          receiver: {
            id: receiver.id,
            username: receiver.username
          },
          messages: el.message,
          reply_to : !el.reply_to ? undefined: {
            id: el.reply_to,
          }
        }
        if (el.reply_to){
          for (let i = 0; i < messages.length; i++){
            if (el.reply_to === messages[i].id){
              temp.reply_to.message = messages[i].message
              break
            }
          }
        }
        return temp
      })
      return myMessages
    } catch (error) {
      next(error)
    }
  }

  static async LastChat(params, next){
    console.log(params)
    try {
      let allChatSender = await sequelize.query(`
      SELECT DISTINCT receiver FROM "Chats"
      WHERE sender = ${params.id}
      `)
      let allChatReceiver = await sequelize.query(`
      SELECT DISTINCT sender FROM "Chats"
      WHERE receiver = ${params.id}
      `)
      allChatSender = allChatSender[0] 
      allChatReceiver = allChatReceiver[0]
      let result = []
      for (let i = 0; i < allChatSender.length; i++){
        let temp = await Chat.findAll({
          where:{
            sender:params.id,
            receiver: allChatSender[i].receiver
          },
          include: ["sender_data", "receiver_data"],
          order: [['id', 'DESC']],
          limit: 1
        })
        result.push(temp[0])
      }
      for (let i = 0; i < allChatReceiver.length; i++){
        let temp = await Chat.findAll({
          where:{
            receiver:params.id,
            sender: allChatReceiver[i].sender
          },
          include: ["sender_data", "receiver_data"],
          order: [['id', 'DESC']],
          limit: 1
        })
        result.push(temp[0])
      }
      let result2 = []
      for (let i = 0; i < result.length; i++){
        let flag = true
        for (let j = i+1; j < result.length; j++){
          if(result[j].receiver && result[j].sender){
            if (result[j].receiver === result[i].sender && result[i].receiver === result[j].sender){
              if(result[j].id > result[i].id){
                result2.push(result[j])
              } else{
                result2.push(result[i])
              }
            }
            flag = false

          }
        }
        if (flag){
          result2.push(result[i])
        }
      }
      return result2
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ChatService
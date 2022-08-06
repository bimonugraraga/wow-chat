const {User} = require("../models")
const {verifPassword} = require("../helpers/hash_password")
const {signToken} = require("../helpers/jwt")
class UserService {
  static async RegisterUser (params, next){
    try {
      let newUser = await User.create(params)
      return newUser
    } catch (error) {
      next(error)
    }
  }

  static async LoginUser (params, next){
    try {
      let targetUser = await User.findOne({
        where: {
          username: params.username
        }
      })
      if (!targetUser){
        throw {
          code: 400,
          message: "Username or Password is Wrong"
        }
      }
      let isPassword = verifPassword(params.password, targetUser.password)
      if (!isPassword){
        throw {
          code: 400,
          message: "Username or Password is Wrong"
        }
      }
      let payload = {
        id:targetUser.id,
        username:targetUser.username
      }
      let access_token = signToken(payload)
      return {
        username: targetUser.username,
        access_token
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserService
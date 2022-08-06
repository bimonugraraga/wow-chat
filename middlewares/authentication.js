const {verifyToken} = require("../helpers/jwt")
const {User} = require("../models")
async function authn (req, res, next){
  try {
    if (!req.headers.authorization){
      throw {
        code: 401,
        message: "Please Login"
      }
    }
    let [type, access_token] = req.headers.authorization.split(' ');
    if(!type || !access_token){
      throw {
        code: 401,
        message: "Invalid Token"
      }
    }

    if( type.toLowerCase() != 'bearer' ){
      throw {
        code: 401,
        message: "Invalid Token"
      }
    }

    let payload = verifyToken(access_token)
    if (!payload){
      throw {
        code: 401,
        message: "Invalid Token"
      }
    }
    let targetUser = await User.findOne({
      where: {
        id: payload.id
      }
    })
    if (!targetUser || (targetUser.username !== payload.username)){
      throw {
        code: 401,
        message: "Invalid Token"
      }
    }

    req.User = {
      id: targetUser.id,
      username: targetUser.username
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authn
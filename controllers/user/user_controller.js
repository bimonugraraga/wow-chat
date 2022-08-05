const UserService = require("../../services/user")
class UserController{
  static async Register (req, res, next){

    try {
      let params = req.parameters
      params = params.permit("username", "password").value()
      let registered = await UserService.RegisterUser(params, next)
      if (registered){
        res.status(201).json({message: "Success Registered User"})
      }
    } catch (error) {
      next(error)
    }
  }

  static async Login (req, res, next){
    try {
      let params = req.parameters
      params = params.permit("username", "password").value()
      let loggedIn = await UserService.LoginUser(params, next)
      if (loggedIn) {
        res.status(200).json(loggedIn)
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController
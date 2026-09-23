//authentication related APIs; this file defines the api
const {Router}= require('express')
const authController=require("../controllers/auth.controller")
const authMiddleware = require('../middlewares/auth.middleware')

const authRouter= Router()
/** this is a multiline comment( JSDoc comments)
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUserController) //--> this is the api
//flow: Client-> POST/ register -> route -> controller -> response
// console.log("register api hit")
/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access public
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports= authRouter
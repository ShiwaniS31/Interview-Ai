//this file contains actual logic for api call like what happend when an api call hit!
const userModel= require("../models/user.model") //--> importing mongoose model(user schema)

const bcrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")
const tokenBlacklistModel= require("../models/blacklist.model")
/**
 * @name registerUserController 
 * @description register a new user, expects username, email, and pswd in the request body
 * @access public
 */
async function registerUserController(req, res){  //-- this function handles user registration
    const{username, email, password}= req.body  //-> extract the data sent from frontend

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    } //-- if any field missing - send error

    const isUserAlreadyExists= await userModel.findOne({
        $or:[{ username }, { email }]
    })
    if(isUserAlreadyExists){
        // if(isUserAlreadyExists.username==username){
            return res.status(400).json({
                message:"Account with this username or email already exists!"
            })
        // }
        // if(isUserAlreadyExists.email==email){
        //     return res.status(400).json({
        //         message:"This email address already exists!"
        //     })
        // }
    }

    //hashing the password: using bcrypt function of JS
    const hash= await bcrypt.hash(password,10)

    const user= await userModel.create({
        username,
        email,
        password:hash
    })
    //CREATING A TOKEN:
    const token= jwt.sign(
        { id:user._id, username:user.username },
        process.env.JWT_SECRET,
        { expiresIn:"1d" }//->token expires in 1 day
    )
    res.cookie("token", token)
    res.status(201).json({ //this 201- status code is used when new data is created
        message:"User registered successfully",
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })

}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access public
 */
async function loginUserController(req, res){
    const{ email, password }= req.body //email or password enterend by the user(request side)
    const user= await userModel.findOne({ email }) //finding the entered email by the user into the database

    if(!user){ //if user's entered email not found for the login then show error
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    //now if email found then checking the password 
    const isPasswordValid= await bcrypt.compare(password, user.password)

    //again if the pswd is wrong show the error
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    //creating a token
    const token= jwt.sign(
        { id:user._id, username:user.username },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message:"User loggedIn successfully.",
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutuUerController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res){
    const token= req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out Successfully."
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access public
 */
async function getMeController(req, res){
    const user= await userModel.findById(req.user.id);
    res.status(200).json({
        message:"User details fetched successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports= {
    registerUserController, loginUserController, logoutUserController, getMeController
}
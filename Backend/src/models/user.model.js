const mongoose= require("mongoose")
//schema of manogoDB
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique:[true, "username alreay taken"],
        required: true,
    },
    email:{
        type: String,
        unique: [true, "Accound already exists with this email address!"],
        required: true,
    },

    password:{
        type: String,
        required: true
    }
})

const userModel= mongoose.model("users", userSchema)

module.exports= userModel
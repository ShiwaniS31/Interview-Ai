const express = require("express")
const cookieParser= require("cookie-parser"); //middleware
const cors= require("cors")
const app= express()     //server creation

app.use(express.json())
app.use(cookieParser())
//requiring the authRouter which is created in routes folder
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

const authRouter= require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)  // prefix- 'api/auth', to use any api we have to use this prefix

app.use("/api/interview", interviewRouter) //-> api to ask for the resume, jobDescription, selfDescription from the user and give these details to the AI and then the ai will generate the report accordingly!


module.exports=app
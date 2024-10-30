const express = require('express')
const env = require('dotenv')
env.config()
const cors = require('cors')
const app = express()
const PORT = 3000
const signin = require('./Routes/Signin')
const login = require('./Routes/Login')
app.use(cors())
app.use(express.json())

app.use('/signin',signin)
app.use('/login',login)


app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(PORT,(req,res)=>{
    console.log(`The app is running at port ${PORT}`)
})

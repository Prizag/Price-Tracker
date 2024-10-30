const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./Routes/authRoutes');
connectDB()
const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);


app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(PORT,(req,res)=>{
    console.log(`The app is running at port ${PORT}`)
})

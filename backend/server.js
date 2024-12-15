const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./Routes/authRoutes');
connectDB()
const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

//changes made
/* ----------------------------------- */
//Routes/searchRoutes file created
const searchRoutes = require('./Routes/searchRoutes')
app.use('/search',searchRoutes)

/* ----------------------------------- */
app.use('/auth', authRoutes);
const itemRoutes=require('./Routes/itemRoutes')
app.use("/item",itemRoutes);
// app.use("/images",express.static('uploads'));
app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(PORT,(req,res)=>{
    console.log(`The app is running at port ${PORT}`)
})

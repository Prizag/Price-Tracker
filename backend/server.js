const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./Routes/authRoutes');
const googleRoutes=require('./Routes/googleApiRoutes');
const getImage = require('./Routes/getImageRoute')
const getWebsites = require('./Routes/priceVariations')

connectDB()

const app = express()

// const generateToken = require('./utils/generateToken');
const PORT = process.env.PORT||3000;
app.use(cors())
app.use(express.json())

app.use('/api/auth',googleRoutes);

//changes made
/* ----------------------------------- */
//Routes/searchRoutes file created
const searchRoutes = require('./Routes/searchRoutes')
app.use('/search',searchRoutes)

/* ----------------------------------- */
app.use('/auth', authRoutes);
const itemRoutes=require('./Routes/itemRoutes')
app.use("/item",itemRoutes);

app.use('/getImage',getImage);
app.use('/checkWebsites',getWebsites);
app.get('/',(req,res)=>{
    res.send('Hello world')
})


app.listen(PORT,(req,res)=>{
    console.log(`The app is running at port ${PORT}`)
})

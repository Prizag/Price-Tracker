const User = require('../Models/User');
const bcrypt=require('bcrypt');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignin=async (req,res)=>{
    const { token,username,password} = req.body;
   

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // User info (e.g., email, name, picture)
        const { email, name, picture } = payload;
         
        const hashedPassword = await bcrypt.hash(password,10)
         const newUser = await User.create({username,email,password:hashedPassword})
        // Generate a custom token for your app
        // const accessToken = jwt.sign({ email, name, picture }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const accessToken = generateToken(newUser._id)

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
}

const googleLogin=async(req,res)=>{
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // User info (e.g., email, name, picture)
        const { email, name, picture } = payload;
        
           const user = await User.findOne({email});
        // Generate a custom token for your app
        // const accessToken = jwt.sign({ email, name, picture }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const accessToken = generateToken(user._id)

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
}

module.exports={googleSignin,googleLogin};
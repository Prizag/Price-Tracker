const User = require('../Models/User')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { signupSchema, loginSchema } = require('../Validations/authValidation');


const signInUser = async(req,res)=>{
    try {
        const {username, email,password} = signupSchema.parse(req.body)
        
        const existingUser = await User.findOne({email});
        if (existingUser)
        {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt(password,10)
        const newUser = await User.create({username,email,password:hashedPassword})

        const token = generateToken(newUser._id)

        return res.status(201).json({ message: "Signup successful", token });
            

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const LogInUser = async(req,res)=>{
    try {
        const {email,password} = loginSchema.parse(req.body);
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = generateToken(user._id);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {signInUser,LogInUser}
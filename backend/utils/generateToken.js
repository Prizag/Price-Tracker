const jwt = require('jsonwebtoken');

const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.jwtSecret,{expiresIn:'1h'})
}


module.exports = generateToken
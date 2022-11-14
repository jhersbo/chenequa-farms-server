const jwt = require("jsonwebtoken")
require('dotenv').config()

const generateAccessToken = (user_id, email_address, is_admin)=>{
    let token = jwt
    .sign(
        {
            user_id: user_id, 
            email_address: email_address,
            is_admin: is_admin
        }, 
        process.env.TOKEN_SECRET, 
        {
            expiresIn: process.env.TOKEN_EXPIRATION
        }
    )
    return token
}

const decodeToken = (req)=>{
    const token = req.headers.authorization.split(' ')[1];

    if(!token) return new Error("No token found.")

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
        if(err){
            return
        }
        return decoded
    })

    return decodedToken
}

const doesTokenFail = (req, token)=>{
    let user_idMatch = req.body.user_id !== token.user_id;
    let email_addressMatch = req.body.email_address !== token.email_address;
    let expiredCheck = token.exp >= Date.now();

    console.log({user_idMatch, email_addressMatch, expiredCheck})

    if(user_idMatch || email_addressMatch || expiredCheck){
        return true
    }

    return false
}

module.exports = { generateAccessToken, decodeToken, doesTokenFail }
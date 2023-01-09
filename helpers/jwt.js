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

//if token is included and valid, will return decoded version.
//if not, will return undefined
const decodeToken = (req)=>{
    if(!req.headers.authorization) return

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

    if(user_idMatch || email_addressMatch || expiredCheck){
        return true
    }

    return false
}

const isUserAuthentic = (req, token)=>{
    if(!token.user_id || !req.body.user_id) return false
    let user_idMatch = req.body.user_id !== token.user_id;
    let expiredCheck = token.exp >= Date.now();

    if(user_idMatch || expiredCheck) return false

    return true
}

module.exports = { generateAccessToken, decodeToken, doesTokenFail, isUserAuthentic }
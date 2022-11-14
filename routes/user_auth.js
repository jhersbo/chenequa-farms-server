const router = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db

//bcrypt
const bcrypt = require('bcrypt')
const saltRounds = 10

const userExists = async (user_id)=>{
    let found = await user_auth.findOne({
        where: {
            user_id: user_id
        }
    })
    if(found !== null){
        return true
    }
    return false
}

const noDuplicates = async (user_id)=>{
    let user = await user_auth.findOne({
        where: {
            user_id: user_id
        }
    })
    if(user){
        return false
    }
    return true
}

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

//**********ROUTERS*************************************/
//get all users
router.get('/', async (req, res)=>{
    try{
        const foundUsers = await user_auth.findAll({})
        res.status(200).json(foundUsers)
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
})

//get specific user
router.get('/:user_id', async (req, res)=>{
    try{
        const foundUser = await user_auth.findOne({
            where: {
                user_id: req.params.user_id
            },
            include: [
                {
                    model: user_orders
                },
                {
                    model: subscriptions
                }
            ]
        })
        res.status(200).json(foundUser)
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
})

//create a new user
router.post('/', (req, res)=>{
    bcrypt.hash(req.body.password_hash, saltRounds, async (err, hash)=>{
        try{
            let newUser = {
                user_id: req.body.user_id,
                email_address: req.body.email_address,
                password_hash: hash,
                first_name: req.body.first_name.toLowerCase(),
                last_name: req.body.last_name.toLowerCase(),
                is_admin: false
            }          
            if(await noDuplicates(req.body.user_id)){
                await user_auth.create(newUser)
                res.status(200).json({
                    success: true,
                    data: {
                        ...newUser,
                        token: generateAccessToken(newUser.user_id, newUser.email_address, newUser.is_admin)
                    }
                })
                return
            }
            res.status(203).json({success: false, message: "User already exists."})
        }catch(err){
            res.status(500).json(err)
        }
    })
})

//password authentication
router.post('/auth', async (req, res)=>{
    await user_auth.findOne({
        where: {
            email_address: req.body.email_address
        }
    })
    .then((user)=>{
        if(!user){
            res.status(203).json({success: false, message: "Error. No user found."})
        }else{
            bcrypt.compare(req.body.password_hash, user.password_hash, (err, result)=>{
                if(result){
                    res.status(200).json({
                        success: true,
                        data: {
                            user_id: user.user_id,
                            email_address: user.email_address,
                            password_hash: user.password_hash,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            is_admin: user.is_admin,
                            token: generateAccessToken(user.user_id, user.email_address, user.is_admin)
                        }
                    })
                }else{
                    res.status(203).json({success: false, message: "Error. Incorrect passcode."})
                }
                
            })
        }
    })
    .catch((err)=>{
        res.status(500).json(err)
    })
})

//update user information
router.put('/', async (req, res)=>{
    const token = decodeToken(req)

    console.log(token)

    if(typeof token === "undefined"){
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token. Error while decoding the token."
        })
    }

    let user_idMatch = req.body.user_id !== token.user_id;
    let email_addressMatch = req.body.email_address !== token.email_address;
    let expiredCheck = token.exp >= Date.now();

    if(user_idMatch || email_addressMatch || expiredCheck){
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token."
        })
    }

    try{
        let user = await user_auth.findOne({
            where: {
                user_id: req.body.user_id
            }
        })
    
        if(!user){
            return res.status(203).json({
                success: false, 
                message: "Error. No user found."
            })
        }
    
        user = await user.update(req.body)

        return res.status(200).json({
            success: true,
            data: {
                user_id: user.user_id,
                email_address: user.email_address,
                password_hash: user.password_hash,
                first_name: user.first_name,
                last_name: user.last_name,
                is_admin: user.is_admin,
                token: generateAccessToken(user.user_id, user.email_address, user.is_admin)
            }
        })
    }catch(err){
        return res.status(500).json(err)
    }
})

//delete user
//add JWT authentication
router.delete('/', async (req, res)=>{
    try{
        user_auth.destroy({
            where: {
                user_id: req.body.user_id
            }
        })
        res.status(200).json("User deleted.")
    }catch(err){
        res.status(500).json("Error updating user.")
    }
})




module.exports = router
const router = require('express').Router()
require('dotenv').config()

//DBs
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db

//Helper functions
const { generateAccessToken, decodeToken, doesTokenFail } = require("../helpers/jwt")
const { noUserIdDuplicates } = require("../helpers/user_db_checks")

//bcrypt
const bcrypt = require('bcrypt')
const saltRounds = 10

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
            if(await noUserIdDuplicates(user_auth, req.body.user_id)){
                await user_auth.create(newUser)
                return res.status(200).json({
                    success: true,
                    data: {
                        ...newUser,
                        token: generateAccessToken(newUser.user_id, newUser.email_address, newUser.is_admin)
                    }
                })
                
            }else{
                return res.status(203).json({success: false, message: "User already exists."})
            }
            
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
router.put('/', (req, res)=>{
    
    const token = decodeToken(req)

    if(typeof token === "undefined"){
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token. Error while decoding the token."
        })
    }

    if(doesTokenFail(req, token)){
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token."
        })
    }

    bcrypt.hash(req.body.password_hash, saltRounds, async (err, hash)=>{
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
        
            user = await user.update({...req.body, password_hash: hash})
    
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
            return res.status(500).json({success: false, error: err, message: "Error updating user."})
        }
    })
})

//delete user
router.delete('/', async (req, res)=>{

    const token = decodeToken(req)

    if(typeof token === "undefined"){
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token. Error while decoding the token."
        })
    }

    if(doesTokenFail(req, token)){ 
        return res.status(203).json({
            success: false, 
            message: "Authentication error. Invalid bearer token."
        })
    }

    try{
        await user_auth.destroy({
            where: {
                user_id: req.body.user_id
            }
        })
        res.status(200).json({success: true, message: "User deleted."})
    }catch(err){
        res.status(500).json({success: false, error: err, message: "Error deleting user."})
    }
})

module.exports = router
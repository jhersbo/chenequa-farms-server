const router = require('express').Router()
require('dotenv').config()
const crypto = require("crypto")
const nodemailer = require("nodemailer")

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
            res.status(203).json({
                success: false, 
                message: "Error. No user found."
            })
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
                    res.status(203).json({
                        success: false, 
                        message: "Error. Incorrect passcode."
                    })
                }
                
            })
        }
    })
    .catch((err)=>{
        res.status(500).json(err)
    })
})

//forgot password *****NOT WORKING*****GMAIL NEEDS TO BE TROUBLESHOOTED
router.post('/forgot-password', async (req, res)=>{
    if(req.body.email_address === ""){
        return res.status(203).json({
            success: false,
            message: "Email address required in request body."
        })
    }
    try{
        let user = await user_auth.findOne({
            where: {
                email_address: req.body.email_address
            }
        })

        console.log(user)

        if(!user){
            return res.status(203).json({
                success: false,
                message: "No user by that email in DB."
            })
        }

        const token = crypto.randomBytes(20).toString("hex")
        console.log(token)
        user = await user.update({
            reset_password_token: token,
            //1 hour (ms)
            reset_password_expiration: (Date.now() + 360000)
        })

        // send email here
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`
            }
        })

        const mailOptions = {
            from: "ersbo.jack@gmail.com",
            to: user.email_address,
            subject: "Password reset link",
            text: `You are receiving this email because you requested the reset of the password for your account. \n` + `Please click on the following link or paste it into your web browser. This link is usable for one hour. \n` + `${process.env.LOCAL_CLIENT}forgot-password/${token} \n` + `If you did not request this, please ignore this email and your password will remain unchanged. \n`
        }

        transporter.sendMail(mailOptions, (err, response)=>{
            if(err){
                return res.status(203).json({
                    success: false,
                    error: err,
                    message: "There was an error sending the email."
                })
            }
            return res.status(200).json({
                success: true,
                response: response,
                message: "Email sent successfully."
            })
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            error: err,
            message: "Error setting token or sending recovery email."
        })
    }
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
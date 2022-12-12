const router = require('express').Router()
require('dotenv').config()
const crypto = require("crypto")
const nodemailer = require("nodemailer")

//DBs
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db

//Helper functions
const { generateAccessToken, decodeToken, doesTokenFail } = require("../helpers/jwt")
const { noUserEmailDuplicates } = require("../helpers/user_db_checks")

//bcrypt
const bcrypt = require('bcrypt')
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

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

        const user_id = crypto.randomBytes(10).toString("hex")

        console.log(user_id)

        try{
            let newUser = {
                user_id: user_id,
                email_address: req.body.email_address,
                phone_number: req.body.phone_number,
                password_hash: hash,
                first_name: req.body.first_name.toLowerCase(),
                last_name: req.body.last_name.toLowerCase(),
                is_admin: false
            }          
            if(await noUserEmailDuplicates(user_auth, req.body.email_address)){
                await user_auth.create(newUser)
                return res.status(200).json({
                    success: true,
                    data: {
                        ...newUser,
                        token: generateAccessToken(newUser.user_id, newUser.email_address, newUser.is_admin),
                        user_orders: [],
                        subscriptions: []
                    }
                })
            }else{
                return res.status(203).json({
                    success: false,
                    message: "A user already exists by this email."
                })
            }
            
        }catch(err){
            return res.status(500).json({
                success: false,
                error: err,
                message: "Unable to create account."
            })
        }
    })
})

//password authentication
router.post('/auth', async (req, res)=>{
    await user_auth.findOne({
        where: {
            email_address: req.body.email_address
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

    .then((user)=>{
        console.log(user)
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
                            phone_number: user.phone_number,
                            password_hash: user.password_hash,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            is_admin: user.is_admin,
                            user_orders: user.user_orders,
                            subscriptions: user.subscriptions,
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

//forgot password email ****OAUTH2 is not working
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

        if(!user){
            return res.status(203).json({
                success: false,
                message: "No user by that email in DB."
            })
        }

        const token = crypto.randomBytes(20).toString("hex")

        user = await user.update({
            reset_password_token: token,
            //1 hour (ms)
            reset_password_expiration: (Date.now() + 360000)
        })

        // send email here
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
                clientId: `${process.env.OAUTH_CLIENT_ID}`,
                clientSecret: `${process.env.OAUTH_CLIENT_SECRET}`,
                refreshToken: `${process.env.OAUTH_REFRESH_TOKEN}`
            }
        })

        const mailOptions = {
            from: "ersbo.jack@gmail.com",
            to: user.email_address,
            subject: "[TEST] ChenequaFarms.com password reset",
            text: `You are receiving this email because you requested the reset of the password for your account. \n\n` + `Please click on the following link or paste it into your web browser. This link is usable for one hour. \n\n` + `${process.env.LOCAL_CLIENT}forgot-password/${token} \n\n` + `If you did not request this, please ignore this email and your password will remain unchanged. \n\n` + `Thank you,\nChenequa Farms.`
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

//update password
router.put('/forgot-password', (req, res)=>{
    bcrypt.hash(req.body.password_hash, saltRounds, async (err, hash)=>{
        try{
            let user = await user_auth.findOne({
                where: {
                    email_address: req.body.email_address
                }
            })

            if(!user){
                return res.status(203).json({
                    success: false, 
                    message: "Error. No user found by that email address."
                })
            }

            let tokensMatch = user.reset_password_token === req.body.reset_password_token;
            let tokenNotExpired = user.reset_password_expiration >= Date.now();

            if(!tokensMatch || !tokenNotExpired){
                return res.status(203).json({
                    success: false, 
                    message: "Token validation error. Token incorrect or expired."
                })
            }

            user = await user.update({
                password_hash: hash
            })

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
            return res.status(500).json({
                success: false,
                error: err,
                message: "Error resetting password."
            })
        }
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
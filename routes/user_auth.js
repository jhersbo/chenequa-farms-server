const router = require('express').Router()
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db

//bcrypt

const bcrypt = require('bcrypt')
const saltRounds = 10

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

//create a new user **untested**
router.post('/', (req, res)=>{
    bcrypt.hash(req.body.password_hash, saltRounds, async (err, hash)=>{
        try{
            await user_auth.create({
                user_id: req.body.user_id,
                email_address: req.body.email_address,
                password_hash: hash,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            })
            if(err){
                res.status(401).json({bcrypt_error_msg: err})
                return
            }
            res.status(200).json("User created.")
        }catch(err){
            res.status(500).json("Error creating user.", err)
        }
    })
})

module.exports = router
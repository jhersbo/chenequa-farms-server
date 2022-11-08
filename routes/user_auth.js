const router = require('express').Router()
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
            if(await noDuplicates(req.body.user_id)){
                await user_auth.create({
                    user_id: req.body.user_id,
                    email_address: req.body.email_address,
                    password_hash: hash,
                    first_name: req.body.first_name.toLowerCase(),
                    last_name: req.body.last_name.toLowerCase()
                })
                res.status(200).json("User created.")
                return
            }
            res.status(203).json("User already exists")
        }catch(err){
            res.status(500).json("Error creating user.")
        }
    })
})

//password authentication
router.post('/auth', async (req, res)=>{
    await user_auth.findOne({
        where: {
            user_id: req.body.user_id
        }
    })
    .then((user)=>{
        if(!user){
            res.status(203).json("No user found.")
        }else{
            bcrypt.compare(req.body.password_hash, user.password_hash, (err, result)=>{
                if(result){
                    res.status(200).json("User authenticated.")
                }else{
                    res.status(203).json("Incorrect password.")
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
    bcrypt.hash(req.body.password_hash, saltRounds, async (err, hash)=>{
        try{
            if(await userExists(req.body.user_id)){
                await user_auth.update({ ...req.body, password_hash: hash }, {
                    where: {
                        user_id: req.body.user_id
                    }
                })
                res.status(200).json("User updated.")
            }else{
                res.status(203).json("User does not exist.")
            }
            
        }catch(err){
            res.status(500).json("Error updating user.")
        }
    })
})

//delete user
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
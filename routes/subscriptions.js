const router = require('express').Router()
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db
const { isUserAuthentic, decodeToken } = require("../helpers/jwt")

router.get('/', async (req, res)=>{
    try{
        let found = await subscriptions.findAll({})
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
    }
})

//get subscriptions by user
router.get('/:user_id', async (req, res)=>{
    try{
        let found = await subscriptions.findAll({
            where: {
                user_id: req.params.user_id
            }
        })
        res.status(200).json({
            success: true,
            data: found
        })
        return
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to retrieve subscriptions.",
            error: err
        })
        return
    }
})

//create a new subscription
router.post('/', async (req, res)=>{
    let token = decodeToken(req)
    if(!isUserAuthentic(req, token)){
        res.status(203).json({
            success: false,
            message: "Invalid authorization token."
        })
        return
    }
    try{
        await subscriptions.create(req.body)
        res.status(200).json("Subscription created.")
    }catch(err){
        res.status(500).json(err)
    }
})

//make edits to a subscription
router.put('/', async (req, res)=>{
    try{
        let found = await subscriptions.findOne({
            where: {
                sub_id: req.body.sub_id
            }
        })
        if(!found){
            res.status(203).json("No subscription by that ID exists.")
        }else{
            await found.update(req.body)
            res.status(200).json("Subscription updated.")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//delete a subscription
router.delete('/:sub_id', async (req, res)=>{
    let token = decodeToken(req)
    if(!isUserAuthentic(req, token)){
        res.status(203).json({
            success: false,
            message: "Invalid authorization token."
        })
        return
    }
    try{
        let found = await subscriptions.findOne({
            where: {
                sub_id: req.params.sub_id
            }
        })
        if(!found){
            res.status(203).json({
                success: false,
                message: "Unable to find subscription by that ID."
            })
            return
        }else{
            await found.destroy()
            res.status(200).json({
                success: true,
                message: "Subscription deleted."
            })
            return
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server error.",
            error: err
        })
        return
    }
})

module.exports = router
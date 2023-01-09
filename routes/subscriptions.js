const router = require('express').Router()
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory, sub_types } = db
const { isUserAuthentic, decodeToken } = require("../helpers/jwt")
const crypto = require("crypto")

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
    //authenticate user
    let token = decodeToken(req)
    //if no token, return
    if(!token){
        res.status(203).json({
            success: false,
            message: "No authorization token provided."
        })
        return
    }
    if(!isUserAuthentic(req, token)){
        res.status(203).json({
            success: false,
            message: "Invalid authorization token."
        })
        return
    }
    //generate subscription id
    let sub_id = crypto.randomBytes(10).toString("hex")
    //package sub data
    let newSub = {
        sub_id: sub_id,
        sub_type_id: req.body.sub_type_id,
        user_id: req.body.user_id,
        purch_date: String(Date.now()),
        renew_date: String(Date.now() + 2629746000),
        active: true,
        price: req.body.price
    }
    try{
        //create subscription
        await subscriptions.create(newSub)
        //decrement number_available on sub_types
        let found_sub_type = await sub_types.findOne({
            where: {
                sub_type_id: req.body.sub_type_id
            }
        })
        found_sub_type = await found_sub_type.update({
            number_available: found_sub_type.number_available - 1
        })
        res.status(200).json({
            success: true,
            message: "Subscription created."
        })
        return
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Error creating subscription.",
            error: err
        })
        return
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
    //if no token, return
    if(!token){
        res.status(203).json({
            success: false,
            message: "No authorization token provided."
        })
        return
    }
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
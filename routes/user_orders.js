const router = require('express').Router()
const crypto = require("crypto")
const { generateAccessToken, decodeToken, doesTokenFail, isUserAuthentic } = require("../helpers/jwt")
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db

//get all orders
router.get('/', async (req, res)=>{
    try{
        let found = await user_orders.findAll({})
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all unfilled orders
router.get('/unfilled', async (req, res)=>{
    try{
        let found = await user_orders.findAll({
            where: {
                filled: false
            }
        })
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
    }
})

//get orders by user
router.get('/:user_id', async (req, res)=>{
    try{
        let found = await user_orders.findAll({
            where: {
                user_id: req.params.user_id
            }
        })
        res.status(200).json({
            success: true,
            data: found
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to retrieve orders.",
            error: err
        })
    }
})

//get unfilled user orders
router.get('/unfilled', async (req, res)=>{
    try{
        let found = await user_orders.findAll({
            where: {
                filled: false
            }
        })
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
    }
})

//get unfilled user orders
router.get('/unfilled/:user_id', async (req, res)=>{
    try{
        let found = await user_orders.findAll({
            where: {
                user_id: req.params.user_id,
                filled: false
            }
        })
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
    }
})

//create a new order **IMPLEMENT CONFIRMATION EMAIL
router.post('/', async (req, res)=>{
    //see if user is authentic
    const token = decodeToken(req)
    if(!isUserAuthentic(req, token)){
        res.status(203).json({
            success: false,
            message: "Invalid authorization token."
        })
        return
    }
    //generate order id
    let order_id = crypto.randomBytes(10).toString("hex")
    //package order
    let newOrder = {
        order_id: order_id,
        user_id: req.body.user_id,
        order_price: req.body.order_price,
        order_content: req.body.order_content,
        filled: false,
        date_created: new Date().toString(),
        date_filled: null
    }
    //parse each item
    let parsedContent = newOrder.order_content.map((el, index)=>{
        return JSON.parse(el)
    })
    try{
        await user_orders.create(newOrder)
        //decrement the number of items remaining
        //should find a way to refactor this to be faster.
        await parsedContent.forEach(async ({ item, qty })=>{
            let foundInv = await inventory.findOne({
                where: {
                    item_id: item.item_id
                }
            })
            foundInv = await foundInv.update({
                number_remaining: foundInv.number_remaining - qty
            })
        })
        res.status(200).json({
            success: true,
            message: "Order created."
        })
        return
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Order creation failed.",
            error: err
        })
        return
    }
})

//make edits to an order
router.put('/', async (req, res)=>{
    try{
        let found = await user_orders.findOne({
            where: {
                order_id: req.body.order_id
            }
        })
        if(!found){
            res.status(203).json("No order by that ID exists.")
        }else{
            await found.update(req.body)
            res.status(200).json("Order updated.")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//delete an order
router.delete('/:order_id', async (req, res)=>{
    try{
        let found = await user_orders.findOne({
            where: {
                order_id: req.params.order_id
            }
        })
        if(!found){
            res.status(203).json("No order by that ID exists.")
        }else{
            await found.destroy()
            res.status(200).json("Order deleted.")
        }
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router
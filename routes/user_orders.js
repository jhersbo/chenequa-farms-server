const router = require('express').Router()
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
        res.status(200).json(found)
    }catch(err){
        res.status(500).json(err)
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

//create a new order
router.post('/', async (req, res)=>{
    try{
        await user_orders.create(req.body)
        res.status(200).json("Order created.")
    }catch(err){
        res.status(500).json(err)
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
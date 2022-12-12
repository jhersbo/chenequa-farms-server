const router = require('express').Router()
const db = require('../models')
const { inventory, categories } = db


//get whole inventory
router.get('/', async (req, res)=>{
    try{
        let foundInventory = await inventory.findAll({
            include: [
                {
                    model: categories,
                    attributes: {
                        exclude: ["category_id"]
                    }
                }
            ]
        })
        res.status(200).json({
            success: true,
            data: foundInventory
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to retrieve inventory.",
            error: err
        })
    }
})

//get a specific item from inventory
router.get('/:item_id', async (req, res)=>{
    try{
        let foundItem = await inventory.findOne({
            where: {
                item_id: req.params.item_id
            }
        })
        if(foundItem){
            res.status(200).json({
                success: true,
                data: foundItem
            })
        }else{
            res.status(203).json({
                success: false,
                message: "No item by that ID exists."
            })
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to retrieve item.",
            error: err
        })
    }
})

//create a new item
router.post('/', async (req, res)=>{
    try{
        let newItem = await inventory.create(req.body)
        return res.status(200).json({
            success: true,
            data: newItem
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create new item.",
            error: err
        })
    }
})

//update or edit an item
router.put('/', async (req, res)=>{
    try{
        let editedItem = await inventory.update(req.body, {
            where: {
                item_id: req.body.item_id
            }
        })
        res.status(200).json({
            success: true,
            data: editedItem
        })
    }catch(err){
        res.status(500).json({
            success: true,
            message: "Unable to edit item.",
            error: err
        })
    }
})

//delete an item from the database
router.delete('/:item_id', async (req, res)=>{
    try{
        let found = await inventory.findOne({
            where: {
                item_id: req.params.item_id
            }
        })
        if(found){
            await found.destroy();
            res.status(200).json({
                success: true,
                message: "Item deleted."
            })
        }else{
            res.status(203).json({
                success: false,
                message: "No item by that ID found."
            })
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Error deleting item.",
            error: err
        })
    }
})

module.exports = router
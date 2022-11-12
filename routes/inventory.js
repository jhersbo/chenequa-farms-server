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
        res.status(200).json(foundInventory)
    }catch(err){
        res.status(500).json(err)
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
            res.status(200).json(foundItem)
        }else{
            res.status(203).json("No item by that ID exists.")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//create a new item
router.post('/', async (req, res)=>{
    try{
        await inventory.create(req.body)
        res.status(200).json("Item created.")
    }catch(err){
        res.status(500).json("Error creating new item.", err)
    }
})

//update or edit an item
router.put('/', async (req, res)=>{
    try{
        await inventory.update(req.body, {
            where: {
                item_id: req.body.item_id
            }
        })
        res.status(200).json("Item updated.")
    }catch(err){
        res.status(500).json("Error updating item.", err)
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
            res.status(200).json("Item deleted.")
        }else{
            res.status(203).json("No item by that ID exists.")
        }
    }catch(err){
        res.status(500).json("Error deleting item.")
    }
})

module.exports = router
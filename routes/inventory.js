const router = require('express').Router()
const db = require('../models')
const { inventory } = db

router.get('/', async (req, res)=>{
    try{
        let foundInventory = await inventory.findAll({})
        res.status(200).json(foundInventory)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router
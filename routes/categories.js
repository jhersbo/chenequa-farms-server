const router = require('express').Router()
const db = require('../models')
const { categories } = db

router.get('/', async (req, res)=>{
    try{
        let found = await categories.findAll({})
        res.status(200).json({
            success: true,
            data: found
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err,
            message: "Error retrieving categories."
        })
    }
})

module.exports = router
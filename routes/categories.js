const router = require('express').Router()
const db = require('../models')
const { categories, inventory } = db

router.get('/', async (req, res)=>{
    try{
        let found = await categories.findAll({
            include: [
                {
                    model: inventory
                }
            ]
        })
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

router.get('/:category_id', async (req, res)=>{
    try{
        let found = await categories.findOne({
            where: {
                category_id: req.params.category_id
            },
            include: [
                {
                    model: inventory
                }
            ]
        })
        if(!found){
            return res.status(203).json({
                success: false,
                message: "Invalid category ID."
            })
        }
        return res.status(200).json({
            success: true,
            data: found
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err,
            message: "Error retrieving category's inventory."
        })
    }
})

module.exports = router
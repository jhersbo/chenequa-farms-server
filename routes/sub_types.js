const router = require('express').Router()
const db = require('../models')
const { sub_types } = db

//get all subs
router.get("/", async (req, res)=>{
    try{
        let foundSubs = await sub_types.findAll()
        res.status(200).json({
            success: true,
            data: foundSubs
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to find subscriptions.",
            error: err
        })
    }
})

module.exports = router
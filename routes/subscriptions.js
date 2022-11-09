const router = require('express').Router()
const db = require('../models')
const { user_auth, user_orders, subscriptions, inventory } = db



module.exports = router
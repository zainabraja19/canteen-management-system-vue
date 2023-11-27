const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/admin/orderController')

router.get('', orderController.fetchOrders)  // Get employee orders


module.exports = router
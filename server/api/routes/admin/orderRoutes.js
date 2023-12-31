const express = require("express");
const router = express.Router();

const orderController = require("../../controllers/admin/orderController");

router.get("", orderController.fetchOrders); // Get employee orders
router.patch("", orderController.completeOrder);

module.exports = router;

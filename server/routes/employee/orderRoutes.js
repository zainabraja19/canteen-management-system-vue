const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateRequest } = require("../../middleware/schemaValidator");
const { orderSchema } = require("../../schema/employeeSchema");

const orderController = require("../../controllers/employee/orderController");

router.post("", validateRequest(orderSchema), orderController.placeOrder); // Place order
router.get("", orderController.fetchOrders); // Fetch orders
router.patch("/:orderId", orderController.cancelOrder); // Cancel order
router.get("/:orderId/generateInvoice", orderController.generateInvoice); // Generate invoice

module.exports = router;

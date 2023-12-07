const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    validateRequestBody,
    validateRequestParams,
} = require("../../../middleware/schemaValidator");
const {
    orderSchema,
    paymentSchema,
    verifyPaymentSchema,
    orderParamsSchema,
} = require("../../schema/employeeSchema");

const orderController = require("../../controllers/employee/orderController");

router.post("", validateRequestBody(orderSchema), orderController.placeOrder); // Place order
router.get("", orderController.fetchOrders); // Fetch orders
router.post(
    "/initiatePayment",
    validateRequestBody(paymentSchema),
    orderController.handlePayment
);
router.post(
    "/verifyPayment",
    validateRequestBody(verifyPaymentSchema),
    orderController.verifyPayment
); // Generate invoice
router.patch(
    "/:orderId",
    validateRequestParams(orderParamsSchema),
    orderController.cancelOrder
); // Cancel order
router.get(
    "/:orderId/generateInvoice",
    validateRequestParams(orderParamsSchema),
    orderController.generateInvoice
); // Generate invoice

module.exports = router;

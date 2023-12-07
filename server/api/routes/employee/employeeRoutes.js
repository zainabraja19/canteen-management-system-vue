// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const menuRoutes = require("./menuRoutes");
const orderRoutes = require("./orderRoutes");
const cartRoutes = require("./cartRoutes");
const profileRoutes = require("./profileRoutes");
const {
    validateRequestParams,
} = require("../../../middleware/schemaValidator");
const { employeeParamsSchema } = require("../../schema/employeeSchema");

router.use("/menu", menuRoutes);
router.use(
    "/:empId",
    validateRequestParams(employeeParamsSchema),
    profileRoutes
);
router.use(
    "/:empId/order",
    validateRequestParams(employeeParamsSchema),
    orderRoutes
);
router.use(
    "/:empId/cart",
    validateRequestParams(employeeParamsSchema),
    cartRoutes
);

module.exports = router;

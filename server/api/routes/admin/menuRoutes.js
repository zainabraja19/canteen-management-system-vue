const express = require("express");
const router = express.Router();
const {
    validateRequestBody,
    validateRequestParams,
} = require("../../../middleware/schemaValidator");
const {
    addMenuItemSchema,
    editMenuItemSchema,
    itemParamsSchema,
} = require("../../schema/adminSchema");

const menuController = require("../../controllers/admin/menuController");

router.get("", menuController.fetchMenu); // Get menu
router.post("", validateRequestBody(addMenuItemSchema), menuController.addItem); // Add item to menu
router.patch(
    "/:itemId",
    validateRequestParams(itemParamsSchema),
    validateRequestBody(editMenuItemSchema),
    menuController.editItem
); // Edit item details

module.exports = router;

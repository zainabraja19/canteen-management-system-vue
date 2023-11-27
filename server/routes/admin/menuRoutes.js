const express = require('express')
const router = express.Router()
const { validateRequest } = require('../../middleware/schemaValidator')
const { addMenuItemSchema, editMenuItemSchema } = require('../../schema/adminSchema')

const menuController = require('../../controllers/admin/menuController')

router.get('', menuController.fetchMenu)   // Get menu
router.post('', validateRequest(addMenuItemSchema), menuController.addItem)    // Add item to menu
router.patch('/:itemId', validateRequest(editMenuItemSchema), menuController.editItem)  // Edit item details

module.exports = router
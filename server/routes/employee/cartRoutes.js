const express = require('express')
const router = express.Router({ mergeParams: true })
const { validateRequest } = require('../../middleware/schemaValidator')
const { addItemToCartSchema, removeItemFromCartSchema } = require('../../schema/employeeSchema')

const cartController = require('../../controllers/employee/cartController')

router.get('', cartController.fetchCart)    // Fetch cart
router.post('', validateRequest(addItemToCartSchema), cartController.addToCart)   // Add item to cart
router.patch('', validateRequest(removeItemFromCartSchema), cartController.removeFromCart) // Remove item from cart
router.get('/cartCount', cartController.cartCount)   // Cart count

module.exports = router



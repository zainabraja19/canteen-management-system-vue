const express = require('express')
const router = express.Router()

const menuController = require('../../controllers/employee/menuController')

router.get('', menuController.fetchMenu)

module.exports = router
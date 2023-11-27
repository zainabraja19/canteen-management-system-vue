// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const menuRoutes = require('./menuRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const profileRoutes = require('./profileRoutes');

router.use('/menu', menuRoutes);
router.use('/:empId', profileRoutes)
router.use('/:empId/order', orderRoutes);
router.use('/:empId/cart', cartRoutes);

module.exports = router;
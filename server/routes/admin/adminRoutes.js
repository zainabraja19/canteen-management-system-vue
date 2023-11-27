// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const menuRoutes = require('./menuRoutes');
const orderRoutes = require('./orderRoutes');

router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);

module.exports = router;

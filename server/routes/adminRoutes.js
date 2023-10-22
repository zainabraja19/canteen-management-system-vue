const router = require('express').Router();
const Menu = require("../models/menu")
const Cart = require("../models/cart")
const auth = require('../middleware/auth')
const { ObjectId } = require('mongodb');
const Employee = require('../models/employee');
const Order = require('../models/orders')

// Show Menu with all items
router.get('/menu', async (req, res) => {
    try {
        const menu = await Menu.find({})
        res.status(200).json({ data: menu })
    } catch (error) {
        res.json(500).json({ data: null, error })
    }
})

// Remaining orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ completed: false })
            .populate('employee', 'empId name phone')
            .populate('items.item')
            .exec()

        res.status(200).json({ data: orders })
    }
    catch (err) {
        res.status(400).json({ data: null, error: err })
    }
})

// Add item
router.post('/item', async (req, res) => {
    const menuItem = new Menu(req.body)

    try {
        await menuItem.save()
        res.status(201).json({ data: "Added new item!" })
    } catch (e) {
        console.log(e)
        res.status(400).json({ data: null, error: e })
    }
})

// Edit item details
router.patch('/item/:id', async (req, res) => {
    try {
        // const updatedMenu = await Menu.findByIdAndUpdate(id)
    } catch (err) { }
})

// Remove item
router.delete('/item/:id', async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);

        if (!emp) {
            return res.status(404).json({ data: null, error: 'Item not found' });
        }

        // update the document and remove item

        // await Cart.deleteMany({ "items.item": req.params.id });
        // await Order.deleteMany({ "items.item": req.params.id });

        res.status(200).json({ data: "Deleted item successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ data: null, error: e })
    }
})

module.exports = router;
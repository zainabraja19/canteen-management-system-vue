const router = require('express').Router();
const Menu = require("../models/menu")
const Order = require('../models/orders')

// Show Menu with all items
router.get('/menu', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    // const perPage = parseInt(req.query.perPage) || 10;
    const perPage = 10
    const skip = (page - 1) * perPage;

    try {
        // const totalOrders = await Order.find({}).count()
        const totalItems = await Menu.find({}).count()
        const menu = await Menu.find({}).skip(skip).limit(perPage)

        // const filteredMenu = menu.skip(skip).limit(perPage)
        res.status(200).json({ data: { totalItems, menu } })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Remaining orders
router.get('/orders', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    // const perPage = parseInt(req.query.perPage) || 10;
    const perPage = 10
    const skip = (page - 1) * perPage;

    const filter = req.query.filter
    let totalOrders;
    let orders;
    try {
        console.log(req.query);
        if (filter === 'all') {
            totalOrders = await Order.find({}).count()
            orders = await Order.find({}).sort({ completed: 1, orderDate: -1 }).skip(skip).limit(perPage)
                .populate('employee', 'empId name phone')
                .populate('items.item')
                .exec()
        } else if (filter === 'remaining') {
            totalOrders = await Order.find({ completed: false }).count()
            orders = await Order.find({ completed: false }).skip(skip).limit(perPage)
                .populate('employee', 'empId name phone')
                .populate('items.item')
                .exec()
        } else {
            totalOrders = await Order.find({ completed: true }).count()
            orders = await Order.find({ completed: true }).skip(skip).limit(perPage)
                .populate('employee', 'empId name phone')
                .populate('items.item')
                .exec()
        }

        res.status(200).json({ data: { orders, totalOrders } })
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
        console.log(req.params.id, req.body);
        const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
        console.log(updatedMenu);
    } catch (err) { }
})

// Remove item
router.delete('/item/:id', async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);

        if (!item) {
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
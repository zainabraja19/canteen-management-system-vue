const router = require('express').Router();
const Menu = require("../models/menu")
const Cart = require("../models/cart")
const Employee = require('../models/employee');
const Order = require('../models/orders')
const multer = require('multer')
const nodemailer = require('nodemailer');
require('dotenv').config()


const storage = multer.memoryStorage();

// configure upload options for profile picture
const imgUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2 MB (in bytes)
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
});

// Upload employee profile picture
router.post('/:empId/profilePicture', imgUpload.single('profilePicture'), async (req, res) => {
    try {
        const empId = req.params.empId
        const image = req.file.buffer;

        await Employee.findOneAndUpdate({ empId }, { profilePicture: image }, { new: true, passRawResult: true })

        res.status(200).json({
            status: 'success',
            data: {
                id: empId,
                name: req.file.originalname,
                size: req.file.size,
            },
        })
    } catch (err) {
        res.status(400).json({ status: 400, data: null, error: err })
    }
})

// Fetch employee profile picture
router.get('/:empId/profilePicture', async (req, res) => {
    try {

        const empProfile = await Employee.findOne({ empId: req.params.empId }).select('profilePicture')

        res.status(200).json({ data: empProfile })

    } catch (err) {
        res.status(400).json({ data: null, error: err })
    }
})

// configure upload options for profile picture
const pdfUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB (in bytes)
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
            return cb(new Error('Please upload only .pdf files.'))
        }

        cb(undefined, true)
    }
});

// Upload employee resume
router.post('/:empId/resume', pdfUpload.single('resume'), async (req, res) => {
    try {
        const empId = req.params.empId
        // console.log(req.body);
        // console.log(req.file)
        const resume = req.file.buffer;
        const contentType = req.file.mimetype
        // console.log(image, contentType);
        const emp = await Employee.findOneAndUpdate({ empId }, { resume }, { new: true, passRawResult: true })
        // const emp = { ...user.toObject() };
        // delete emp.profilePicture;
        console.log("update");
        res.status(200).json({
            status: 'success',
            data: {
                id: empId,
                name: req.file.originalname,
                size: req.file.size,
            },
        })
    } catch (err) {
        res.status(400).json({ status: 400, data: null, error: err })
    }
})

// Fetch employee profile picture
router.get('/:empId/resume', async (req, res) => {
    try {

        const empResume = await Employee.findOne({ empId: req.params.empId }).select('resume')

        res.status(200).json({ data: empResume })

    } catch (err) {
        res.status(400).json({ data: null, error: err })
    }
})

// Show Menu
router.get('/menu', async (req, res) => {
    try {
        const menu = await Menu.find({ isAvailable: true })
        res.status(200).json({ data: menu })
    } catch (error) {
        res.json(500).json({ data: null, error })
    }
})

const totalItems = async (employee) => {
    try {
        let totalItems = 0
        const cart = await Cart.findOne({ employee })
        cart.items.map(item => {
            console.log(item);
            totalItems += item.quantity
        })

        return totalItems
        // res.status(200).json({ data: { count: cart.totalItems } })
    } catch (error) {
        // res.status(500).json({ data: null, error })
    }
}

const cartTotal = async (employee) => {
    try {
        let cartTotal = 0

        const cart = await Cart.findOne({ employee })
        cart.items.map(item => {
            console.log(item);
            cartTotal += (item.price * item.quantity)
        })
        return cartTotal
        // res.status(200).json({ data: { count: cart.cartTotal } })
    } catch (error) {
        // res.status(500).json({ data: null, error })
    }
}


// Add to cart
router.post('/:empId/cart', async (req, res) => {
    try {
        const itemId = req.body.itemId
        const empId = req.params.empId

        // Check if item is available
        const menuItem = await Menu.findById(itemId)

        if (!menuItem || !menuItem.isAvailable) {
            throw "Sorry, Item is not available!"
        }

        // Find the cart or create a new one if not exists
        let cart = await Cart.findOneAndUpdate(
            { employee: empId },
            { $setOnInsert: { employee: empId, items: [], totalItems: 0, cartTotal: 0 } },
            { new: true, upsert: true }
        );

        console.log(cart);

        // Find the item in the cart
        const itemInCart = cart.items.find(item => item.item.equals(itemId));

        let updatedCart
        if (itemInCart) {
            updatedCart = await Cart.findOneAndUpdate(
                { "items.item": itemId },
                { $inc: { "items.$.quantity": 1, totalItems: 1, cartTotal: menuItem.price } },
                { new: true }
            )
        } else {
            updatedCart = await Cart.findOneAndUpdate(
                { employee: empId },
                {
                    $push: {
                        items: {
                            item: itemId,
                            quantity: 1,
                            price: menuItem.price,
                        },
                    },
                    $inc: { totalItems: 1, cartTotal: menuItem.price },
                },
                { new: true, upsert: true }
            );
        }
        console.log(itemInCart ? "updated" : "added", updatedCart);
        res.status(200).json({ data: updatedCart });
    } catch (error) {
        res.status(400).json({ error });
    }
})

// Fetch cart
router.get('/:empId/cart', async (req, res) => {
    try {
        const employee = req.params.empId
        const cart = await Cart.findOne({ employee })
            .populate('items.item')

        console.log(cart);

        const { items, cartTotal, totalItems } = cart

        const data = {
            items,
            cartTotal,
            totalItems
        }

        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: null, error })
    }

})

// Remove from cart
router.patch('/:empId/cart', async (req, res) => {
    try {
        const itemId = req.body.itemId
        const empId = req.params.empId
        const deleteCount = req.body.deleteCount

        const menuItem = await Menu.findById(itemId)

        let updatedCart

        if (deleteCount > 1) {
            updatedCart = await Cart.findOneAndUpdate(
                { employee: empId },
                {
                    $pull: { 'items': { 'item': itemId } }, // Remove the item from the items array
                    $inc: { totalItems: -deleteCount, cartTotal: -(menuItem.price * deleteCount) },
                },
                { new: true, upsert: true }
            );
        } else {
            updatedCart = await Cart.findOneAndUpdate(
                { employee: empId, 'items.item': itemId },
                {
                    $inc: { "items.$.quantity": -1, totalItems: -1, cartTotal: -menuItem.price },
                },
                { new: true, upsert: true }
            );

            console.log(updatedCart);
        }
        res.status(200).json({ data: updatedCart });
    } catch (error) {
        res.status(400).json({ data: null, error })
    }
})

// Get cart items count
router.get('/:empId/cartCount', async (req, res) => {
    try {
        const cart = await Cart.findOne({ employee: req.params.empId })
        res.status(200).json({ data: { count: cart.totalItems } })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Get cart total
router.get('/cartTotal', async (req, res) => {
    try {
        const cart = await Cart.findOne({ employee: req.user.empId })
        cart.items.map(item => {
            console.log(item);
        })
        res.status(200).json({ data: { count: cart.cartTotal } })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Get employee details
router.get('/', async (req, res) => {
    try {
        // const emp = Employee.findById(req.user._id)
        res.status(200).json({ data: req.user })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Delete employee account
router.delete('/', async (req, res) => {
    try {
        const emp = await Employee.findByIdAndDelete(req.user._id);

        if (!emp) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await Cart.deleteMany({ employee: req.user._id });
        await Order.deleteMany({ orderedBy: req.user._id });

        res.status(200).json({ data: "Deleted successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ data: null, error: err })
    }
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zraja@argusoft.com',
        pass: 'Zainab@2120'
    }
});


// Place order
router.post("/order", async (req, res) => {
    try {
        // console.log(req.body);
        let order = new Order(req.body)
        console.log(order);

        // await order.save()


        order.populate('items.item')
        // console.log(order);
        // Configure receiver's mail
        const employee = await Employee.findOne({ empId: req.body.employee })
        order.items.map(async item => {
            console.log(item.item);
        })
        const mailOptions = {
            from: process.env.ADMIN_MAIL,
            to: process.env.ADMIN_MAIL,
            subject: 'New Order Placed',
            html: `
             <html>
                <head>
                <style>
                    table {
                        font-family: Arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                        margin-top: 1.2rem;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
                </head>
                <body>
                    <h3>Order Details:</h3>
                    <div>
                        <div>Ordered By:
                            <div>Employee Id: ${employee.empId}</div>
                            <div>Empoyee Name: ${employee.name}</div>
                            <div>Email: ${employee.email}</div>
                            <div>Phone number: ${employee.phone}</div>
                        </div>
                    </div>
                        <table>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.item.itemName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.item.price * item.quantity}</td>
                                </tr>
                             `).join('')}
                             <tr>
                                <td colspan="2"><b>Total Amount</b></td>
                                <td>${order.totalAmount}</td>
                             </tr>
                        </table>
                </body>
            </ >
            `,
            // You can also use HTML for the email body:
            // html: '<h1>Hello from Nodemailer</h1><p>This is a test email.</p>'
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).json({ data: order })
    } catch (error) {
        res.status(400).json({ data: null });
    }
})

// Get order detail
router.get('/order', async (req, res) => {
    try {
        const orders = await Order.findOne({ employee: req.user.empId })
            .populate("items.item")
            .exec();

        res.status(200).json({ data: orders })
    } catch (err) {
        res.status(500).json({ data: null, error: err })
    }
})


module.exports = router
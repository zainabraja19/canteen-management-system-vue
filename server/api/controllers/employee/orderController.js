const orderService = require("../../services/employee/orderService");
const { createInvoice } = require("../../helpers/invoice");
const { generateOrder } = require("../../helpers/razorpay");
const crypto = require("crypto");

const placeOrder = async (req, res) => {
    try {
        const data = await orderService.placeOrder({
            employee: req.user._id,
            body: req.body,
            empId: req.params.empId,
            user: req.user,
        });

        res.status(200).json({
            data,
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const fetchOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const data = await orderService.fetchOrders({
            perPage,
            skip,
            queryFilter: req.query.filter,
            employee: req.user._id,
        });

        res.status(200).json({ data, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const data = await orderService.cancelOrder({
            empId: req.user._id,
            orderId: req.params.orderId,
        });

        res.status(200).json({ data, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const generateInvoice = async (req, res) => {
    try {
        const result = await orderService.generateInvoice({
            skip: 0,
            perPage: 1,
            employee: req.user._id,
            orderId: +req.params.orderId,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');

        result.pipe(res);
        result.end();
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const handlePayment = async (req, res) => {
    try {
        const amount = req.body.amount;
        //
        const data = await orderService.handlePayment({ amount });

        res.status(200).send(data);
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const data = await orderService.verifyPayment(req.body);

        res.status(200).json({
            data,
            status: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error.message,
            status: 400,
        });
    }
};

module.exports = {
    placeOrder,
    fetchOrders,
    cancelOrder,
    generateInvoice,
    handlePayment,
    verifyPayment,
};

const orderService = require("../../services/employee/orderService");
const cartService = require("../../services/employee/cartService");
const { transporter, mailOptions } = require("../../utils/emailConfig");
const { createInvoice } = require("../../utils/invoice");

const placeOrder = async (req, res) => {
    try {
        const orderResult = await orderService.placeOrder({
            empId: req.user._id,
            body: req.body,
        });

        // Send the email
        transporter.sendMail(
            mailOptions(req.user, orderResult),
            function (error, info) {
                if (error) {
                    throw error;
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );

        await cartService.emptyCart({
            empId: req.params.empId,
        });

        res.status(200).json({
            data: { orderId: orderResult.orderId },
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

        const query = { employee: req.user._id };

        const data = { perPage, skip, query };

        const result = await orderService.fetchOrders(data);
        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const data = { empId: req.user._id, orderId: req.params.orderId };
        const result = await orderService.cancelOrder(data);

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const generateInvoice = async (req, res) => {
    try {
        const query = { employee: req.user._id, orderId: +req.params.orderId };
        const data = { skip: 0, perPage: 1, query };

        const result = await orderService.fetchOrders(data);

        if (!result || !result.orders || result.orders.length === 0) {
            return res.status(404).json({
                data: null,
                error: "Order not found",
                status: 404,
            });
        }

        const pdf = createInvoice(result.orders[0], "invoice.pdf");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');

        pdf.pipe(res);
        pdf.end();
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    placeOrder,
    fetchOrders,
    cancelOrder,
    generateInvoice,
};

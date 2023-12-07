const orderService = require("../../services/admin/orderService");

const fetchOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const result = await orderService.fetchOrders({
            perPage,
            skip,
            filter: req.query.filter,
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const completeOrder = async (req, res) => {
    try {
        const result = await orderService.completeOrder({
            orderId: req.body.orderId,
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error.message,
            status: 400,
        });
    }
};

module.exports = {
    fetchOrders,
    completeOrder,
};

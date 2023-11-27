const orderService = require("../../services/admin/orderService");

const fetchOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        let query = { cancelled: false };

        const filter = req.query.filter;
        if (filter === "remaining") {
            query.completed = false;
        } else if (filter === "completed") {
            query.completed = true;
        }

        const data = { perPage, skip, query };
        const result = await orderService.fetchOrders(data);

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    fetchOrders,
};

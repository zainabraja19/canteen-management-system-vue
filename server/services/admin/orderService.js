const Order = require("../../models/orders");

const fetchOrders = async (data, callback) => {
    let totalOrders;
    let orders;
    try {
        totalOrders = await Order.find(data.query).count();

        orders = await Order.find(data.query)
            .sort({ completed: 1, orderDate: -1 })
            .skip(data.skip)
            .limit(data.perPage)
            .populate("employee", "empId name phone")
            .populate("items.item")
            .exec();

        return { orders, totalOrders };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchOrders,
};

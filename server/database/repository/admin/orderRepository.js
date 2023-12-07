const Order = require("../../models/orders");

const fetchOrders = async (data) => {
    let totalOrders;
    let orders;
    try {
        totalOrders = await Order.find(data.query).count();

        orders = await Order.find(data.query)
            .sort({ orderDate: -1 })
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

const completeOrder = async (data, callback) => {
    try {
        await Order.findOneAndUpdate(
            { orderId: data.orderId },
            { completed: true }
        );
        return `Order ${data.orderId} marked as complete.`;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchOrders,
    completeOrder,
};

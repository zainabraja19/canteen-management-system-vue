const Order = require("../../models/orders");

const placeOrder = async (data) => {
    try {
        const { employee, body } = data;
        let order = new Order({ employee, ...body });

        await order.save();
        await order.populate("items.item");

        return order;
    } catch (error) {
        throw error;
    }
};

const fetchOrders = async (data) => {
    try {
        const { query, skip, perPage } = data;
        const totalOrders = await Order.find(query).count();
        const orders = await Order.find(query)
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(perPage)
            .populate("employee", "empId name")
            .populate("items.item");

        return { totalOrders, orders };
    } catch (error) {
        throw error;
    }
};

const cancelOrder = async (data) => {
    try {
        return await Order.findOneAndUpdate(
            { employee: data.empId, orderId: data.orderId },
            { cancelled: true }
        );

        return "Order cancelled.";
    } catch (error) {
        throw error;
    }
};

module.exports = {
    placeOrder,
    fetchOrders,
    cancelOrder,
};

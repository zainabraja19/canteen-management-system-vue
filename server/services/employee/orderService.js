const Order = require("../../models/orders");

const placeOrder = async (data, callback) => {
    try {
        let order = new Order({ employee: data.empId, ...data.body });

        await order.save();
        await order.populate("items.item");

        return order;
    } catch (error) {
        throw error;
    }
};

const fetchOrders = async (data, callback) => {
    try {
        const { query, skip, perPage } = data;
        console.log(data);
        const totalOrders = await Order.find(query).count();
        const orders = await Order.find(query)
            .sort({ completed: 1, orderDate: -1 })
            .skip(skip)
            .limit(perPage)
            .populate("employee", "empId name")
            .populate("items.item");

        return { totalOrders, orders };
    } catch (error) {
        throw error;
    }
};

const cancelOrder = async (data, callback) => {
    try {
        await Order.findOneAndUpdate(
            { employee: data.empId, orderId: data.orderId },
            { cancelled: true }
        );

        return "Order cancelled.";
    } catch (error) {
        throw error;
    }
};

const generateInvoice = async (data, callback) => {};

module.exports = {
    placeOrder,
    fetchOrders,
    cancelOrder,
    generateInvoice,
};

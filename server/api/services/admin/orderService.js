const orderRepository = require("../../../database/repository/admin/orderRepository");

const fetchOrders = async (data) => {
    const { perPage, skip, filter } = data;

    let query = {};

    if (filter === "remaining") {
        query.completed = false;
        query.cancelled = false;
    } else if (filter === "completed") {
        query.completed = true;
        query.cancelled = false;
    } else if (filter === "cancelled") {
        query.completed = false;
        query.cancelled = true;
    }

    return await orderRepository.fetchOrders({ perPage, skip, query });
};

const completeOrder = async (data) => {
    return await orderRepository.completeOrder(data);
};

module.exports = {
    fetchOrders,
    completeOrder,
};

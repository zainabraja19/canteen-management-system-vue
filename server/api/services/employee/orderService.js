const orderRepository = require("../../../database/repository/employee/orderRepository");
const cartRepository = require("../../../database/repository/employee/cartRepository");
const { transporter, mailOptions } = require("../../helpers/emailConfig");
const { createInvoice } = require("../../helpers/invoice");
const { generateOrder } = require("../../helpers/razorpay");
const crypto = require("crypto");

const placeOrder = async (data) => {
    const { employee, body, empId, user } = data;

    const orderResult = await orderRepository.placeOrder({
        employee,
        body,
    });

    // Send the email
    transporter.sendMail(
        mailOptions(user, orderResult),
        function (error, info) {
            if (error) {
                throw error;
            }

            console.log("Email sent: " + info.response);
        }
    );

    await cartRepository.emptyCart({
        empId,
    });

    return { orderId: orderResult.orderId };
};

const fetchOrders = async (data) => {
    const { perPage, skip, queryFilter, employee } = data;
    const query = { employee };

    const filter = queryFilter;
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

    return await orderRepository.fetchOrders({
        perPage,
        skip,
        query,
    });
};

const cancelOrder = async (data) => {
    return await orderRepository.cancelOrder(data);
};

const generateInvoice = async (data) => {
    const { skip, perPage, employee, orderId } = data;

    const query = { employee, orderId };

    const result = await orderRepository.fetchOrders({ skip, perPage, query });

    if (!result || !result.orders || result.orders.length === 0) {
        throw new Error("Order not found");
    }

    return createInvoice(result.orders[0], "invoice.pdf");
};

const handlePayment = async (data) => {
    return await generateOrder(
        data.amount,
        process.env.RAZORPAY_DEFAULT_CURRENCY
    );
};

const verifyPayment = async (data) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        return "Payment verified successfully!";
    } else {
        throw new Error("Invalid signature sent!");
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

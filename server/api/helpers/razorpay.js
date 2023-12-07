const Razorpay = require("razorpay");
const shortid = require("shortid");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const generateOrder = async (amount, currency) => {
    const order = await razorpay.orders.create({
        amount,
        currency,
        receipt: `Receipt : ${shortid.generate()}`,
    });
    return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
    };
};

module.exports = {
    generateOrder,
};

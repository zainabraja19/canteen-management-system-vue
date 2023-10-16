const mongoose = require('mongoose');
const moment = require('moment');
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose);

const orderSchema = mongoose.Schema({
    employee: {
        type: String,
        required: true,
        ref: 'Employee',
    },
    orderId: {
        type: Number,
        unique: true,
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true,
            },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        // required: true, // Uncomment if it should be required
    },
    paymentMode: {
        type: String,
        // required: true, // Uncomment if it should be required
        enum: ['online', 'cod'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    orderDate: {
        type: Date,
        default: Date.now, // Use a function reference for default value
    },
});

// orderSchema.plugin(autoIncrement.plugin, {
//     model: 'Order',
//     field: 'orderId',
//     startAt: 1,
//     incrementBy: 1,
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

const mongoose = require('mongoose');
const moment = require('moment');
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose);

const orderSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
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
    cancelled: {
        type: Boolean,
        default: false
    },
    orderDate: {
        type: Date,
        default: Date.now, // Use a function reference for default value
    },
});

orderSchema.statics.getNextOrderId = async function () {
    const result = await this.findOne({}, {}, { sort: { orderId: -1 } });
    const maxOrderId = result ? result.orderId : 0;
    return maxOrderId + 1;
};

// Pre-save hook to set orderId before saving the document
orderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        this.orderId = await this.constructor.getNextOrderId();
    }
    next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

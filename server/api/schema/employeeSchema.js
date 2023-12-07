const Joi = require("joi");
const Cart = require("../../database/models/cart");
const Employee = require("../../database/models/employee");
const Order = require("../../database/models/orders");

// const fetchEmployeeFromParams = async () => {
//     const employee = Employee.findOne({ empId });

//     if (!employee) {
//         return "User not found";
//     }

//     return null;
// };

const employeeParamsSchema = Joi.object({
    empId: Joi.string()
        .required()
        .external(async (value, helpers) => {
            const employee = await Employee.findOne({ empId: value });
            if (!employee) {
                return helpers.message("User not found");
            }
            return value;
        }),
});

const orderParamsSchema = Joi.object({
    empId: Joi.string().required(),
    orderId: Joi.number()
        .required()
        .external(async (value, helpers) => {
            const employee = await Order.findOne({ orderId: value });
            if (!employee) {
                return helpers.message("Order not found");
            }
            return value;
        }),
});

const editEmployeeDetailsSchema = Joi.object({
    name: Joi.string().min(1).label("Employee name"),
    email: Joi.string().email().lowercase().trim().label("Email"),
    phone: Joi.string()
        .regex(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
        .min(10)
        .max(10)
        .trim()
        .label("Phone number"),
});

const itemSchema = Joi.object({
    item: Joi.string().required().label("Item Id"),
    quantity: Joi.number().required().min(0).max(10).label("Item Quantity"),
    price: Joi.number().required().min(0).max(1000).label("Item Price"),
});

const orderSchema = Joi.object({
    items: Joi.array().items(itemSchema.required()).required().label("Items"),
    totalItems: Joi.number().required().min(0).label("Total Items"),
    totalAmount: Joi.number().required().min(0).label("Total Amount"),
}).custom((value, helpers) => {
    const totalItems = value.items.reduce(
        (acc, item) => acc + item.quantity,
        0
    );
    if (totalItems !== value.totalItems) {
        return helpers.message(
            `Total items should match the sum of quantities.`
        );
    }

    const totalAmount = value.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );
    if (totalAmount !== value.totalAmount) {
        return helpers.message(
            `Total items should match the sum of quantities.`
        );
    }

    return value;
}, "calculate total items and total amount");

const addItemToCartSchema = Joi.object({
    itemId: Joi.string().required().label("Item Id"),
});

const removeItemFromCartSchema = Joi.object({
    itemId: Joi.string().required().label("Item Id"),
    deleteCount: Joi.number()
        .required()
        .min(0)
        .max(10)
        .label("Item Delete Count"),
});

const paymentSchema = Joi.object({
    amount: Joi.number()
        .required()
        .min(100)
        .max(100000)
        .external(async (value, helpers) => {
            const cart = await Cart.findOne({
                employee: helpers.prefs.context,
            });
            if (!cart) {
                return helpers.message("Cart not found for the user.");
            }

            if (cart.cartTotal * 100 !== value) {
                return helpers.message(
                    "Amount does not match with cart total."
                );
            }

            return value; // Return the validated value
        }, "amount"),
    currency: Joi.string().required().valid("INR"),
});

const verifyPaymentSchema = Joi.object({
    razorpay_payment_id: Joi.string().required(),
    razorpay_order_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
});

module.exports = {
    addItemToCartSchema,
    removeItemFromCartSchema,
    orderSchema,
    editEmployeeDetailsSchema,
    paymentSchema,
    verifyPaymentSchema,
    employeeParamsSchema,
    orderParamsSchema,
};

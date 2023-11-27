const Joi = require('joi');

const editEmployeeDetailsSchema = Joi.object({
    name: Joi.string().min(1).label('Employee name'),
    email: Joi.string().email().lowercase().trim().label('Email'),
    phone: Joi.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/).min(10).max(10).trim().label('Phone number')
})

const itemSchema = Joi.object({
    item: Joi.string().required().label('Item Id'),
    quantity: Joi.number().required().min(0).max(10).label('Item Quantity'),
    price: Joi.number().required().min(0).max(1000).label('Item Price')
});

const orderSchema = Joi.object({
    items: Joi.array().items(itemSchema.required()).required().label('Items'),
    totalItems: Joi.number().required().min(0).label('Total Items'),
    totalAmount: Joi.number().required().min(0).label('Total Amount')
}).custom((value, helpers) => {
    const totalItems = value.items.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems !== value.totalItems) {
        return helpers.message(`Total items should match the sum of quantities. Expected: ${totalItems}, Provided: ${value.totalItems}`
        );
    }

    const totalAmount = value.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    if (totalAmount !== value.totalAmount) {
        return helpers.message(`Total items should match the sum of quantities. Expected: ${totalAmount}, Provided: ${value.totalAmount}`
        );
    }

    return value;
}, 'calculate total items and total amount')

const addItemToCartSchema = Joi.object({
    itemId: Joi.string().required().label('Item Id'),
})

const removeItemFromCartSchema = Joi.object({
    itemId: Joi.string().required().label('Item Id'),
    deleteCount: Joi.number().required().min(0).max(10).label('Item Delete Count')
})

module.exports = { addItemToCartSchema, removeItemFromCartSchema, orderSchema, editEmployeeDetailsSchema }
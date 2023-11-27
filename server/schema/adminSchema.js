const Joi = require('joi');

const addMenuItemSchema = Joi.object({
    itemName: Joi.string().required(),
    price: Joi.number().required().min(0).max(1000)
})

const editMenuItemSchema = Joi.object({
    itemName: Joi.string(),
    price: Joi.number().min(0).max(1000),
    isAvailable: Joi.boolean()
})

module.exports = { addMenuItemSchema, editMenuItemSchema }
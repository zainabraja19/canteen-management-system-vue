const Joi = require("joi");
const Menu = require("../../database/models/menu");

const itemParamsSchema = Joi.object({
    itemId: Joi.string()
        .required()
        .external(async (value, helpers) => {
            try {
                const menuItem = await Menu.findById(value);
                if (!menuItem) {
                    return helpers.message("Item not found in menu");
                }
                return value;
            } catch (err) {
                return helpers.message(err.message);
            }
        }),
});

const addMenuItemSchema = Joi.object({
    itemName: Joi.string().required(),
    price: Joi.number().required().min(1).max(1000),
});

const editMenuItemSchema = Joi.object({
    itemName: Joi.string(),
    price: Joi.number().min(1).max(1000),
    isAvailable: Joi.boolean(),
});

module.exports = { addMenuItemSchema, editMenuItemSchema, itemParamsSchema };

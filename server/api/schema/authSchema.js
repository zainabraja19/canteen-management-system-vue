const Joi = require("joi");

const signupSchema = Joi.object({
    empId: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
    email: Joi.string()
        .email()
        .required()
        .regex(/^\S+@\S+\.\S+$/)
        .lowercase()
        .trim()
        .label("Value"),
    phone: Joi.string()
        .required()
        .min(10)
        .max(10)
        .regex(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
        .trim(),
    password: Joi.string().min(6).required().trim(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required().trim(),
});

module.exports = { signupSchema, loginSchema };

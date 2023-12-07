const validateRequestParams = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.params);
            // req.validatedData = value;
            next();
        } catch (error) {
            return res.status(404).json({
                data: null,
                error: error.details.map((detail) => detail.message)[0],
                status: 404,
            });
        }
    };
};

const validateRequestBody = (schema) => {
    return async (req, res, next) => {
        const empId = req.params.empId;

        try {
            await schema.validateAsync(req.body, {
                context: empId,
            });
            // req.validatedData = value;
            next();
        } catch (error) {
            console.error("Validation error:", error.details);
            return res.status(400).json({
                data: null,
                error: error.details.map((detail) => detail.message)[0],
                status: 400,
            });
        }
    };
};

module.exports = { validateRequestParams, validateRequestBody };

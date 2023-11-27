const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      console.log("in validator", req.body.items);
      const value = await schema.validateAsync(req.body);
      req.validatedData = value; // Store validated data in the request object if needed
      next();
    } catch (error) {
      console.error("Validation error:", error.details);
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }
  };
};

module.exports = { validateRequest };

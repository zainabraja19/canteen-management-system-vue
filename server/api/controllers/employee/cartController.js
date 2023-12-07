const cartService = require("../../services/employee/cartService");

const fetchCart = async (req, res) => {
    try {
        const result = await cartService.fetchCart({ empId: req.params.empId });

        res.status(200).json({
            data: result,
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const addToCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;
        const empId = req.params.empId;

        const result = await cartService.addToCart({ itemId, empId });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId, deleteCount } = req.body;
        const { empId } = req.params;

        const result = await cartService.removeFromCart({
            itemId,
            empId,
            deleteCount,
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const cartCount = async (req, res) => {
    try {
        const data = await cartService.cartCount({
            employee: req.params.empId,
        });

        res.status(200).json({
            data,
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    fetchCart,
    addToCart,
    removeFromCart,
    cartCount,
};

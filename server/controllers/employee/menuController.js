const menuService = require("../../services/employee/menuService");

const fetchMenu = async (req, res) => {
    try {
        const result = await menuService.findMenuItem({ isAvailable: true });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error.message,
            status: 400,
        });
    }
};

module.exports = {
    fetchMenu,
};

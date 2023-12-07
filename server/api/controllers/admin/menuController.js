const menuService = require("../../services/admin/menuService");

const fetchMenu = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const result = await menuService.fetchMenu({ perPage, skip });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const addItem = async (req, res) => {
    try {
        const result = await menuService.addItem(req.body);

        res.status(201).json({ data: result, status: 201 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const editItem = async (req, res) => {
    try {
        const result = await menuService.editItem({
            body: req.body,
            id: req.params.itemId,
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    fetchMenu,
    addItem,
    editItem,
};

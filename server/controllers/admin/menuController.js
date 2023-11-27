const menuService = require("../../services/admin/menuService");

const fetchMenu = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const data = { perPage, skip };
        const result = await menuService.fetchMenu(data);

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const addItem = async (req, res) => {
    try {
        const data = req.body;
        const result = await menuService.addItem(data);

        res.status(201).json({ data: result, status: 201 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const editItem = async (req, res) => {
    try {
        const data = { body: req.body, id: req.params.itemId };
        const result = await menuService.editItem(data);

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

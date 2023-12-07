const Menu = require("../../models/menu");

const fetchMenu = async (data) => {
    try {
        const result = await Menu.aggregate([
            {
                $facet: {
                    totalItems: [{ $count: "value" }],
                    menu: [{ $skip: data.skip }, { $limit: data.perPage }],
                },
            },
        ]);

        const totalItems = result[0].totalItems[0]?.value || 0;
        const menu = result[0].menu;

        return { menu, totalItems };
    } catch (error) {
        throw error;
    }
};

const addItem = async (data) => {
    try {
        const menuItem = new Menu(data);
        await menuItem.save();

        return "Added new item!";
    } catch (error) {
        throw error;
    }
};

const editItem = async (data) => {
    try {
        return await Menu.findByIdAndUpdate(
            data.id,
            { ...data.body },
            { new: true }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchMenu,
    addItem,
    editItem,
};

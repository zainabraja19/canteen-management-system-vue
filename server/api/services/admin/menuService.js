const menuRepository = require("../../../database/repository/admin/menuRepository");

const fetchMenu = async (data) => {
    return await menuRepository.fetchMenu(data);
};

const addItem = async (data) => {
    return await menuRepository.addItem(data);
};

const editItem = async (data) => {
    return await menuRepository.editItem(data);
};

module.exports = {
    fetchMenu,
    addItem,
    editItem,
};

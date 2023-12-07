const menuRepository = require("../../../database/repository/employee/menuRepository");

const fetchMenu = async (data) => {
    return await menuRepository.findMenuItem(data);
};

module.exports = {
    fetchMenu,
};

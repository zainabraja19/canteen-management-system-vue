const Menu = require("../../models/menu");

// const fetchMenu = async (data, callback) => {
//     try {
//         const menu = await Menu.find({ isAvailable: true })

//         callback(null, menu)
//     } catch (error) {
//         callback(error)
//     }
// }

const findMenuItem = async (data, callback) => {
    try {
        const menuItem = await Menu.find(data);

        return menuItem;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    // fetchMenu,
    findMenuItem,
};

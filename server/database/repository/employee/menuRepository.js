const Menu = require("../../models/menu");

// const fetchMenu = async (data, callback) => {
//     try {
//         const menu = await Menu.find({ isAvailable: true })

//         callback(null, menu)
//     } catch (error) {
//         callback(error)
//     }
// }

const findMenuItem = async (data) => {
    try {
        return await Menu.find(data);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    // fetchMenu,
    findMenuItem,
};
